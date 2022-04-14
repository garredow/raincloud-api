import dotenv from 'dotenv';
import Joi from 'joi';
import { parseBool } from '../utils/parseBool';
dotenv.config();

enum LogLevel {
  Trace = 'trace',
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
  Silent = 'silent',
}

export type Config = {
  meta: {
    appName: string;
    serverPort: number;
    allowCors: boolean;
  };
  logger: {
    enabled: boolean;
    level: `${LogLevel}`;
    file?: string;
  };
  soundcloud: {
    clientIdDev: string;
    clientSecretDev: string;
    redirectUriDev: string;
    clientIdProd: string;
    clientSecretProd: string;
    redirectUriProd: string;
  };
};

function createConfig() {
  const config: Config = {
    meta: {
      appName: process.env.APP_NAME!,
      serverPort: Number(process.env.SERVER_PORT),
      allowCors: parseBool(process.env.ALLOW_CORS, false),
    },
    logger: {
      enabled: parseBool(process.env.LOGGER_ENABLED, true),
      level: process.env.LOGGER_LEVEL! as any,
      file: process.env.LOGGER_FILE || undefined,
    },
    soundcloud: {
      clientIdDev: process.env.SC_CLIENT_ID_DEV!,
      clientSecretDev: process.env.SC_CLIENT_SECRET_DEV!,
      redirectUriDev: process.env.SC_REDIRECT_URI_DEV!,
      clientIdProd: process.env.SC_CLIENT_ID_PROD!,
      clientSecretProd: process.env.SC_CLIENT_SECRET_PROD!,
      redirectUriProd: process.env.SC_REDIRECT_URI_PROD!,
    },
  };

  const schema = Joi.object({
    meta: {
      appName: Joi.string().required(),
      serverPort: Joi.number().required(),
      allowCors: Joi.bool().required(),
    },
    logger: {
      enabled: Joi.bool().required(),
      level: Joi.string()
        .valid('trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent')
        .required(),
      file: Joi.string().optional(),
    },
    soundcloud: {
      clientIdDev: Joi.string().required(),
      clientSecretDev: Joi.string().required(),
      redirectUriDev: Joi.string().required(),
      clientIdProd: Joi.string().required(),
      clientSecretProd: Joi.string().required(),
      redirectUriProd: Joi.string().required(),
    },
  });
  const { error } = schema.validate(config, { abortEarly: false });

  if (error) {
    console.error(
      'Invalid config',
      error.details.map((a) => a.message)
    );
    process.exit(1);
  }

  return config;
}

export const config = createConfig();
