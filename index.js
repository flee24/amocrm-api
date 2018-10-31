const fetch = require('node-fetch');
const FormData = require('form-data');
const config = require('config');

const AmoAuthError = require('./errors/AmoAuthError');
const AmoRequestError = require('./errors/AmoRequestError');

class Amocrm {
  constructor() {
    this.cookies = null;
    this.host = config.get('amo.host');
    this.login = config.get('amo.login');
    this.hash = config.get('amo.hash');
  }

  async _storeAuth(res) {
    const cookies = res.headers.get('Set-Cookie').split(',');

    if (!cookies) {
      throw new AmoAuthError();
    }

    this.cookies = cookies.map(cookieHeader => cookieHeader.split(';')[0]).join('; ');
  }

  async auth() {
    const form = new FormData();
    form.append('USER_LOGIN', this.login);
    form.append('USER_HASH', this.hash);

    const res = await fetch(`${this.host}/private/api/auth.php?type=json`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

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
    const res = await fetch(`${this.host}/private/api/v2/json/accounts/current`, {
      method: 'GET',
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);

    const result = await res.json();
    if (!result.response || !result.response.account) {
      throw new AmoRequestError();
    }

    return result.response.account;
  }

  async getContacts(params) {
    let queryString = '';
    if (params) {
      queryString = `?${Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')}`;
    }

    const res = await fetch(`${this.host}/api/v2/contacts${queryString}`, {
      method: 'GET',
      headers: {
        Cookie: this.cookies,
      },
    });

    if (res.status === 204) {
      return [];
    }

    await this._checkStatus(res);

    const result = await res.json();

    if (!result._embedded || !result._embedded.items) {
      return [];
    }

    return result._embedded.items;
  }

  async updateContact(params) {
    const requestBody = { request: { contacts: { update: [params] } } };

    const res = await fetch(`${this.host}/private/api/v2/json/contacts/set`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);
  }

  async createContact(params) {
    const requestBody = { request: { contacts: { add: [params] } } };

    const res = await fetch(`${this.host}/private/api/v2/json/contacts/set`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);

    // TODO: Требуется обработка ошибки разбора JSON-а
    const result = await res.json();
    return result.response.contacts.add;
  }

  async updateLead(params) {
    const requestBody = { request: { leads: { update: [params] } } };

    const res = await fetch(`${this.host}/private/api/v2/json/leads/set`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);
  }

  async createLead(params) {
    const requestBody = { request: { leads: { add: [params] } } };

    const res = await fetch(`${this.host}/private/api/v2/json/leads/set`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);

    // TODO: Требуется обработка ошибки разбора JSON-а
    const result = await res.json();
    return result.response.leads.add;
  }

  async createTask(params) {
    const requestBody = { request: { tasks: { add: [params] } } };

    const res = await fetch(`${this.host}/private/api/v2/json/tasks/set`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);

    // TODO: Требуется обработка ошибки разбора JSON-а
    const result = await res.json();
    return result.response.tasks.add;
  }
}

module.exports = Amocrm;
