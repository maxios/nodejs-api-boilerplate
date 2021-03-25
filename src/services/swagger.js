import path from 'path'
import swagger from 'swagger-express'
import config from '../config'

export default app => swagger.init(app, {
  apiVersion: '1.0',
  swaggerVersion: '1.0',
  basePath: `http://${config.hostname}:${config.port}`,
  swaggerURL: '/swagger',
  swaggerUI: './',
  apis: path.resolve(`${__dirname}/../routes/api/*`)
})
