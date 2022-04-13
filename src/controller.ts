import { FastifyReply, FastifyRequest } from 'fastify';

const { version: apiVersion } = require('../package.json');

async function health(req: FastifyRequest, res: FastifyReply) {
  try {
    res.send({
      healthy: true,
      version: apiVersion,
    });
  } catch (err: any) {
    req.log.error(err?.message);
    res.send({
      healthy: false,
      version: apiVersion,
    });
  }
}

export default {
  health,
};
