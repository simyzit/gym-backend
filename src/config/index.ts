export default (): object => ({
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  mongoUrlTest: process.env.MONGO_URL_TEST,
  accessSecretKey: process.env.ACCESS_SECRET_KEY,
  accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES,
  refreshSecretKey: process.env.REFRESH_SECRET_KEY,
  refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES,
  hostMail: process.env.HOST_MAIL,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
  mailFrom: process.env.MAIL_FROM,
  ServerPath:
    process.env.NODE_ENV === 'development'
      ? process.env.SERVER_DEV
      : process.env.SERVER_PROD,
  frontendDomain:
    process.env.NODE_ENV === 'development'
      ? process.env.FRONTEND_DOMAIN_DEV
      : process.env.FRONTEND_DOMAIN_PROD,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  cloudinaryName: process.env.CLOUD_NAME,
  cloudinaryApiKey: process.env.API_KEY,
  cloudinaryApiSecret: process.env.API_SECRET,
});
