/**
 * The living memory-graph — the site's signature WebGL centerpiece.
 *
 * Story: a cloud of scattered, dim "memories" (amnesia) blooms into a
 * structured, glowing dependency graph (durable memory). Nodes map to real
 * Clauderizer entity types — phases, decisions, invariants, subsystems,
 * lessons — not abstract noise (Phase 2 exit criterion).
 *
 * Lean by design: no postprocessing pass (bloom is faked with additive halo
 * sprites), capped DPR, node count scales down on compact screens, and the
 * render loop pauses when the hero is offscreen or the tab is hidden.
 *
 * Callers MUST gate on supportsWebGL() && !prefersReducedMotion() and render
 * the static poster otherwise (INVARIANT-03).
 */
import * as THREE from 'three';

export interface MemoryGraphHandle {
  destroy(): void;
  /** 0 = amnesia fog, 1 = fully remembered. Driven by the intro + scroll. */
  setCoherence(v: number): void;
}

type NodeType = 'phase' | 'decision' | 'invariant' | 'subsystem' | 'lesson';

const TYPE_COLOR: Record<NodeType, THREE.Color> = {
  phase: new THREE.Color('#e08a5e'), // clay
  decision: new THREE.Color('#ffb454'), // amber
  invariant: new THREE.Color('#f4efe6'), // cream
  subsystem: new THREE.Color('#79a6cf'), // cool steel — depth contrast
  lesson: new THREE.Color('#9aa0b0'), // muted
};

/** Curated hubs that get DOM labels — real entities from this very gameplan. */
const HUBS: { type: NodeType; label: string }[] = [
  { type: 'phase', label: 'phase 4 / 10' },
  { type: 'decision', label: 'D-003 · media pipeline' },
  { type: 'invariant', label: 'INVARIANT-03 · fallbacks' },
  { type: 'subsystem', label: 'subsys.memory-graph' },
  { type: 'lesson', label: 'lesson #10 · scroll-scrub' },
  { type: 'decision', label: 'cz_cascade ✓' },
];

interface InitOpts {
  canvas: HTMLCanvasElement;
  /** Optional layer for DOM labels positioned over projected node coords. */
  labelLayer?: HTMLElement | null;
  compact?: boolean;
}

