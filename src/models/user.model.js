'use strict'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import httpStatus from 'http-status';
import APIError from '../utils/APIError';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema

const roles = [
  'user', 'admin'
]

export const userSchema = new Schema({
  username: {
    type: String
  },
  fullname: {
    type: String,
    required: true,
    maxlength: 26
  },
  email: {
    type: String,
    required: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    unique: true,
    lowercase: true
  },
  phoneNumber: {
    type: String
  },
  birthdate: {
    type: String
  },
  mailingAddress: {
    type: {
      city: { type: String },
      district: { type: String },
      street: { type: String },
      building: { type: String },
    }
  },
  password: {
    type: String,
    required: true,
    match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(^\S*$).{0,}$/,
    minlength: 6,
    maxlength: 20
  },
  name: {
    type: String,
    maxlength: 50
  },
  activationKey: {
    type: new Schema({
      key: { type: String, unique: true },
      expire: { type: Date }
    })
  },
  active: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user',
    enum: roles
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function save (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    this.password = bcrypt.hashSync(this.password)

    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.post('save', async function saved (doc, next) {
  try {
    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.method({
  transform () {
    const transformed = {}
    const fields = ['id', 'name', 'email', 'phoneNumber', 'birthdate', 'mailingAddress', 'createdAt', 'role', 'fullname']

    fields.forEach((field) => {
      transformed[field] = this[field]
    })

    return transformed
  },

  passwordMatches (password) {
    return bcrypt.compareSync(password, this.password)
  }
})

userSchema.statics = {
  roles,
  defaultProjection: {
    id : true,
    name : true,
    email : true,
    phoneNumber : true,
    birthdate : true,
    mailingAddress : true,
    createdAt : true,
    role : true,
    fullname : true
  },

  checkDuplicateEmailError (err) {
    console.log(err)
    if (err.code === 11000) {
      var error = new Error('Email already taken')
      error.errors = [{
        field: 'email',
        location: 'body',
        messages: ['Email already taken']
      }]
      error.statusCode = httpStatus.CONFLICT
      return error
    }

    return err
  },

  hashPassword (password) {
    return bcrypt.hashSync(password)
  },

  async findAndGenerateToken (payload) {
    const { email, password } = payload

    const user = await this.findOne({ email, active: true }).exec()
    if (!user) throw new APIError('errors.invalid_auth', httpStatus.NOT_FOUND)

    const passwordOK = await user.passwordMatches(password)

    if (!passwordOK) throw new APIError('errors.invalid_auth', httpStatus.UNAUTHORIZED)

    // if (!user.active) throw new APIError(`User not activated`, httpStatus.UNAUTHORIZED, {id: 'auth.login.errors.activation'})

    return user
  }
}

userSchema.plugin(mongoosePaginate);

export default mongoose.model('User', userSchema);
