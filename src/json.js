const fs = require('fs-extra')
const Joi = require('joi')
const Mecha = require('./base')

class JSONMecha extends Mecha {
  constructor (path, schema) {
    super()
    try {
      const contents = fs.readFileSync(path, 'utf-8')
      const json = JSON.parse(contents)

      if (Array.isArray(json)) {
        this._contents = json
        this._path = path
        if (schema !== undefined) {
          if (schema.isJoi) {
            this._schema = schema
          } else {
            throw new TypeError(`Must provide a Joi schema if using one`)
          }
        }
      } else {
        throw new TypeError(`.json file must be an array`)
      }
    } catch (error) {
      throw error
    }
  }

  get (ctx, options={}) {
    let result = this._contents

    if (typeof ctx === 'function') result = result.filter(ctx)
    if (typeof ctx === 'object') options = ctx
    if (options.limit !== undefined && options.limit < 1) throw new RangeError(`limit option must not be below 1`)

    const offset = options.offset || 0
    const limit = (offset + options.limit) || result.length
    result = result.slice(offset, limit)

    return result
  }

  find (ctx={}) {
    let result = this._contents

    if (typeof ctx === 'object') {
      if (ctx.index !== undefined) {
        const idx = ctx.index
        result = result[idx]

        if (result === undefined) throw new RangeError(`did not find element at index ${idx}`)
      } else if (ctx.prop !== undefined) {
        if (!Array.isArray(ctx.prop) || ctx.prop.length !== 2) {
          throw new TypeError(`prop must be an array with exactly 2 items`)
        }

        const [ key, value ] = ctx.prop
        result = result.find(el => el[key] === value)
        if (result === undefined) throw new RangeError(`did not find element with key ${key} and value ${value}`)
      } else {
        throw new TypeError(`options object or a callback function is required`)
      }
    } else if (typeof ctx === 'function') {
      result = result.find(ctx)

      if (result === undefined) throw new RangeError(`did not find element with callback function`)
    } else {
      throw new TypeError(`options object or a callback function is required`)
    }

    return result
  }

  _validate (record) {
    const { error } = Joi.validate(record, this._schema, { convert: true })
    if (error) throw error
  }

  create (record) {
    if (!arguments.length) throw new TypeError(`cannot call with no arguments`)
    if (!Array.isArray(record)) record = [record]

    if (this._schema) record.forEach(this._validate.bind(this))
    this._contents = this._contents.concat(record)
    fs.writeJsonSync(this._path, this._contents)

    return record.length > 1 ? record : record[0]
  }

  update (ctx, record) {
    if (!arguments.length) throw new TypeError(`cannot call with no arguments`)

    const element = this.find(ctx)
    const idx = this._contents.indexOf(element)

    if (this._schema) this._validate(record)
    this._contents.splice(idx, 1, record)

    fs.writeJsonSync(this._path, this._contents)
    return record
  }

  destroy (ctx={}) {
    const element = this.find(ctx)
    const idx = this._contents.indexOf(element)
    this._contents.splice(idx, 1)

    fs.writeJsonSync(this._path, this._contents)
    return element
  }
}

module.exports = JSONMecha
