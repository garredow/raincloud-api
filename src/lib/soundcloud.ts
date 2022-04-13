import fetch from 'node-fetch';
import { Tokens } from '../models';
import { config } from './config';

export class SoundCloud {
  async getTokens(code: string): Promise<Tokens> {
    var body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', config.soundcloud.clientId);
    body.append('client_secret', config.soundcloud.clientSecret);
    body.append('redirect_uri', config.soundcloud.redirectUri);
    body.append('code', code);

    return fetch('https://api.soundcloud.com/oauth2/token', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to get tokens: ${res.statusText}`);
      }

      return res.json() as Promise<Tokens>;
    });
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    var body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('client_id', config.soundcloud.clientId);
    body.append('client_secret', config.soundcloud.clientSecret);
    body.append('refresh_token', refreshToken);

    return fetch('https://api.soundcloud.com/oauth2/token', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to refresh token: ${res.statusText}`);
      }

      return res.json() as Promise<Tokens>;
    });
  }
}
