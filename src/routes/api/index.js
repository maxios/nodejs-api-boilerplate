'use strict'
import express from 'express';
import authRouter from './auth.route';

const router = express.Router()
router.get('/status', (req, res) => { res.send({status: 'OK', message: req.i18n.t('home.title')})}) // api status

// router.use('/auth', authRouter) // mount auth paths

export default router;
