# extend

[![NPM version](https://img.shields.io/npm/v/@koex/extend.svg?style=flat)](https://www.npmjs.com/package/@koex/extend)
[![Coverage Status](https://img.shields.io/coveralls/koexjs/extend.svg?style=flat)](https://coveralls.io/r/koexjs/extend)
[![Dependencies](https://img.shields.io/david/koexjs/extend.svg)](https://github.com/koexjs/extend)
[![Build Status](https://travis-ci.com/koexjs/extend.svg?branch=master)](https://travis-ci.com/koexjs/extend)
![license](https://img.shields.io/github/license/koexjs/extend.svg)
[![issues](https://img.shields.io/github/issues/koexjs/extend.svg)](https://github.com/koexjs/extend/issues)

> extend for koa extend.

### Install

```
$ npm install @koex/extend
```

### Usage

```javascript
// See more in test
import extend, { extendBatch } from '@koex/extend';

import * as Koa from 'koa';

declare module 'koa' {
  export interface Context {
    render(html: string): Promise<any>;
    logger(html: string): void;
  }
}

const app = new Koa();

extend(app, 'context', 'render', async function (html: string) {
  const ctx: Koa.Context = this;
  ctx.body = html;
});

// or extend batch
extendBatch(app, 'context', {
  async render(html: string) {
    const ctx: Koa.Context = this;
    ctx.body = html;
  },
  logger(message: string) {
    console.log(message);
  },
});

app.use(router.post('/', ctx => {
  ctx.logger('post: ', ctx.path, ctx.query, ctx.request.body);
  await ctx.render(`
    <h1>Hello, World</h1>
  `);
}));

app.listen(8000, '0.0.0.0', () => {
  console.log('koa server start at port: 8000');
});
```

### Related
* [eggjs](https://github.com/eggjs)
* [thinkjs](https://github.com/thinkjs)