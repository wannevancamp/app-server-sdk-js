import {AppServer, AppConfigurationInterface} from "@friendsofshopware/app-server-sdk";
import {CloudflareShopRepository} from "@friendsofshopware/app-server-sdk-cloudflare";

const cfg: AppConfigurationInterface = {
    appName: 'Test',
    appSecret: 'testSecret',
    authorizeCallbackUrl: 'https://xxxx.shyim.workers.dev/authorize/callback'
};

interface Env {
  shopStorage: KVNamespace
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const app = new AppServer(cfg, new CloudflareShopRepository(env.shopStorage));

    if (url.pathname.startsWith('/authorize/callback')) {
        return await app.registration.authorizeCallback(request);
    }

    if (url.pathname.startsWith('/authorize')) {
        return await app.registration.authorize(request);
    }

    return new Response(`Not found`)
  }
}