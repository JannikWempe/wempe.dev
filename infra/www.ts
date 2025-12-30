import { hostname } from "./dns";

const plausibleOrigin = {
  domainName: "plausible.io",
  originId: "plausibleCustomOrigin",
  customOriginConfig: {
    httpPort: 80,
    httpsPort: 443,
    originSslProtocols: ["TLSv1.2"],
    originProtocolPolicy: "https-only",
  },
} satisfies aws.types.input.cloudfront.DistributionOrigin;

const analyticsScriptBehavior = {
  pathPattern: "/js/script.*",
  targetOriginId: plausibleOrigin.originId,
  viewerProtocolPolicy: "https-only",
  allowedMethods: ["GET", "HEAD"],
  cachedMethods: ["GET", "HEAD"],
  defaultTtl: 0,
  maxTtl: 0,
  compress: false,
  forwardedValues: {
    cookies: {
      forward: "none",
    },
    queryString: false,
  },
} satisfies $util.UnwrappedArray<
  $util.Input<aws.types.input.cloudfront.DistributionOrderedCacheBehavior>
>[number];

const eventApiBehavior = {
  pathPattern: "/api/event",
  targetOriginId: plausibleOrigin.originId,
  viewerProtocolPolicy: "https-only",
  originRequestPolicyId: "acba4595-bd28-49b8-b9fe-13317c0390fa",
  // See https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html
  cachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
  allowedMethods: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
  cachedMethods: ["GET", "HEAD"],
} satisfies $util.UnwrappedArray<
  $util.Input<aws.types.input.cloudfront.DistributionOrderedCacheBehavior>
>[number];

export const astro = new sst.aws.Astro("Astro", {
  path: "apps/www",
  dev: {
    autostart: true,
    command: "astro dev",
  },
  server: {
    architecture: "arm64",
    runtime: "nodejs22.x",
  },
  domain: {
    name: hostname,
    dns: sst.cloudflare.dns(),
    redirects: [`www.${hostname}`],
  },
  transform: {
    cdn: (args) => {
      args.origins = $resolve(args.origins).apply((val) => [
        ...val,
        plausibleOrigin,
      ]);

      args.orderedCacheBehaviors = $resolve(
        args.orderedCacheBehaviors || [],
      ).apply((val) => [...val, analyticsScriptBehavior, eventApiBehavior]);
    },
  },
});

export const outputs = {
  www: astro.url,
};
