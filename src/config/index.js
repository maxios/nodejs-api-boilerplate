require('dotenv').config() // load .env file

export default {
  port: 3000,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  secret: process.env.APP_SECRET,
  hostname: process.env.HOSTNAME,
  apphost: process.env.APPHOST,
  frontend_host: process.env.FRONTEND_HOST,
  mongo: {
    uri: process.env.MONGOURI,
    testURI: process.env.MONGOTESTURI
  },
  transporter: {
    service: process.env.TRANSPORTER_SERVICE,
    email: process.env.TRANSPORTER_EMAIL,
    api_key: process.env.TRANSPORTER_API_KEY
  }
}
