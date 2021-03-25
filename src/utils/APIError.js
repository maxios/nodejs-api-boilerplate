import httpStatus from 'http-status';
import { inherits } from 'util';

export default function APIError (message, status = httpStatus.INTERNAL_SERVER_ERROR, extra = null) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = message
  this.status = status
  this.extra = extra
}

inherits(APIError, Error)
