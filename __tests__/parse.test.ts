/* globals describe expect test */

import {parse} from '../src/parse'
import {loadFixture} from './utils'

describe('parser', () => {
  test('parses issue body', () => {
    const body = loadFixture('issues/parses.md')
    const params = new Map<string, string>([['name', 'Mona']])
    expect(parse(body)).toEqual(params)
  })

  test('parses multiple lines', () => {
    const body = loadFixture('issues/multi.md')
    const params = new Map<string, string>([
      ['name', 'Mona'],
      ['snack', 'cookies']
    ])
    expect(parse(body)).toEqual(params)
  })

  test('parses different line-endings', () => {
    const body = 'name: Mona\r\nsnack: cookies\ncolor: green'
    const params = new Map<string, string>([
      ['name', 'Mona'],
      ['snack', 'cookies'],
      ['color', 'green']
    ])
    expect(parse(body)).toEqual(params)
  })

  test('parses out input extractions', () => {
    process.env.INPUT_EXTRACT_SEASON = '<p id="season">(?<season>[^<]+)</p>'

    const body = 'name: Mona\nsnack: cookies\ncolor: green\n<p id="season">winter</p>'
    const params = new Map<string, string>([
      ['name', 'Mona'],
      ['snack', 'cookies'],
      ['color', 'green'],
      ['season', 'winter']
    ])

    expect(parse(body)).toEqual(params)
  })
})

describe('default regex', () => {
  test('trims leading whitespace', () => {
    const body = loadFixture('issues/leading-whitespace.md')
    const params = new Map<string, string>([
      ['name', 'Mona'],
      ['favorite color', 'blue']
    ])
    expect(parse(body)).toEqual(params)
  })

  test('does not match non-word characters', () => {
    const body = loadFixture('issues/non-word.md')
    const params = new Map<string, string>([
      ['name', 'Mona'],
      ['color', 'blue']
    ])
    expect(parse(body)).toEqual(params)
  })

  test('matches spaces and tabs in key and value', () => {
    const body = loadFixture('issues/spaces-tabs.md')
    const params = new Map<string, string>([
      ['name', 'Mona'],
      ['favorite color', 'royal blue']
    ])
    expect(parse(body)).toEqual(params)
  })
})
