import {getDateYMDHMS} from '@k03mad/simple-date';
import {log} from '@k03mad/simple-log';
import {registerMetrics} from '@k03mad/simple-prom';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import env from '../env.js';

import {nameText, numText} from './helpers/colors.js';
import {packageJson} from './helpers/parse.js';
import * as metrics from './metrics/_index.js';

const register = registerMetrics({
    app: packageJson.name,
    port: env.server.port,
    metrics,
});

const app = express();

if (env.debug) {
    app.use(morgan('combined'));
}

app.use(helmet());
app.use(compression());

app.get('/metrics', async (req, res) => {
    const data = await register.metrics();
    res.send(data);
});

app.listen(env.server.port, () => log([
    `[${getDateYMDHMS()}]`,
    nameText(packageJson.name),
    'started on port',
    numText(env.server.port),
].join(' ')));
