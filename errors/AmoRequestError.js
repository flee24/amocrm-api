/**
 * Created by elf
 */

module.exports = class AmoRequestError extends require(__dirname + '/AmoError') {
    constructor (message) {
        super(message || 'AmoCRM request error');
    }
};
