import * as Joi from 'joi';

export const envConfigurationSchema = Joi.object({
  // APP
  // GENERAL
  NODE_ENV: Joi.string().valid('dev', 'stag', 'prod', 'test').default('dev'),
  PORT: Joi.number().default(3000),
  HOST_API: Joi.string().default('http://localhost:3000/api'),
  // DATABASE - POSTGRES
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_PORT: Joi.number().required(),
  // JWT
  JWT_SECRET: Joi.string().required(),
});
