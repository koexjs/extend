import { Koa, ExtendableTypes } from './types';

export interface ExtendAttributes { // methods or object
  [key: string]: any;
};

export const extendBatch = (app: Koa, type: ExtendableTypes, attributes: ExtendAttributes) => {
  if (type === 'application') {
    assign(app, attributes, app.context, app);
  } else {
    assign(app[type], attributes, app.context, app);
  }
};

function assign<T>(origin: T, attributes: ExtendAttributes, ctx: Koa.BaseContext, app: Koa) {
  const proto = origin;
  for (const key in attributes) {
    (proto as any).__defineGetter__(key, function () {
      return attributes[key];
    });
  }
}
