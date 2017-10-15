const fs = require('fs-extra')
const chai = require('chai')
const path = require('path')
const expect = chai.expect
const uuid = require('uuid/v4')
const { JSONMecha } = require('../../src')

describe('JSONMecha #destroy(options/callback)', function () {
  before(function () {
    const origin = path.join(__dirname, 'fixtures','00-valid.json')
    this.tmp = `tmp-${uuid()}`
    this.destination = path.join(__dirname, this.tmp, '00-valid.json')

    fs.copySync(origin, this.destination)
    this.mecha = new JSONMecha(this.destination)
  })

  it('will throw an error if no valid options are passed in', function () {
    const actual = () => this.mecha.destroy()
    const error = `options object or a callback function is required`
    expect(actual).to.throw(TypeError).with.property('message', error)
  })

  it('destroys the first single record at a particular index when options are passed in', function () {
    const options = { index: 2 }
    const beforeLen = this.mecha._contents.length

    this.mecha.destroy(options)
    const actual = this.mecha._contents.length
    const expected = beforeLen - 1

    expect(actual).to.equal(expected)
  })

  it('will throw an error if no element is found through the index', function () {
    const options = { index: 99 }
    const actual = () => this.mecha.destroy(options)
    const error = `did not find element at index ${options.index}`
    expect(actual).to.throw(RangeError).with.property('message', error)
  })

  it('retrieves the first single record according to a particular property when options are passed in', function () {
    const id = this.mecha._contents[1].id
    const options = { prop: [ 'id', id ] }
    const beforeLen = this.mecha._contents.length

    this.mecha.destroy(options)
    const actual = this.mecha._contents.length
    const expected = beforeLen - 1

    expect(actual).to.equal(expected)
  })

  it('will throw an error if the prop key does not point towards an array', function () {
    const options = { prop: { id: 1 } }
    const actual = () => this.mecha.destroy(options)
    const error = `prop must be an array with exactly 2 items`
    expect(actual).to.throw(TypeError).with.property('message', error)
  })

  it('will throw an error if the prop key does not point towards an array with exactly 2 items', function () {
    const options = { prop: [ 1 ] }
    const actual = () => this.mecha.destroy(options)
    const error = `prop must be an array with exactly 2 items`
    expect(actual).to.throw(TypeError).with.property('message', error)
  })

  it('will throw an error if the property key does not retrieve a match', function () {
    const id = this.mecha._contents[1].id
    const options = { prop: [ 'uuid', id ] }
    const actual = () => this.mecha.destroy(options)
    const error = `did not find element with key ${options.prop[0]} and value ${options.prop[1]}`
    expect(actual).to.throw(RangeError).with.property('message', error)
  })

  it('will throw an error if the property value does not retrieve a match', function () {
    const options = { prop: [ 'id', 0 ] }
    const actual = () => this.mecha.destroy(options)
    const error = `did not find element with key ${options.prop[0]} and value ${options.prop[1]}`
    expect(actual).to.throw(RangeError).with.property('message', error)
  })

  describe('with callback function', function () {
    it('retrieves the first single record matching the callback function', function () {
      const name = this.mecha._contents[1].name
      const callback = (el) => el.name === name
      const beforeLen = this.mecha._contents.length

      this.mecha.destroy(callback)
      const actual = this.mecha._contents.length
      const expected = beforeLen - 1

      expect(actual).to.equal(expected)
    })

    it('will throw an error if no element is found through the callback function', function () {
      const name = 'XXXXXXXX'
      const callback = (el) => el.name === name
      const actual = () => this.mecha.destroy(callback)

      const error = `did not find element with callback function`
      expect(actual).to.throw(RangeError).with.property('message', error)
    })
  })

  after(function () {
    const tmp = path.join(__dirname, this.tmp)
    fs.removeSync(tmp)
  })
})
