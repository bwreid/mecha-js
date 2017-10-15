const chai = require('chai')
const path = require('path')
const expect = chai.expect
const { JSONMecha } = require('../../src')

describe('JSONMecha #get(options/callback, options)', function () {
  before(function () {
    this.json = path.join(__dirname, 'fixtures','00-valid.json')
    this.mecha = new JSONMecha(this.json)
  })

  it('retrieves all records when no arguments are passed in', function () {
    const actual = this.mecha.get()
    expect(actual.length).to.equal(8)

    const person = actual[0]
    expect(person.id).to.be.ok
  })

  it('takes options to limit the number of records returned', function () {
    const options = { limit: 3 }
    const actual = this.mecha.get(options)
    expect(actual.length).to.equal(3)
  })

  it('takes options to offset the records returned', function () {
    const options = { offset: 3 }
    const actual = this.mecha.get(options)
    expect(actual.length).to.equal(5)

    const person = actual[0]
    const first = this.mecha._contents[0]
    expect(person).to.not.deep.equal(first)
  })

  it('will both offset and limit the query', function () {
    const options = { limit: 1, offset: 3 }
    const actual = this.mecha.get(options)
    expect(actual.length).to.equal(1)

    const person = actual[0]
    const selected = this.mecha._contents[3]
    expect(person).to.deep.equal(selected)
  })

  it('will throw an error if limit is less than 1', function () {
    const options = { limit: 0 }
    const actual = () => this.mecha.get(options)
    expect(actual).to.throw(RangeError).with.property('message', `limit option must not be below 1`)
  })

  describe('with callback function', function () {
    it('filters items according to it', function () {
      const callback = (el) => el.age < 21
      const actual = this.mecha.get(callback)
      expect(actual.length).to.equal(2)

      const person = actual[0]
      expect(person.id).to.be.ok
    })

    it('limits according to options', function () {
      const options = { limit: 2 }
      const callback = (el) => el.age > 35
      const actual = this.mecha.get(callback, options)
      expect(actual.length).to.equal(2)
    })

    it('offsets according to options', function () {
      const options = { offset: 2 }
      const callback = (el) => el.age > 35
      const actual = this.mecha.get(callback, options)
      expect(actual.length).to.equal(3)

      const person = actual[0]
      const first = this.mecha._contents[0]
      expect(person).to.not.deep.equal(first)
    })

    it('will both offset and limit the query', function () {
      const options = { limit: 1, offset: 1 }
      const callback = (el) => el.age > 35
      const actual = this.mecha.get(callback, options)
      expect(actual.length).to.equal(1)

      const person = actual[0]
      const selected = this.mecha._contents[2]
      expect(person).to.deep.equal(selected)
    })
  })
})
