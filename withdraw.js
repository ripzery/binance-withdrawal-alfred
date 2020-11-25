const alfy = require('alfy');

const texts = alfy.input.split(' ');
const [symbol, amount] = texts;

alfy.output([{ title: `Confirm to withdraw ${amount || '...'} ${symbol}` }, { title: 'Cancel' }]);
