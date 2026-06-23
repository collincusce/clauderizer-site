import {
  Stack,
  StackProps,
  RemovalPolicy,
  Duration,
  Tags,
  CfnOutput,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_route53_targets as targets,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * The Clauderizer marketing site stack (us-east-1).
 *
 *  - Private S3 bucket (no public access) served only through CloudFront OAC.
 *  - One ACM cert covering all 5 apexes + their www (INVARIANT-05: us-east-1).
 *  - One CloudFront distribution holding all 10 names; a viewer-request Function
 *    serves the canonical apex and 301-redirects every other host to it.
 *  - Route53 A/AAAA aliases (apex + www) in each of the 5 hosted zones.
 *  - Cost-allocation tag project=clauderizer-site on every resource.
 *
 * Hosted zones are imported by id from cdk.json context. Those ids are
 * PLACEHOLDERS until O-02 is resolved (creds are denied route53:ListHostedZones,
 * so fromLookup can't run) — synth is valid offline; deploy needs the real ids.
 */
export class SiteStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const canonical = (this.node.tryGetContext('canonical') as string) || 'clauderizer.com';
    const tlds = (this.node.tryGetContext('tlds') as string[]) || ['com', 'co', 'io', 'net', 'org'];
    const zoneIds = (this.node.tryGetContext('zoneIds') as Record<string, string>) || {};

    // Cost allocation — applies to every resource in the stack.
    Tags.of(this).add('project', 'clauderizer-site');

    const apexes = tlds.map((t) => `clauderizer.${t}`);
    const allNames = apexes.flatMap((a) => [a, `www.${a}`]); // 10 names

    // --- private content bucket (served only via CloudFront OAC) ---
    const bucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `clauderizer-site-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // --- hosted zones (imported by id; placeholders until O-02) ---
    const zones: Record<string, route53.IHostedZone> = {};
    for (const apex of apexes) {
      zones[apex] = route53.HostedZone.fromHostedZoneAttributes(this, `Zone-${apex}`, {
        hostedZoneId: zoneIds[apex] ?? `ZPLACEHOLDER${apex.toUpperCase().replace(/[^A-Z]/g, '')}`,
        zoneName: apex,
      });
    }

    // --- ACM cert (us-east-1) covering all names, DNS-validated per zone ---
    const validationZones: Record<string, route53.IHostedZone> = {};
    for (const name of allNames) {
      validationZones[name] = zones[name.replace(/^www\./, '')];
    }
    const certificate = new acm.Certificate(this, 'SiteCert', {
      domainName: canonical,
      subjectAlternativeNames: allNames.filter((n) => n !== canonical),
      validation: acm.CertificateValidation.fromDnsMultiZone(validationZones),
    });

    // --- viewer-request function: serve canonical, 301 everything else to it ---
    const redirectFn = new cloudfront.Function(this, 'CanonicalRedirect', {
      comment: 'Serve the canonical apex; 301 www + non-canonical TLDs to it.',
      code: cloudfront.FunctionCode.fromInline(
        [
          'function handler(event) {',
          '  var req = event.request;',
          '  var host = req.headers.host.value;',
          `  if (host !== '${canonical}') {`,
          '    return {',
          "      statusCode: 301,",
          "      statusDescription: 'Moved Permanently',",
          `      headers: { location: { value: 'https://${canonical}' + req.uri } }`,
          '    };',
          '  }',
          '  return req;',
          '}',
        ].join('\n')
      ),
    });

    // --- the distribution (all 10 names; private S3 origin via OAC) ---
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      comment: 'Clauderizer marketing site',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        functionAssociations: [
          { function: redirectFn, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      domainNames: allNames,
      certificate,
      defaultRootObject: 'index.html',
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: Duration.minutes(5) },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html', ttl: Duration.minutes(5) },
      ],
    });

    // --- Route53 alias records: apex + www in every zone -> the distribution ---
    const aliasTarget = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));
    for (const apex of apexes) {
      const zone = zones[apex];
      new route53.ARecord(this, `A-${apex}`, { zone, target: aliasTarget, recordName: apex });
      new route53.AaaaRecord(this, `AAAA-${apex}`, { zone, target: aliasTarget, recordName: apex });
      new route53.ARecord(this, `A-www-${apex}`, { zone, target: aliasTarget, recordName: `www.${apex}` });
      new route53.AaaaRecord(this, `AAAA-www-${apex}`, {
        zone,
        target: aliasTarget,
        recordName: `www.${apex}`,
      });
    }

    new CfnOutput(this, 'BucketName', { value: bucket.bucketName, description: 'S3 sync target' });
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution to invalidate after a deploy',
    });
    new CfnOutput(this, 'DistributionDomain', { value: distribution.distributionDomainName });
  }
}
