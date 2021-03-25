import config from '@config';


import i18next from 'i18next';
import i18next_middleware from 'i18next-http-middleware';
import express from 'express';
import morgan from 'morgan';
import morganBody from 'morgan-body';
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { handleNotFound, handleError } from '@middlewares/error-handler'
import apiRouter from '@routes/api'
import passport from 'passport';
import { jwtStrategy } from '@services/passport';


const app = express()
app.use(i18next_middleware.handle(i18next))
app.use(bodyParser.json())
app.use(cors({ exposedHeaders: ['x-user'] }))
app.use(helmet())
app.use(express.static('public'))


if (config.env !== 'test') app.use(morgan('combined'))

// passport
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

morganBody(app);

app.use('/api', apiRouter)

app.use(handleNotFound)
app.use(handleError)

export const start = () => {
  app.listen(config.port, (err) => {
    if (err) {
      console.log(`Error : ${err}`)
      process.exit(-1)
    }

    console.log(`${config.app} is running on ${config.port}`)
  })
}

export default app;
