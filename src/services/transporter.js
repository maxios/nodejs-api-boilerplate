import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import config from '../config';

export default nodemailer.createTransport(sgTransport({
  service: config.transporter.service,
  auth: {
    api_key: config.transporter.api_key
  }
}))
