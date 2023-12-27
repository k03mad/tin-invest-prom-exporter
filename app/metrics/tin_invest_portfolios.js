/* eslint-disable unicorn/filename-case */

import Tinkoff from '../api/tinkoff.js';
import {getCurrentFilename} from '../helpers/paths.js';

export default {
    name: getCurrentFilename(import.meta.url),
    help: 'Portfolios',
    labelNames: [
        'account',
        'type',
    ],

    async collect(ctx) {
        ctx.reset();

        const {accounts} = await Tinkoff.getAccounts();

        await Promise.all(accounts.map(async account => {
            if (Tinkoff.isOpenAndNotRestrictedAccount(account)) {
                const portfolio = await Tinkoff.getPortfolio(account.id);

                if (portfolio.positions.length > 0) {
                    const expectedYieldPercent = Tinkoff.getUnitsWithNano(portfolio.expectedYield);
                    const totalAmountPortfolio = Tinkoff.getUnitsWithNano(portfolio.totalAmountPortfolio);
                    const expectedYield = totalAmountPortfolio * expectedYieldPercent / (100 + expectedYieldPercent);

                    ctx.labels(account.name, 'expectedYield').set(expectedYield);
                    ctx.labels(account.name, 'expectedYieldPercent').set(expectedYieldPercent);
                    ctx.labels(account.name, 'totalAmountPortfolio').set(totalAmountPortfolio);
                }
            }
        }));
    },
};
