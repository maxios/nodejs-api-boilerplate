import config from '../config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(config.transporter.api_key);

export const sgTemplate = params => ({
  from: config.transporter.email,
  ...params
});

export default sgMail;
