import { FastifyReply, FastifyRequest } from 'fastify';
import { SoundCloud } from './lib/soundcloud';

const { version: apiVersion } = require('../package.json');

type GetTokensBody = {
  clientId: string;
  code: string;
};
async function getTokens(req: FastifyRequest<{ Body: GetTokensBody }>, res: FastifyReply) {
  try {
    const result = await new SoundCloud().getTokens(req.body.clientId, req.body.code);

    res.send({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_at: Date.now() + result.expires_in * 1000,
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

type RefreshTokenBody = {
  clientId: string;
  refreshToken: string;
};
async function refreshToken(req: FastifyRequest<{ Body: RefreshTokenBody }>, res: FastifyReply) {
  try {
    const result = await new SoundCloud().refreshToken(req.body.clientId, req.body.refreshToken);

    res.send({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_at: Date.now() + result.expires_in * 1000,
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

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
  getTokens,
  refreshToken,
  health,
};