export function initMemoryGraph(opts: InitOpts): MemoryGraphHandle {
  const { canvas, labelLayer } = opts;
  const compact = opts.compact ?? false;

  const NODE_COUNT = compact ? 46 : 88;
  const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !compact,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0d12, 0.018);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 300);
  camera.position.set(0, 0, 62);

  const group = new THREE.Group();
  scene.add(group);

  // --- Node layout: a flattened galaxy disc so it reads as a graph, not a ball.
  type Node = {
    home: THREE.Vector3; // structured (remembered) position
    fog: THREE.Vector3; // scattered (amnesia) position
    type: NodeType;
    size: number;
    hub: number; // index into HUBS, or -1
  };
  const nodes: Node[] = [];
  const types: NodeType[] = ['phase', 'decision', 'invariant', 'subsystem', 'lesson'];

  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / NODE_COUNT;
    // Spiral-ish disc for the remembered layout.
    const arm = (i % 3) * ((Math.PI * 2) / 3);
    const radius = 6 + t * 34 + (Math.random() - 0.5) * 6;
    const angle = arm + t * 5.2 + (Math.random() - 0.5) * 0.5;
    const home = new THREE.Vector3(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 16 * (1 - t * 0.4),
      Math.sin(angle) * radius * 0.7
    );
    // Amnesia: far, scattered, formless.
    const fog = new THREE.Vector3(
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 110,
      (Math.random() - 0.5) * 150
    );
    const type = i < HUBS.length ? HUBS[i].type : types[Math.floor(Math.random() * types.length)];
    const isHub = i < HUBS.length;
    nodes.push({
      home,
      fog,
      type,
      size: isHub ? 2.6 : 0.7 + Math.random() * 1.1,
      hub: isHub ? i : -1,
    });
  }

  // --- Edges: structured spine (phase chain) + nearest-neighbour mesh.
  const edges: [number, number][] = [];
  for (let i = 1; i < nodes.length; i++) {
    // each node links to a couple of earlier nodes -> a connected DAG feel
    const links = 1 + (Math.random() < 0.4 ? 1 : 0);
    for (let l = 0; l < links; l++) {
      const j = Math.max(0, i - 1 - Math.floor(Math.random() * Math.min(i, 6)));
      if (j !== i) edges.push([i, j]);
    }
  }

  // --- Geometry: positions + colors (shared buffers, lerped each frame).
  const positions = new Float32Array(NODE_COUNT * 3);
  const colors = new Float32Array(NODE_COUNT * 3);
  const sizes = new Float32Array(NODE_COUNT);
  for (let i = 0; i < NODE_COUNT; i++) {
    const c = TYPE_COLOR[nodes[i].type];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = nodes[i].size;
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const sprite = makeGlowTexture();

  // Custom points shader: round, soft, additive, size-attenuated, glowy.
  const nodeMat = new THREE.ShaderMaterial({
    uniforms: {
      uTex: { value: sprite },
      uScale: { value: (renderer.getSize(new THREE.Vector2()).y || 1) * dpr },
      uGlow: { value: 0.0 },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      varying vec3 vColor;
      uniform float uScale;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uScale * (1.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex;
      uniform float uGlow;
      varying vec3 vColor;
      void main() {
        vec4 tex = texture2D(uTex, gl_PointCoord);
        gl_FragColor = vec4(vColor * (1.2 + uGlow), tex.a) * tex.a;
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });
  const points = new THREE.Points(nodeGeo, nodeMat);
  group.add(points);

  // --- Edge lines (positions rebuilt each frame from node positions).
  const edgePos = new Float32Array(edges.length * 2 * 3);
  const edgeCol = new Float32Array(edges.length * 2 * 3);
  for (let e = 0; e < edges.length; e++) {
    const c = TYPE_COLOR[nodes[edges[e][0]].type];
    for (let k = 0; k < 2; k++) {
      const o = (e * 2 + k) * 3;
      edgeCol[o] = c.r * 0.8;
      edgeCol[o + 1] = c.g * 0.8;
      edgeCol[o + 2] = c.b * 0.8;
    }
  }
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
  edgeGeo.setAttribute('color', new THREE.BufferAttribute(edgeCol, 3));
  const edgeMat = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
  });
  const lines = new THREE.LineSegments(edgeGeo, edgeMat);
  group.add(lines);

  // --- DOM labels for the curated hubs.
  const labelEls: { el: HTMLElement; nodeIndex: number }[] = [];
  if (labelLayer && !compact) {
    nodes.forEach((n, i) => {
      if (n.hub < 0) return;
      const el = document.createElement('span');
      el.className = `mg-label mg-${n.type}`;
      el.textContent = HUBS[n.hub].label;
      el.style.opacity = '0';
      labelLayer.appendChild(el);
      labelEls.push({ el, nodeIndex: i });
    });
  }

  // --- Interaction + state.
  let coherence = 0; // 0 fog -> 1 remembered
  let targetCoherence = 0;
  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  let running = true;
  let raf = 0;
  const tmp = new THREE.Vector3();
  const projected = new THREE.Vector3();

  const onPointer = (e: PointerEvent) => {
    pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const sizeTo = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    nodeMat.uniforms.uScale.value = h * 0.55;
  };
  sizeTo();
  window.addEventListener('resize', sizeTo, { passive: true });

  let last = 0;
  const render = (time: number) => {
    if (!running) return;
    raf = requestAnimationFrame(render);
    const dt = Math.min((time - last) / 1000, 0.05) || 0.016;
    last = time;

    coherence += (targetCoherence - coherence) * Math.min(dt * 2.2, 1);
    pointer.x += (pointerTarget.x - pointer.x) * Math.min(dt * 3, 1);
    pointer.y += (pointerTarget.y - pointer.y) * Math.min(dt * 3, 1);

    // ease the coherence for nicer bloom
    const k = coherence * coherence * (3 - 2 * coherence); // smoothstep

    // lerp node positions fog -> home
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      tmp.lerpVectors(n.fog, n.home, k);
      // subtle perpetual drift
      const f = time * 0.0004 + i;
      tmp.x += Math.sin(f) * 0.5 * k;
      tmp.y += Math.cos(f * 0.9) * 0.5 * k;
      positions[i * 3] = tmp.x;
      positions[i * 3 + 1] = tmp.y;
      positions[i * 3 + 2] = tmp.z;
    }
    nodeGeo.attributes.position.needsUpdate = true;
    nodeMat.uniforms.uGlow.value = k * 0.8;

    // rebuild edges from node positions
    for (let e = 0; e < edges.length; e++) {
      const [a, b] = edges[e];
      const oa = (e * 2) * 3;
      const ob = (e * 2 + 1) * 3;
      edgePos[oa] = positions[a * 3];
      edgePos[oa + 1] = positions[a * 3 + 1];
      edgePos[oa + 2] = positions[a * 3 + 2];
      edgePos[ob] = positions[b * 3];
      edgePos[ob + 1] = positions[b * 3 + 1];
      edgePos[ob + 2] = positions[b * 3 + 2];
    }
    edgeGeo.attributes.position.needsUpdate = true;
    edgeMat.opacity = k * 0.22;

    // camera / group motion: slow auto-orbit + pointer parallax
    group.rotation.y = time * 0.00004 + pointer.x * 0.35;
    group.rotation.x = pointer.y * 0.2;
    camera.position.x += (pointer.x * 6 - camera.position.x) * Math.min(dt * 2, 1);
    camera.position.y += (-pointer.y * 4 - camera.position.y) * Math.min(dt * 2, 1);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    // project hub labels to screen
    if (labelEls.length) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      for (const { el, nodeIndex } of labelEls) {
        projected.set(
          positions[nodeIndex * 3],
          positions[nodeIndex * 3 + 1],
          positions[nodeIndex * 3 + 2]
        );
        projected.applyMatrix4(group.matrixWorld);
        projected.project(camera);
        const visible = projected.z < 1 && k > 0.55;
        if (!visible) {
          el.style.opacity = '0';
          continue;
        }
        const x = (projected.x * 0.5 + 0.5) * w;
        const y = (-projected.y * 0.5 + 0.5) * h;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        el.style.opacity = String((k - 0.55) / 0.45 * 0.92);
      }
    }
  };
  raf = requestAnimationFrame(render);

  // pause when offscreen / hidden
  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries[0]?.isIntersecting ?? true;
      if (vis && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(render);
      } else if (!vis && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { rootMargin: '0px' }
  );
  io.observe(canvas);

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(render);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    setCoherence(v: number) {
      targetCoherence = Math.max(0, Math.min(1, v));
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', sizeTo);
      document.removeEventListener('visibilitychange', onVisibility);
      labelEls.forEach(({ el }) => el.remove());
      nodeGeo.dispose();
      edgeGeo.dispose();
      nodeMat.dispose();
      edgeMat.dispose();
      sprite.dispose();
      renderer.dispose();
    },
  };
}

/** Soft radial glow sprite for node points. */
function makeGlowTexture(): THREE.Texture {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.55, 'rgba(255,255,255,0.25)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}
