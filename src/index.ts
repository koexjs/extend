import { Koa, ExtendableTypes } from './types';
export { extendBatch } from './batch';

export const extend = (app: Koa, type: ExtendableTypes, key: string, body: any) => {
  const proto = type === 'application' ? app : app[type];
  (proto as any).__defineGetter__(key, function () {
    return body;
  })
}

export default extend;