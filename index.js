const alfy = require('alfy');
const Binance = require('binance-withdrawal');

const binance = new Binance('https://api.binance.com', process.env.API_KEY, process.env.API_SECRET);

async function updateCache() {
  const outputs = await binance.getWithdrawableTokens();
  const coins = outputs.map((token) => ({ symbol: token.coin, amount: Number(token.free) }));
  const promisePrices = coins.map((coin) => binance.getPrice(coin.symbol.toUpperCase()).then((result) => result.price).catch((_) => '1'));

  const infos = await Promise.all(promisePrices)
    // eslint-disable-next-line max-len
    .then((prices) => outputs.map((token, index) => ({ ...token, price: Number(prices[index]) * coins[index].amount })))
    .then((tokens) => tokens.map((token) => ({
      title: token.name, subtitle: `${token.free} ${token.coin} (${token.price.toFixed(2)}$)`, autocomplete: `${token.coin} `, arg: token.coin, uid: token.coin, match: token.coin,
    })));

  return infos;
}

async function run() {
  const cacheTokens = alfy.cache.get('tokens');
  if (cacheTokens) {
    alfy.output(cacheTokens);
  } else {
    const outputs = await updateCache();
    alfy.output(outputs);
    alfy.cache.set('tokens', outputs, { maxAge: 15000 });
  }
}

run();
