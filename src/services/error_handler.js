const ErrorHandler = (error, i18n) => {
  const handleMessageByKind = value => {
    const path = value.path;
    const kind = value.kind;
    const properties = value.properties;
    if (kind) {
      return i18n(`errors.${kind}`, {...properties, path: i18n(`attributes.${path}`)})
    } else {
      return i18n(`errors.invalid`, {...properties, path: i18n(`attributes.${path}`)})
    }
  }
  if (error.code || error.status) {
    switch(error.code || error.status) {
      case 11000:{
        const keys = Object.keys(error.keyPattern);
        return {errors: keys.map(key => ({path: key, errorMessage: i18n('errors.11000', {key: i18n(`attributes.${key}`)})}))}
      }
      default: {
        return {errorMessage: i18n(error.message || 'errors.500')}
      }
    }
  }
  return {
    errors: Object.entries(error.errors).map(([k, v]) => ({
      ...error.errors[k],
      errorMessage: handleMessageByKind(v)
    }))
  }
}

export default ErrorHandler;
