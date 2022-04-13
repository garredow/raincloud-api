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
  };
  logger: {
    enabled: boolean;
    level: `${LogLevel}`;
    file?: string;
  };
  soundcloud: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
};

function createConfig() {
  const config: Config = {
    meta: {
      appName: process.env.APP_NAME!,
      serverPort: Number(process.env.SERVER_PORT),
    },
    logger: {
      enabled: parseBool(process.env.LOGGER_ENABLED, true),
      level: process.env.LOGGER_LEVEL! as any,
      file: process.env.LOGGER_FILE || undefined,
    },
    soundcloud: {
      clientId: process.env.SC_CLIENT_ID!,
      clientSecret: process.env.SC_CLIENT_SECRET!,
      redirectUri: process.env.SC_REDIRECT_URI!,
    },
  };

  const schema = Joi.object({
    meta: {
      appName: Joi.string().required(),
      serverPort: Joi.number().required(),
    },
    logger: {
      enabled: Joi.bool().required(),
      level: Joi.string()
        .valid('trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent')
        .required(),
      file: Joi.string().optional(),
    },
    soundcloud: {
      clientId: Joi.string().required(),
      clientSecret: Joi.string().required(),
      redirectUri: Joi.string().required(),
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
