const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    RHUB_URL: Joi.string().required().description('RHUB URL'),
    INFLUXDB_URL: Joi.string().description('Influx Database url'),
    INFLUXDB_TOKEN: Joi.string().description('InfluxDB Token'),
    INFLUXDB_ORG: Joi.string().description('InfluxDB ORG'),
    INFLUXDB_BUCKET: Joi.string().description('InfluxDB Bucket'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    KEYCLOAK_REALM: Joi.string(),
    KEYCLOAK_REALM_PUBLICKEY: Joi.string(),
    KEYCLOAK_URL: Joi.string(),
    KEYCLOAK_ADMIN: Joi.string().optional().allow(''),
    KEYCLOAK_PASSWORD: Joi.string().optional().allow(''),
    KEYCLOAK_CLIENT_ID: Joi.string(),
    KEYCLOAK_CLIENT_SECRET: Joi.string().optional().allow(''),
    KEYCLOAK_ACCESS_TOKEN_LIFESPAN: Joi.string().optional().allow(''),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  RHUB_URL: envVars.RHUB_URL,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  KEYCLOAK_REALM: envVars.KEYCLOAK_REALM,
  KEYCLOAK_REALM_PUBLICKEY: envVars.KEYCLOAK_REALM_PUBLICKEY,
  KEYCLOAK_URL: envVars.KEYCLOAK_URL,
  KEYCLOAK_ADMIN: envVars.KEYCLOAK_ADMIN,
  KEYCLOAK_PASSWORD: envVars.KEYCLOAK_PASSWORD,
  KEYCLOAK_CLIENT_ID: envVars.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET: envVars.KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_ACCESS_TOKEN_LIFESPAN: envVars.KEYCLOAK_ACCESS_TOKEN_LIFESPAN,
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  INFLUXDB_URL: envVars.INFLUXDB_URL,
  INFLUXDB_TOKEN: envVars.INFLUXDB_TOKEN,
  INFLUXDB_ORG: envVars.INFLUXDB_ORG,
  INFLUXDB_BUCKET: envVars.INFLUXDB_BUCKET,
};
