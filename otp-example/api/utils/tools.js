/**
 * Determine if value is falsey
 *
 * @param {Any} val value that can be falsey
 * @returns {Boolean}
 */
function isFalse(val) {
  return !val;
}

/**
 * Constructor class to send custom errors back to client
 */
class CodeError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/**
 * @param {Number} a 
 * @param {Number} b 
 * @returns {Boolean} True of a is bigger than b
 */
function isAbiggerThanB(a, b){
  return a - b > 0
}

module.exports = { isFalse, CodeError, isAbiggerThanB };
