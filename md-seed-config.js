import mongoose from 'mongoose';
import OrganizationSeeder from './src/seeds/organizations';

const env = require('dotenv').config().parsed;

console.log(env.MONGOURI)
const mongoURL = env.MONGOURI || 'mongodb://localhost:27017/dbname';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  OrganizationSeeder
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
