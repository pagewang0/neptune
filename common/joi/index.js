const _ = require('lodash')
const joi = require('joi')

const vEmail = () => joi.string().email({ tlds: false }).required()
const vPassword = () => joi.string().required().min(6).max(48)

const v = {
  register: () => ({
    name: joi.string().required().max(48),
    email: vEmail(),
    password: vPassword(),
  }),
  login: () => ({
    email: vEmail(),
    password: vPassword(),
  }),
  userId: () => ({
    userId: joi.number().integer().required(),
  })
}

_.keys(v).forEach(k => {
  const origin = v[k]()

  v[k] = () => joi.object(origin)
})

module.exports = v