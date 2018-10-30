/**
 * Created by elf
 */

const AmoError = require('./AmoError');

module.exports = class AmoAuthError extends AmoError {
  constructor(message) {
    super(message || 'AmoCRM auth error');
  }
};
