import client from 'prom-client';

import Tinkoff from '../api/tinkoff.js';
import {replaceByKeyValue} from '../helpers/object.js';
import {getCurrentFilename} from '../helpers/paths.js';

const figiToCurrency = {
    RUB000UTSTOM: 'Рубли',
};

const nameReplacements = {
    '- привилегированные акции': 'прив.',
    'Вечный портфель': 'ВП',
};

export default new client.Gauge({
    name: getCurrentFilename(import.meta.url),
    help: 'Instruments',
    labelNames: [
        'account',
        'instrument',
        'type',
    ],

    async collect() {
        this.reset();

        const {accounts} = await Tinkoff.getAccounts();

        await Promise.all(accounts.map(async account => {
            if (Tinkoff.isOpenAndNotRestrictedAccount(account)) {
                const portfolio = await Tinkoff.getPortfolio(account.id);

                await Promise.all(portfolio.positions.map(async position => {
                    let positionName;

                    if (position.instrumentType === 'currency') {
                        positionName = figiToCurrency[position.figi];
                    } else {
                        const {instruments} = await Tinkoff.findInstrument(position.figi);
                        positionName = replaceByKeyValue(nameReplacements, instruments[0].name);
                    }

                    const positionQuantity = Number(position.quantity.units);
                    const positionPriceOne = Tinkoff.getUnitsWithNano(position.currentPrice);
                    const positionPriceTotal = positionPriceOne * positionQuantity;

                    const positionYieldTotal = Tinkoff.getUnitsWithNano(position.expectedYield);
                    const positionYieldPercentTotal = positionYieldTotal * 100 / (positionPriceTotal - positionYieldTotal);

                    this.labels(account.name, positionName, 'priceOne').set(positionPriceOne);
                    this.labels(account.name, positionName, 'priceTotal').set(positionPriceTotal);
                    this.labels(account.name, positionName, 'yieldTotal').set(positionYieldTotal);
                    this.labels(account.name, positionName, 'yieldPercentTotal').set(positionYieldPercentTotal);
                    this.labels(account.name, positionName, 'quantity').set(positionQuantity);
                }));
            }
        }));
    },
});
