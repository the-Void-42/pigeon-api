// custom error types extend `Error.prototype`
// `name` and `message` in the constructor method match the pattern
// that Express and Mongoose use for custom errors.

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

class UserAlreadyExistsError extends Error {
  constructor () {
    super()
    this.name = 'UserAlreadyExistsError'
    this.message = 'the user already exists'
  }
}

module.exports = {
  BadEmailParamsError,
  BadPasswordParamsError,
  UserAlreadyExistsError
}
