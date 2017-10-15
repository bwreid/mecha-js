const fs = require('fs-extra')
const chai = require('chai')
const path = require('path')
const expect = chai.expect
const uuid = require('uuid/v4')
const schema = require('./helpers/schema')
const { JSONMecha } = require('../../src')

describe('JSONMecha #create(entry)', function () {
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
    const actual = () => this.mecha.create()
    const error = `cannot call with no arguments`
    expect(actual).to.throw(TypeError).with.property('message', error)
  })

  it('should add a new record to the document', function () {
    const record = { id: 1 }
    this.mecha.create(record)

    const contents = fs.readJsonSync(this.destination)
    const actual = contents[contents.length - 1]
    expect(actual).to.deep.equal(record)
  })

  it('should return the new record', function () {
    const record = { id: 1 }
    const actual = this.mecha.create(record)
    expect(actual).to.deep.equal(record)
  })

  it('should validate against a schema if present', function () {
    this.mecha._schema = schema

    const record = { id: 1 }
    const actual = () => this.mecha.create(record)
    expect(actual).to.throw()
  })

  it('should allow for records that pass the schema to be included', function () {
    this.mecha._schema = schema

    const record = {
      id: "e466a135-496c-4784-8059-d3d3dff93888",
      age: 25,
      name: "Debora Whitney",
      company: "FREAKIN",
      email: "debora.whitney@freakin.com",
      address: { line1: "138 Miller Place", city: "Russellville", state: "Connecticut", zip: 88464 }
    }

    this.mecha.create(record)

    const contents = fs.readJsonSync(this.destination)
    const actual = contents[contents.length - 1]
    expect(actual).to.deep.equal(record)
  })

  describe('bulk insert', function () {
    it('should add multiple new records to the document', function () {
      const records = [ { id: 1 }, { id: 2 } ]
      this.mecha.create(records)

      const contents = fs.readJsonSync(this.destination)
      const actual = contents.slice(contents.length - 2)
      expect(actual).to.deep.equal(records)
    })

    it('should return the new records as an array', function () {
      const records = [ { id: 1 }, { id: 2 } ]
      const actual = this.mecha.create(records)
      expect(actual).to.deep.equal(records)
    })

    it('should validate all records against a schema if present', function () {
      this.mecha._schema = schema

      const records = [ { id: 1 }, { id: 2 } ]
      const actual = () => this.mecha.create(records)
      expect(actual).to.throw()
    })

    it('should allow for records that pass the schema to be included', function () {
      this.mecha._schema = schema

      const records = [
        {
          id: "e466a135-496c-4784-8059-d3d3dff93888",
          age: 25,
          name: "Debora Whitney",
          company: "FREAKIN",
          email: "debora.whitney@freakin.com",
          address: { line1: "138 Miller Place", city: "Russellville", state: "Connecticut", zip: 88464 }
        },
        {
          id: "b797765b-3295-4c4e-9825-6437ff3417c7",
          age: 18,
          name: "Walton Reynolds",
          company: "POWERNET",
          email: "walton.reynolds@powernet.com",
          address: { line1: "343 Centre Street", city: "Islandia", state: "Vermont", zip: 65455 }
        }
      ]

      this.mecha.create(records)

      const contents = fs.readJsonSync(this.destination)
      const actual = contents.slice(contents.length - 2)
      expect(actual).to.deep.equal(records)
    })
  })

  after(function () {
    const tmp = path.join(__dirname, this.tmp)
    fs.removeSync(tmp)
  })
})
