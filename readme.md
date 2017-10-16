# Mecha.js

[![NSP Status](https://nodesecurity.io/orgs/wesreid-open-source/projects/16505f88-6d14-4659-9bd3-641cca9be8eb/badge)](https://nodesecurity.io/orgs/wesreid-open-source/projects/16505f88-6d14-4659-9bd3-641cca9be8eb) ![travis-ci](https://travis-ci.org/bwreid/mecha-js.svg?branch=master) [![npm version](https://badge.fury.io/js/mecha-js.svg)](https://www.npmjs.com/package/mecha-js) [![david](https://david-dm.org/bwreid/mecha-js.svg)](https://david-dm.org/) [![codecov](https://codecov.io/gh/bwreid/mecha-js/branch/master/graph/badge.svg)](https://codecov.io/gh/bwreid/mecha-js)

> Easily manage data from various file types

**CURRENT STATUS:**

- [x] Synchronous CRUD operations for `.json` file types
- [ ] Synchronous CRUD operations for `.csv` file types
- [ ] Synchronous CRUD operations for `.xml` file types
- [ ] Asynchronous CRUD operations for `.json` file types
- [ ] Asynchronous CRUD operations for `.csv` file types
- [ ] Asynchronous CRUD operations for `.xml` file types
- [ ] Asynchronous CRUD operations for relational databases
- [ ] Asynchronous CRUD operations for non-relations databases

⚠️ Yo, I'm just working on this library so use at your own peril.

## Why?

When creating prototypes or demos, it's useful to use a simple file as a way to store information. This is also a great way to teach the basics without having to get into databases. However, doing this requires a lot of repetitive code. Mecha.js was created with the hope to make this easier.

## API

For examples, please go to the [Mecha.js Examples Repository](https://github.com/bwreid/mecha-js-examples).

### Getting Started

Create a new instance of the mecha you're using and connect it with the appropriate file type. The file must be a collection; for example, with `.json` the contents must be stored in an array.

```js
const JSONMecha = require('mecha-js').JSONMecha
const mecha = new JSONMecha('/path/to/your/file.json') // Fill in the path to your .json file here
```

You now have access to a variety of methods that will modify the file. For example:

```js
// .get()
mecha.get() // return all records

// .create()
mecha.create({ id: 1, name: 'mecha-js' }) // create a single item
mecha.create([{ id: 2, name: 'lodash' }, { id: 3, name: 'joi' }]) // create multiples

// .find()
mecha.find({ index: 0 }) // return the first item in the array
mecha.find({ prop: [ 'id', 1 ]}) // return the first item with an 'id' of 1
mecha.find((el) => el.id === 1) // return the first item that returns true

// .update()
mecha.update({ prop: [ 'id', 3 ] }, { id: 3, name: 'hapi' }) // replace the record with new info

// .destroy()
mecha.destroy({ index: 1 }) // removes the second item in the array
```
