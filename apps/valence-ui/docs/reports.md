# Reports

## How to use

1. Remotely: [valence.zone/admin/reports](https://valence.zone/admin/reports).
2. Locally:

```sh
clone & cd into repo
pnpm install

## for environment variables
vercel login
vercel link
vercel env pull ## default=development, this is ok

pnpm start
```

## Rebalancer Orcacle vs. Coingecko Price Report

Fetch balances, oracle prices, and historic prices for an account for last 365 days.

```
/admin/reports/oracle-vs-coingecko?address=neutron13pvwjc3ctlv53u9c543h6la8e2cupkwcahe5ujccdc4nwfgann7ss0xynz&download=true
```

### Endpoint:

- url: `/admin/reports/oracle-vs-coingecko`
- params:
  - `address` (string, required)
  - `download` (string=true,false)

### How it works:

Balances fetched from indexer:

```javascript
// balances
`${INDEXER_URL}/${INDEXER_API_KEY}/wallet/${address}/bank/balances?times=${range}&timeStep=${timeStep}`;
```

Oracle prices fetched from indexer

```javascript
// oracle prices
`${INDEXER_URL}/${INDEXER_API_KEY}/contract/${ORACLE_ADDRESS}/valence/oracle/price?pair=${pair}&times=${range}&timeStep=${timeStep}`;
```

Coingecko prices fetched from coingecko via API snapper

```javascript
// coingecko prices
`${API_CACHE_URL}/q/coingecko-price-history?id=${coinGeckoId}&range=year`;
```
