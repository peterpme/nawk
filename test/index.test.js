'use strict'

let test = require('ava').test
let Nawk = require('../index')

test('processes input', t => {
  let args = ['$0', '--append', ';', '--unless', '/bad/']
  let nawk = new Nawk(args)

  t.is(nawk.processLine('hello'), 'hello;')
  t.is(nawk.processLine('bad hello'), 'bad hello')
})

test('handles an expression and conditions', t => {
  let args = ['The whole enchillada: $0 and time $1', '--append', ';', '--unless', '/bad/']
  let input = 'tab0 tab1 tab2'
  let nawk = new Nawk(args)

  t.is(nawk.processLine(input), 'The whole enchillada: tab0 tab1 tab2 and time tab0;')
})

test('handles conditions that do not match', t => {
  let args = ['$1 this won\'t include a semicolon after 3', '--append', ';', '--if', '/[12]/']
  let matchingInput = '1'
  let nonMatchingInput = '3'
  let nawk = new Nawk(args)

  t.is(nawk.processLine(matchingInput), "1 this won't include a semicolon after 3;")
  t.is(nawk.processLine(nonMatchingInput), "3 this won't include a semicolon after 3")
})

test('handles commands without conditions', t => {
  let args = ['The whole enchillada: $0 and time $1', '--append', ';']
  let input = 'tab0 tab1 tab2'
  let nawk = new Nawk(args)

  t.is(nawk.processLine(input, args), 'The whole enchillada: tab0 tab1 tab2 and time tab0;')
})
