/**
 * Created by elf
 */
const AmoError = require('./AmoError');

module.exports = class AmoRequestError extends AmoError {
  constructor(message) {
    super(message || 'AmoCRM request error');
  }
};
