import client from 'prom-client';

import Tinkoff from '../api/tinkoff.js';
import {getCurrentFilename} from '../helpers/paths.js';

const currencies = {
    RUB000UTSTOM: 'Рубли',
};

export default new client.Gauge({
    name: getCurrentFilename(import.meta.url),
    help: 'Portfolio',
    labelNames: [
        'account',
        'instrument',
        'type',
    ],

    async collect() {
        const {accounts} = await Tinkoff.getAccounts();

        await Promise.all(accounts.map(async account => {
            if (
                account.status === 'ACCOUNT_STATUS_OPEN'
                && account.name !== 'Инвесткопилка'
            ) {
                const portfolio = await Tinkoff.getPortfolio(account.id);

                await Promise.all(portfolio.positions.map(async position => {
                    let positionName;

                    if (position.instrumentType === 'currency') {
                        positionName = currencies[position.figi];
                    } else {
                        const {instruments} = await Tinkoff.findInstrument(position.figi);
                        positionName = instruments[0].name;
                    }

                    const positionQuantity = Number(position.quantity.units);
                    const positionPriceOne = Tinkoff.getUnitsWithNano(position.currentPrice);
                    const positionPriceTotal = positionPriceOne * positionQuantity;

                    const positionYieldTotal = Tinkoff.getUnitsWithNano(position.expectedYield);

                    this.labels(account.name, positionName, 'priceOne').set(positionPriceOne);
                    this.labels(account.name, positionName, 'priceTotal').set(positionPriceTotal);
                    this.labels(account.name, positionName, 'yieldTotal').set(positionYieldTotal);
                    this.labels(account.name, positionName, 'quantity').set(positionQuantity);
                }));
            }
        }));
    },
});