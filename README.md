[ctrld-prom-exporter](https://github.com/k03mad/ctrld-prom-exporter) • [mik-prom-exporter](https://github.com/k03mad/mik-prom-exporter) • tin-invest-prom-exporter • [ya-iot-prom-exporter](https://github.com/k03mad/ya-iot-prom-exporter)

# [Tinkoff Investment — Prometheus] exporter

— [Get read only token](https://www.tinkoff.ru/invest/settings/api/) \
— [Use correct Node.JS version](.nvmrc) \
— Start exporter:

```bash
npm run start --token=t.a1234321 --port=11000
# or with envs
TINKOFF_API_TOKEN=t.a1234321 TINKOFF_EXPORTER_PORT=11000 npm run start
```

— Update Prometheus `scrape_configs` \
— [Import Grafana dashboard](grafana.json)
