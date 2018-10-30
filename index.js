const fetch = require('node-fetch');
const FormData = require('form-data');
const config = require('config');
const AmoAuthError = require(__dirname + '/errors/AmoAuthError');
const AmoRequestError = require(__dirname + '/errors/AmoRequestError');

class Amocrm {
    constructor() {
        this.cookies = null;
        this.host = config.get('amo.host');
        this.login = config.get('amo.login');
        this.hash = config.get('amo.hash');
    }

    async _storeAuth(res) {
	const cookies = res.headers.get("Set-Cookie").split(",");

        if (!cookies) {
            throw new AmoAuthError();
        }

        this.cookies = cookies.map((cookieHeader) => {
            return cookieHeader.split(';')[0];
        }).join('; ');
    }

    async auth() {
        let form = new FormData();
        form.append('USER_LOGIN', this.login);
        form.append('USER_HASH', this.hash);

        let res = await fetch(`${this.host}/private/api/auth.php?type=json`,
            {method: 'POST', body: form, headers: form.getHeaders()}
        );

        if (res.status !== 200) {
            throw new AmoAuthError();
        }

        await this._storeAuth(res);
    }

    async _checkStatus(res) {
        if (res.status !== 200) {
            throw new AmoRequestError();
        }
    }

    async getCurrentAccount() {
        let res = await fetch(`${this.host}/private/api/v2/json/accounts/current`,
            {
                method: 'GET',
                headers: {
                    Cookie: this.cookies
                }
            }
        );

        await this._checkStatus(res);

        let result = await res.json();
        if (!result.response || !result.response.account) {
            throw new AmoRequestError();
        }

        return result.response.account;
    }

    async updateContact(params) {
        let requestBody = {request: {contacts: {update: [params]}}};

        let res = await fetch(`${this.host}/private/api/v2/json/contacts/set`,
            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    Cookie: this.cookies
                }
            }
        );

        await this._checkStatus(res);
    }

    async createContact(params) {
        let requestBody = {request: {contacts: {add: [params]}}};

        let res = await fetch(`${this.host}/private/api/v2/json/contacts/set`,
            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    Cookie: this.cookies
                }
            }
        );

        await this._checkStatus(res);

        // TODO: Требуется обработка ошибки разбора JSON-а
        const result = await res.json();
        return result.response.contacts.add;
    }

    async createLead(params) {
        let requestBody = {request: {leads: {add: [params]}}};

        let res = await fetch(`${this.host}/private/api/v2/json/leads/set`,
            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    Cookie: this.cookies
                }
            }
        );

        await this._checkStatus(res);

        // TODO: Требуется обработка ошибки разбора JSON-а
        const result = await res.json();
        return result.response.leads.add;
    }

    async createTask(params) {
        let requestBody = {request: {tasks: {add: [params]}}};

        let res = await fetch(`${this.host}/private/api/v2/json/tasks/set`,
            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    Cookie: this.cookies
                }
            }
        );

        await this._checkStatus(res);

        // TODO: Требуется обработка ошибки разбора JSON-а
        const result = await res.json();
        return result.response.tasks.add;
    }
}

module.exports = Amocrm;

