const fetch = require('node-fetch');
const FormData = require('form-data');

const AmoError = require('./errors/AmoError');
const AmoAuthError = require('./errors/AmoAuthError');
const AmoRequestError = require('./errors/AmoRequestError');

class Amocrm {
  constructor(host = null, login = null, hash = null, debug = false) {
    this.cookies = null;
    this.debug = debug;

    if (!host || !login || !hash) {
      throw new AmoError('Amocrm-api: no init params');
    }

    this.host = host;
    this.login = login;
    this.hash = hash;
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
    if (this.debug) {
      console.log(res.status);
      console.dir(res);
    }

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
    const requestBody = { update: [params] };

    const res = await fetch(`${this.host}/api/v2/contacts`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);
  }

  async createContact(params) {
    const requestBody = { add: [params] };

    const res = await fetch(`${this.host}/api/v2/contacts`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);

    // TODO: Требуется обработка ошибки разбора JSON-а
    const result = await res.json();
    return result._embedded.items[0];
  }

  async updateLead(params) {
    const requestBody = { update: [params] };

    const res = await fetch(`${this.host}/api/v2/leads`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);
  }

  async createLead(params) {
    const requestBody = { add: [params] };

    const res = await fetch(`${this.host}/api/v2/leads`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);

    // TODO: Требуется обработка ошибки разбора JSON-а
    const result = await res.json();
    return result._embedded.items[0];
  }

  async createTask(params) {
    const requestBody = { add: [params] };

    const res = await fetch(`${this.host}/api/v2/tasks`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        Cookie: this.cookies,
      },
    });

    await this._checkStatus(res);

    // TODO: Требуется обработка ошибки разбора JSON-а
    const result = await res.json();
    return result._embedded.items[0];
  }
}

module.exports = Amocrm;
