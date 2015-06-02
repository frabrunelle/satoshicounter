Meteor.setInterval(function() {
  var coinbasePrice = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['btc_to_cad'];
  var bitpayPrice = HTTP.get("https://bitpay.com/api/rates/cad").data['rate'];

  if (Math.abs(coinbasePrice - bitpayPrice) > coinbasePrice * 0.05) {
    var askPrice = 0.11;
    var bidPrice = 999.99;
  } else if (coinbasePrice > bitpayPrice) {
    var askPrice = coinbasePrice;
    var bidPrice = bitpayPrice;
  } else {
    var askPrice = bitpayPrice;
    var bidPrice = coinbasePrice;
  }

  var buyPrice = askPrice * (1 + orion.dictionary.get('price.percentageOverAskPrice', 5) / 100);
  var sellPrice = bidPrice * (1 - orion.dictionary.get('price.percentageBelowBidPrice', 5) / 100);

  Currencies.update(
    {name: 'Canadian dollar', code: 'CAD'},
    {$set:
      {askPrice: askPrice, bidPrice: bidPrice, buyPrice: buyPrice, sellPrice: sellPrice}
    }
  );
}, 60000);
