/**
 * Created by elf
 */

module.exports = class AmoAuthError extends require(__dirname + '/AmoError') {
    constructor (message) {
        super(message || 'AmoCRM auth error');
    }
};