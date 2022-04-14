import fetch from 'node-fetch';
import { SoundCloudConfig, Tokens } from '../models';
import { config } from './config';

export class SoundCloud {
  async getTokens(clientId: string, code: string): Promise<Tokens> {
    const config = this.getConfig(clientId);
    var body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', config.clientId);
    body.append('client_secret', config.clientSecret);
    body.append('redirect_uri', config.redirectUri);
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

  async refreshToken(clientId: string, refreshToken: string): Promise<Tokens> {
    const config = this.getConfig(clientId);
    var body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('client_id', config.clientId);
    body.append('client_secret', config.clientSecret);
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

  private getConfig(clientId: string): SoundCloudConfig {
    if (clientId === config.soundcloud.clientIdDev) {
      return {
        clientId,
        clientSecret: config.soundcloud.clientSecretDev,
        redirectUri: config.soundcloud.redirectUriDev,
      };
    }
    if (clientId === config.soundcloud.clientIdProd) {
      return {
        clientId,
        clientSecret: config.soundcloud.clientSecretProd,
        redirectUri: config.soundcloud.redirectUriProd,
      };
    }

    throw new Error(`${clientId} is not a known client ID!`);
  }
}
