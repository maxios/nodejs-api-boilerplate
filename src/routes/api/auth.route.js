import express from 'express'
import { register, login, confirm, forget, changePassword } from '../../controllers/auth.controller'
import auth from '../../middlewares/authorization'

const router = express.Router()

router.post('/register', register) // validate and register
router.post('/login', login) // login
router.get('/confirm', confirm)
router.post('/forget', forget)
router.post('/change_password', changePassword)

// Authentication example
router.get('/secret1', auth(), (req, res) => {
  // example route for auth
  res.json({ message: 'Anyone can access(only authorized)' })
})
router.get('/secret2', auth(['admin']), (req, res) => {
  // example route for auth
  res.json({ message: 'Only admin can access' })
})
router.get('/secret3', auth(['user']), (req, res) => {
  // example route for auth
  res.json({ message: 'Only user can access' })
})

export default router;
