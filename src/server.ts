import Fastify from 'fastify';
import { LoggerOptions } from 'pino';
import controller from './controller';
import { config } from './lib/config';

const logger: LoggerOptions = {
  enabled: config.logger.enabled,
  name: 'kaiware-sync-api',
  level: config.logger.level,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
};

export function configureServer() {
  const fastify = Fastify({
    logger,
  });

  // fastify.register(require('fastify-cors'));

  fastify.register(function (instance, _options, done) {
    instance.get('/health', {
      handler: controller.health,
    });

    done();
  });

  return fastify;
}
