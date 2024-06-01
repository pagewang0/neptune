module.exports = {
  register: (joi) => ({
    name: joi.string().required().max(48),
    password: joi.string().required().min(6).max(48),
    email: joi.string().email({ tlds: false }).required(),
  })
}