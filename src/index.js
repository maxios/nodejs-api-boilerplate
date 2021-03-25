require("@babel/register");
import { connect as mongooseConnect } from './services/mongoose'
import app, { start } from './services/express';
import { startI18next } from './services/i18n';

// start app and connect to database
startI18next();
start()
mongooseConnect();

export default app;

