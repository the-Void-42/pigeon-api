class BadEmailParamsError extends Error {
  constructor () {
    super()
    this.name = 'BadEmailParamsError'
    this.message = 'A valid email is required to register'
  }
}

class BadPasswordParamsError extends Error {
  constructor () {
    super()
    this.name = 'BadPasswordParamsError'
    this.message = 'password must be 3 or more characters'
  }
}

module.exports = {
  BadEmailParamsError,
  BadPasswordParamsError
}
