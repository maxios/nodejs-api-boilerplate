import httpStatus from 'http-status';

// hanlde not found error
const handleNotFound = (req, res) => {
  res.status(httpStatus.NOT_FOUND)
  res.json({
    'message': 'Requested resource not found'
  })
  res.end()
}

// handle errors
const handleError = (err, req, res, next) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
  res.json({
    errorMessage: err.errorMessage,
    message: req.i18n.t(err?.extra?.id),
    extra: err?.extra,
    errors: err.errors
  })
  res.end()
}

export { handleNotFound, handleError };
