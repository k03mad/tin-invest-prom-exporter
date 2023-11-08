import {request, requestCache} from '@k03mad/request';

import env from '../../env.js';

/** */
class Tinkoff {

    constructor() {
        this.urls = {
            api: 'https://invest-public-api.tinkoff.ru/rest/',
        };

        this.options = {
            method: 'POST',
            headers: {
                authorization: `Bearer ${env.tinkoff.token}`,
            },
            json: {},
        };
    }

    /**
     * @param {object} opts
     * @param {string} opts.path
     * @param {string} [opts.url]
     * @param {object} [opts.options]
     * @returns {Promise<object>}
     */
    async _get({options = {}, path, url = this.urls.api}) {
        const {body} = await request(url + path, {
            ...this.options,
            ...options,
        });

        return body;
    }

    /**
     * @param {object} opts
     * @param {string} opts.path
     * @param {string} [opts.url]
     * @param {object} [opts.options]
     * @returns {Promise<object>}
     */
    async _getCache({options = {}, path, url = this.urls.api}) {
        const {body} = await requestCache(url + path, {
            ...this.options,
            ...options,
        });

        return body;
    }

    /**
     * @returns {Promise<object>}
     */
    getAccounts() {
        return this._getCache({path: 'tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts'});
    }

    /**
     * @param {number|string} accountId
     * @returns {Promise<object>}
     */
    getPortfolio(accountId) {
        return this._get({
            path: 'tinkoff.public.invest.api.contract.v1.OperationsService/GetPortfolio',
            options: {
                json: {
                    accountId,
                    currency: 'RUB',
                },
            },
        });
    }

    /**
     * @param {string} query
     * @returns {Promise<object>}
     */
    findInstrument(query) {
        return this._getCache({
            path: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/FindInstrument',
            options: {
                json: {
                    query,
                },
            },
        });
    }

    /**
     * @param {object} price
     * @param {string} price.units
     * @param {number} price.nano
     * @returns {number}
     */
    getUnitsWithNano(price) {
        return Number(price.units) + (price.nano / 1_000_000_000);
    }

    /**
     * @param {object} account
     * @param {string} account.status
     * @param {string} account.name
     * @returns {boolean}
     */
    isOpenAndNotRestrictedAccount(account) {
        return account.status === 'ACCOUNT_STATUS_OPEN'
            && account.name !== 'Инвесткопилка';
    }

}
export default new Tinkoff();
