const Joi = require('joi')

module.exports = Joi.object().keys({
  id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  age: Joi.number().integer().min(0).max(125).required(),
  company: Joi.string().uppercase(),
  email: Joi.string().email().required(),
  address: Joi.object().keys({
    line1: Joi.string().required(),
    line2: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().integer().min(10000).max(99999).required(),
  })
})
