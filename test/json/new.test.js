const chai = require('chai')
const path = require('path')
const expect = chai.expect
const schema = require('./helpers/schema')
const { JSONMecha } = require('../../src')

describe('new JSONMecha(path, schema)', function () {
  beforeEach(function () {
    this.json = path.join(__dirname, 'fixtures','00-valid.json')
  })

  it('should create a new instance if valid JSON is provided', function () {
    const actual = new JSONMecha(this.json)
    expect(actual).to.be.instanceOf(JSONMecha)
  })

  it('should require that a file path is provided', function () {
    const actual = () => new JSONMecha()
    expect(actual).to.throw(TypeError)
  })

  it('should require that a valid json file is provided', function () {
    const json = path.join(__dirname, 'fixtures', '01-invalid-json.json')
    const actual = () => new JSONMecha(json)
    const expected = `Unexpected end of JSON input`
    expect(actual).to.throw(SyntaxError).with.property('message', expected)
  })

  it('should require that the json is an array', function () {
    const json = path.join(__dirname, 'fixtures', '02-non-array.json')
    const actual = () => new JSONMecha(json)
    const expected = `.json file must be an array`
    expect(actual).to.throw(TypeError).with.property('message', expected)
  })

  it('should require that the schema is a Joi schema if provided', function () {
    const actual = () => new JSONMecha(this.json, {})
    const error = `Must provide a Joi schema if using one`
    expect(actual).to.throw(TypeError).with.property('message', error)
  })

  it('should accept a Joi schema if provided', function () {
    const actual = new JSONMecha(this.json, schema)
    expect(actual).to.be.instanceOf(JSONMecha)
    expect(actual._schema.isJoi).to.be.true
  })
})
