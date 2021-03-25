import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import config from '../config';
import sgMail, { sgTemplate } from '../services/sendgrid';
import ErrorHandler from '../services/error_handler';
import httpStatus from 'http-status';
import addHours from 'date-fns/addHours';
import uuidv1 from 'uuid/v1';

export const register = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const body = req.body
    body.activationKey = {key: activationKey, expire: addHours(new Date(), 24)}
    const user = new User(body)
    await user.save()

    const mailOptions = {
      to: user.email,
      subject: `${user.fullname} - activate your account`,
      template_id: 'd-d08b3c6ad9fc4e3e9000ab7d3ac98c76',
      dynamic_template_data: {
        fullName: user.fullname,
        link: `${config.hostname}/api/auth/confirm?activationKey=${activationKey}`
      }
    }

    await sgMail.send(sgTemplate(mailOptions))

    res.sendStatus(httpStatus.CREATED)
  } catch (error) {
    console.log(error);
    return next(ErrorHandler(error, req.t))
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body)
    const payload = {sub: user.id}
    const token = jwt.sign(payload, config.secret)
    res.set('x-user', token)
    return res.json({ message: 'OK', data: user.transform() })
  } catch (error) {
    console.log(error);
    return next(ErrorHandler(error, req.t))
  }
}

export const confirm = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { 'activationKey.key': req.query.activationKey, 'activationKey.expire': { $gte: new Date() }},
      { 'active': true }
    )
    if (!user) {
      res.status(httpStatus.UNAUTHORIZED);
      return res.json({message: 'Expired'});
    }
    return res.redirect(301, `${config.apphost}/${req.language}/signin?alerts=activated`)

  } catch (error) {
    next(ErrorHandler(error, req.t))
  }
}

export const forget = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const user = await User.findOneAndUpdate(
      { 'email': req.body.email },
      { 'activationKey.key': activationKey, 'activationKey.expire': addHours(new Date(), 24)},
      { runValidators: true }
    )

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED);
      res.json({errors: [{path: 'email', errorMessage: req.t('errors.not_exist', {key: req.t('attributes.email')})}]})
      return next();
    }

    const mailOptions = {
      to: user.email,
      subject: `${user.fullname} - forgot your password?`,
      template_id: 'd-0595fc1abf704ca299c9bdc923d038ed',
      dynamic_template_data: {
        fullName: user.fullname,
        link: `${config.apphost}/${req.language}/change_password?activationKey=${activationKey}&email=${user.email}`
      }
    }

    await sgMail.send(sgTemplate(mailOptions))

    return res.sendStatus(httpStatus.OK)
  } catch (error) {
    console.log(error)
    next(ErrorHandler(error, req.t))
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const {password, activationKey} = req.body
    const user = await User.findOne({ 'activationKey.key': activationKey, 'activationKey.expire': { $gte: new Date() }})

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED);
      return next();
    }

    user.password = password
    await user.validateSync();
    await user.save()

    return res.sendStatus(201)
  } catch (error) {
    console.log('error', error)
    next(ErrorHandler(error, req.t))
  }
}
