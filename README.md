# [Tinkoff Investment — Prometheus] exporter

— [Get read only token](https://www.tinkoff.ru/invest/settings/api/) \
— [Use correct Node.JS version](.nvmrc) \
— Start exporter:

```bash
# one time
npm run setup

# start app
npm run start --token=t.a1234321 --port=11000
# or with envs
TINKOFF_API_TOKEN=t.a1234321 TINKOFF_EXPORTER_PORT=11000 npm run start
```

[grafana-dashboards](https://github.com/k03mad/grafana-dashboards/tree/master/export)
