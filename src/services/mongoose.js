import config from '../config';
import mongoose from 'mongoose';
import * as bluePromise from 'bluebird';

mongoose.Promise = bluePromise.Promise;

mongoose.connection.on('connected', () => {
  console.log('MongoDB is connected')
})

mongoose.connection.on('error', (err) => {
  console.log(`Could not connect to MongoDB because of ${err}`)
  process.exit(1)
})

if (config.env === 'dev') {
  mongoose.set('debug', true)
}

const connect = () => {
  const mongoURI = (config.env === 'prod' || 'dev' ? config.mongo.uri : config.mongo.testURI)

  mongoose.connect(mongoURI, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })

  return mongoose.connection
}

export { connect };
