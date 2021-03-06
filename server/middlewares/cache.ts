import { Service } from "typedi";
import { MiddlewareInterface, ResolverData, NextFn } from "type-graphql";

import { IContext } from "../typing";

@Service()
export default class CacheMiddleware implements MiddlewareInterface<IContext> {
  async use({ context, info }: ResolverData<IContext>, next: NextFn) {
    info.cacheControl.setCacheHint({ maxAge: 3600 });
    return await next();
  }
}
