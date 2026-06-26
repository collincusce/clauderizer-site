#!/usr/bin/env bash
# Clauderizer per-card "type-on" engine (local ffmpeg, 0 credits, pixel-perfect).
# Detects text lines from pixels, masks each with a local-bg cover, sweep-reveals
# left-to-right (stepped ~per char) with a blinking cursor, + drift-free push-in.
# Set CARDS_DIR/OUT for your machine. Usage: bash typeon.sh "recall stripe ..."
set -u
CARDS_DIR=/c/Users/rafaj/AppData/Local/Temp/cz-cards    # source card PNGs (9:16)
OUT=/c/Users/rafaj/AppData/Local/Temp/cz-typeon         # output dir
QA="$OUT/qa"
mkdir -p "$OUT" "$QA"
FPS=30; DUR=5; DUR2=6; TS=0.30; TEND=3.80; CW=18; HPAD=24; PADV=26; BIN=80
CARDS="${1:-loop recall stripe filetree doc cascaderep gitdiff userprompt preflight handoff}"

sample_hex(){ # x y w h -> RRGGBB (avg)
  ffmpeg -v error -i "$SRC" -vf "crop=$3:$4:$1:$2,scale=1:1,format=rgb24" -f rawvideo - 2>/dev/null | od -An -tu1 | awk '{printf "%02X%02X%02X",$1,$2,$3}'
}

for name in $CARDS; do
  SRC="$CARDS_DIR/${name}.png"
  if [ ! -f "$SRC" ]; then echo "[$name] MISSING"; continue; fi
  read W H < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$SRC" | tr ',' ' ' | tr -d '\r')
  W=$(echo "$W" | tr -dc '0-9'); H=$(echo "$H" | tr -dc '0-9')   # ffprobe emits CRLF on Windows
  # binarized row profile -> merged bands (only bright glyph/line rows survive)
  RAWBANDS=$(ffmpeg -v error -i "$SRC" -vf "format=gray,geq=lum='if(gt(lum(X,Y),${BIN}),255,0)',scale=1:${H}:flags=area" -f rawvideo - 2>/dev/null | od -An -tu1 -v | tr -s ' ' '\n' | grep -v '^$' | awk -v th=2 -v merge=34 '{v[NR]=$1;n=NR} END{inb=0; for(y=1;y<=n;y++){ if(v[y]>th){ if(!inb){s=y;inb=1}; e=y } else { if(inb && (y-e)>merge){ print s","e; inb=0 } } } if(inb) print s","e }')
  W40=$((W*2/5)); HTOP=$((H*3/10))
  YT=(); YB=(); XL=(); XR=()
  while IFS=, read yt yb; do
    [ -z "$yt" ] && continue
    h=$((yb-yt+1))
    read xlo xhi < <(ffmpeg -v error -i "$SRC" -vf "crop=${W}:${h}:0:${yt},format=gray,geq=lum='if(gt(lum(X,Y),${BIN}),255,0)',scale=${W}:1:flags=area" -f rawvideo - 2>/dev/null | od -An -tu1 -v | tr -s ' ' '\n' | grep -v '^$' | awk -v th=1 -v W=$W '{if($1>th){if(lo=="")lo=NR;hi=NR}}END{print (lo==""?1:lo), (hi==""?W:hi)}')
    lw=$((xhi-xlo))
    # skip logo/icon: narrow element in top region stays persistent (not typed)
    if [ $lw -lt $W40 ] && [ $yt -lt $HTOP ]; then continue; fi
    YT+=($yt); YB+=($yb); XL+=($xlo); XR+=($xhi)
  done <<< "$RAWBANDS"
  NL=${#YT[@]}
  if [ "$NL" -lt 1 ]; then echo "[$name] ${W}x${H} no text bands"; continue; fi
  D=$(awk -v a=$TS -v b=$TEND -v n=$NL 'BEGIN{printf "%.4f",(b-a)/n}')
  echo "[$name] ${W}x${H}  lines=$NL  D=${D}s"
  COVSRC=""; CURSRC=""; OVL=""; cur="base"
  for ((i=0;i<NL;i++)); do
    yt=${YT[$i]}; yb=${YB[$i]}; xl=${XL[$i]}; xr=${XR[$i]}; k=$((i+1)); h=$((yb-yt+1)); lw=$((xr-xl)); [ $lw -lt 1 ] && lw=1
    sx=$((xl-40)); if [ $sx -lt 5 ]; then sx=$((xr+12)); fi; sw=20; if [ $((sx+sw)) -gt $W ]; then sx=$((W-sw-2)); fi
    BG=$(sample_hex $sx $yt $sw $h); LUMA=$((16#${BG:0:2}))
    if [ "$LUMA" -gt 45 ]; then BG=$(sample_hex $((W-30)) $((H-30)) 20 20); fi   # guard: fell on text -> corner bg
    cw=$((lw+2*HPAD)); ch=$((h+2*PADV)); xs=$((xl-HPAD)); travel=$cw; yc=$((yt-PADV))
    N=$(awk -v w=$lw -v c=$CW 'BEGIN{n=int(w/c+0.5); if(n<1)n=1; print n}')
    T0=$(awk -v ts=$TS -v d=$D -v kk=$k 'BEGIN{printf "%.4f",ts+(kk-1)*d}')
    T1=$(awk -v t0=$T0 -v d=$D 'BEGIN{printf "%.4f",t0+d}')
    X="${xs}+(floor(min(max((t-${T0})/${D},0),1)*${N})/${N})*${travel}"   # stepped frontier (single-quoted in graph -> commas safe)
    COVSRC+="color=c=0x${BG}:s=${cw}x${ch}:r=${FPS}:d=${DUR2},format=rgb24[cov${k}];"
    CURSRC+="color=c=0xFFB454:s=14x${h}:r=${FPS}:d=${DUR2},format=rgb24[cur${k}];"
    if [ "$k" -eq "$NL" ]; then EN="between(t,${T0},${T1})+gt(t,${TEND})*lt(mod(t,0.8),0.45)"; else EN="between(t,${T0},${T1})"; fi
    OVL+="[${cur}][cov${k}]overlay=x='${X}':y=${yc}[a${k}];[a${k}][cur${k}]overlay=x='${X}':y=${yt}:enable='${EN}'[b${k}];"; cur="b${k}"
  done
  # drift-free push-in: crop has no eval=frame in our build, so animate scale instead
  ZOOM="scale=1080:1920,scale=w='1080*(1+0.03*t/5)':h='1920*(1+0.03*t/5)':eval=frame,crop=1080:1920:(in_w-out_w)/2:(in_h-out_h)/2,format=yuv420p[outv]"
  F="[0:v]format=rgb24[base];${COVSRC}${CURSRC}${OVL}[${cur}]${ZOOM}"
  if ffmpeg -y -loop 1 -framerate $FPS -t $DUR -i "$SRC" -filter_complex "$F" -map "[outv]" -r $FPS -t $DUR -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p "$OUT/${name}.mp4" 2>/tmp/ff_${name}.txt; then
    ffmpeg -y -ss 2.00 -i "$OUT/${name}.mp4" -frames:v 1 "$QA/${name}_mid.png" 2>/dev/null
    ffmpeg -y -ss 4.90 -i "$OUT/${name}.mp4" -frames:v 1 "$QA/${name}_last.png" 2>/dev/null
    echo "   -> built $(ls -la "$OUT/${name}.mp4" | awk '{print $5}') bytes"
  else
    echo "   !! FFMPEG FAILED"; tail -4 /tmp/ff_${name}.txt
  fi
done
echo "DONE. clips in $OUT"
