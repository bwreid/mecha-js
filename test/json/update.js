const fs = require('fs-extra')
const chai = require('chai')
const path = require('path')
const expect = chai.expect
const uuid = require('uuid/v4')
const schema = require('./helpers/schema')
const { JSONMecha } = require('../../src')

describe('JSONMecha #update(options/callback, entry)', function () {
  before(function () {
    const origin = path.join(__dirname, 'fixtures','00-valid.json')
    this.tmp = `tmp-${uuid()}`
    this.destination = path.join(__dirname, this.tmp, '00-valid.json')

    fs.copySync(origin, this.destination)
    this.mecha = new JSONMecha(this.destination)
  })

  beforeEach(function () {
    this.mecha._schema = null
  })

  it('should throw an error if no record is entered', function () {
    const actual = () => this.mecha.update()
    const error = `cannot call with no arguments`
    expect(actual).to.throw(TypeError).with.property('message', error)
  })

  it('should update the existing record in the document', function () {
    const options = { index: 1 }
    const record = { id: 1 }
    this.mecha.update(options, record)

    const contents = fs.readJsonSync(this.destination)
    const actual = contents[1]
    expect(actual).to.deep.equal(record)
  })

  it('should return the newly updated record', function () {
    const options = { index: 1 }
    const record = { id: 1 }
    const actual = this.mecha.update(options, record)
    expect(actual).to.deep.equal(record)
  })

  it('should validate against a schema if present', function () {
    this.mecha._schema = schema

    const options = { index: 1 }
    const record = { id: 1 }
    const actual = () => this.mecha.update(options, record)
    expect(actual).to.throw()
  })

  it('should allow for records that pass the schema to be included', function () {
    this.mecha._schema = schema

    const options = { index: 1 }
    const record = {
      id: "e466a135-496c-4784-8059-d3d3dff93888",
      age: 25,
      name: "Debora Whitney",
      company: "FREAKIN",
      email: "debora.whitney@freakin.com",
      address: { line1: "138 Miller Place", city: "Russellville", state: "Connecticut", zip: 88464 }
    }

    this.mecha.update(options, record)

    const contents = fs.readJsonSync(this.destination)
    const actual = contents[1]
    expect(actual).to.deep.equal(record)
  })

  after(function () {
    const tmp = path.join(__dirname, this.tmp)
    fs.removeSync(tmp)
  })
})
