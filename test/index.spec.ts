import * as Koa from 'koa';
import Cache from '@zcorky/cache';
import * as request from 'supertest';
import 'should';

import extend, { extendBatch } from '../src';

declare module 'koa' {

  export interface Application extends Koa {
    logger(message: string): void;
  }
  export interface Context {
    logger(message: string): void;
    cache: Cache<string, any>;
    render(html: string): void
  }

  export interface Request {
    logger(message: string): void;
  }

  export interface Response {
    logger(message: string): void;
  }
}

describe('koa extend', () => {
  describe('extend types', () => {
    it('application', async () => {
      const app = new Koa() as Koa.Application;
      extend(app, 'application', 'logger', function (message) {
        message.should.equal('test application logger');
      });

      app.use(async ctx => {
        (typeof app.logger).should.equal('function');
        app.logger('test application logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });

    it('context', async () => {
      const app = new Koa();
      extend(app, 'context', 'logger', function (message) {
        message.should.equal('test context logger');
      });

      app.use(async ctx => {
        (typeof ctx.logger).should.equal('function');
        ctx.logger('test context logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });

    it('request', async () => {
      const app = new Koa();
      extend(app, 'request', 'logger', function (message) {
          message.should.equal('test request logger');
      });

      app.use(async ctx => {
        (typeof ctx.request.logger).should.equal('function');
        ctx.request.logger('test request logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });

    it('response', async () => {
      const app = new Koa();
      extend(app, 'response', 'logger', function (message) {
        message.should.equal('test response logger');
      });

      app.use(async ctx => {
        (typeof ctx.response.logger).should.equal('function');
        ctx.response.logger('test response logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });
  });

  describe('extend cache example', () => {
    it('should work with cache', async () => {
      const app = new Koa();
      extend(app, 'context', 'cache', new Cache<string, any>(100));

      app.use(async (ctx, next) => {
        ctx.cache.set('key', 'value');
        (ctx as any).cache2 = ctx.cache;

        await next();
      });

      app.use(async ctx => {
        ctx.should.have.property('cache');
        (typeof ctx.cache.get).should.equal('function');
        (typeof ctx.cache.set).should.equal('function');
        ctx.cache.get('key').should.equal('value');
        ((ctx as any).cache2 === ctx.cache).should.equal(true);
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });
  });

  describe('extend ejs example', () => {
    it('should work with render', async () => {
      const app = new Koa();
      extend(app, 'context', 'render', function (html: string) {
        const ctx = this as Koa.Context;
        html.should.equal(JSON.stringify({ foo: 'bar' }));
        ctx.body = html;
      });

      app.use(async ctx => {
        ctx.should.have.property('render');
        ctx.render(JSON.stringify({ foo: 'bar' }));
      });

      await request(app.listen())
        .post('/')
        .expect(200, JSON.stringify({ foo: 'bar' }));
    });
  });
});

/** extend batch */
describe('koa extendBatch', () => {
  describe('extendBatch types', () => {
    it('application', async () => {
      const app = new Koa() as Koa.Application;
      extendBatch(app, 'application', {
        logger(message) {
          message.should.equal('test application logger');
        },
      });

      app.use(async ctx => {
        (typeof app.logger).should.equal('function');
        app.logger('test application logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });

    it('context', async () => {
      const app = new Koa();
      extendBatch(app, 'context', {
        logger(message) {
          message.should.equal('test context logger');
        },
      });

      app.use(async ctx => {
        (typeof ctx.logger).should.equal('function');
        ctx.logger('test context logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });

    it('request', async () => {
      const app = new Koa();
      extendBatch(app, 'request', {
        logger(message) {
          message.should.equal('test request logger');
        },
      });

      app.use(async ctx => {
        (typeof ctx.request.logger).should.equal('function');
        ctx.request.logger('test request logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });

    it('response', async () => {
      const app = new Koa();
      extendBatch(app, 'response', {
        logger(message) {
          message.should.equal('test response logger');
        },
      });

      app.use(async ctx => {
        (typeof ctx.response.logger).should.equal('function');
        ctx.response.logger('test response logger');
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });
  });

  describe('extendBatch cache example', () => {
    it('should work with cache', async () => {
      const app = new Koa();
      extendBatch(app, 'context', {
        cache: new Cache<string, any>(100),
      });

      app.use(async (ctx, next) => {
        ctx.cache.set('key', 'value');
        (ctx as any).cache2 = ctx.cache;

        await next();
      });

      app.use(async ctx => {
        ctx.should.have.property('cache');
        (typeof ctx.cache.get).should.equal('function');
        (typeof ctx.cache.set).should.equal('function');
        ctx.cache.get('key').should.equal('value');
        ((ctx as any).cache2 === ctx.cache).should.equal(true);
        ctx.body = { foo: 'bar' };
      });

      await request(app.listen())
        .post('/')
        .send({ foo: 'bar' })
        .expect(200, { foo: 'bar' });
    });
  });

  describe('extendBatch ejs example', () => {
    it('should work with render', async () => {
      const app = new Koa();
      extendBatch(app, 'context', {
        render(html: string) {
          const ctx = this as Koa.Context;
          html.should.equal(JSON.stringify({ foo: 'bar' }));
          ctx.body = html;
        },
      });

      app.use(async ctx => {
        ctx.should.have.property('render');
        ctx.render(JSON.stringify({ foo: 'bar' }));
      });

      await request(app.listen())
        .post('/')
        .expect(200, JSON.stringify({ foo: 'bar' }));
    });
  });
});
