export const imagesBucket = $app.stage === 'prod' ? new sst.cloudflare.Bucket('Images') : null;
