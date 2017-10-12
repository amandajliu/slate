
import isPlainObject from 'is-plain-object'
import { List, Record, Set } from 'immutable'

import MODEL_TYPES from '../constants/model-types'
import Character from './character'
import Mark from './mark'
import generateKey from '../utils/generate-key'

/**
 * Default properties.
 *
 * @type {Object}
 */

const DEFAULTS = {
  marks: new Set(),
  key: undefined,
  text: '',
}

/**
 * Range.
 *
 * @type {Range}
 */

class Range extends Record(DEFAULTS) {

  /**
   * Create a new `Range` with `attrs`.
   *
   * @param {Object|Range} attrs
   * @return {Range}
   */

  static create(attrs = {}) {
    if (Range.isRange(attrs)) {
      return attrs
    }

    if (typeof attrs == 'string') {
      attrs = { text: attrs }
    }

    if (isPlainObject(attrs)) {
      return Range.fromJSON(attrs)
    }

    throw new Error(`\`Range.create\` only accepts objects, strings or ranges, but you passed it: ${attrs}`)
  }

  /**
   * Create a list of `Ranges` from `value`.
   *
   * @param {Array<Range|Object>|List<Range|Object>} value
   * @return {List<Range>}
   */

  static createList(value = []) {
    if (List.isList(value) || Array.isArray(value)) {
      const list = new List(value.map(Range.create))
      return list
    }

    throw new Error(`\`Range.createList\` only accepts arrays or lists, but you passed it: ${value}`)
  }

  /**
   * Create a `Range` from a JSON `object`.
   *
   * @param {Object} object
   * @return {Range}
   */

  static fromJSON(object) {
    const {
      text = '',
      key = generateKey(),
      marks = [],
    } = object

    const range = new Range({
      text,
      marks: new Set(marks.map(Mark.fromJSON)),
    })

    range.marks.key = range.key + "-marks"

    return range
  }

  /**
   * Alias `fromJS`.
   */

  static fromJS = Range.fromJSON

  /**
   * Check if a `value` is a `Range`.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isRange(value) {
    return !!(value && value[MODEL_TYPES.RANGE])
  }

  /**
   * Check if a `value` is a list of ranges.
   *
   * @param {Any} value
   * @return {Boolean}
   */

  static isRangeList(value) {
    return List.isList(value) && value.every(item => Range.isRange(item))
  }

  /**
   * Get the node's kind.
   *
   * @return {String}
   */

  get kind() {
    return 'range'
  }

  /**
   * Return range as a list of characters
   *
   * @return {List<Character>}
   */

  getCharacters(key) {
    const { marks } = this
    const characters = Character.createList(this.text
      .split('')
      .map((char, idx) => {
        return Character.create({
          text: char,
          key: `${key}:${idx}`,
          marks
        })
      }))

    return characters
  }

  /**
   * Return a JSON representation of the range.
   *
   * @return {Object}
   */

  toJSON() {
    const object = {
      kind: this.kind,
      marks: this.marks.toArray().map(m => m.toJSON()),
      text: this.text,
    }

    return object
  }

  /**
   * Alias `toJS`.
   */

  toJS() {
    return this.toJSON()
  }

}

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.prototype[MODEL_TYPES.RANGE] = true

/**
 * Export.
 *
 * @type {Range}
 */

export default Range
