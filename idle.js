/** everything that saves goes here */
var data = {
  coins: 1000000,
  coin1Bought: 0,
  coin1Generated: 0,
  coin2Bought: 0,
  coin2Generated: 0,

  coinUpgrade1: 0,
};
/** everything that is function goes here */
var game = {
  /** initialization goes here */
  init() {
    // using `element.onclick` is cancer, but it is simple and does work
    btnBuyCoin1.onclick = () => game.getCoin1();
    btnBuyCoin2.onclick = () => game.getCoin2();
    btnBuyCoinUpgrade1.onclick = () => game.getCoinUpgrade1();
  },
  /** everything that updates goes here */
  tick() {
    data.coins += (data.coin1Bought + data.coin1Generated) * (1.5 ^ data.coinUpgrade1);
    data.coin1Generated += data.coin2Bought + data.coin2Generated;

    game.updateDisplay();
  },
  /** everything that draws goes here */
  updateDisplay() {
    // finding elements as `window[id]` (or just `id`) is cancer, but it is simple and does work *fast*
    // using `element.innerText` is a good practice
    // using `element.hidden` is an okay practice
    // using `button.disabled` is a good practice
    // updating every text every tick may be cancer if you do over 10'000 text updates per second

    elCoins.innerText = data.coins;
    elCoinGenAmount.innerText = (data.coin1Bought + data.coin1Generated) * data.coinUpgrade1;

    elCoin1Container.hidden = (data.coin1Bought + data.coin1Generated) == 0 && !game.canGetCoin1();
    elCoin1Cost.innerText = game.getCoin1Cost();
    elCoin1Count.innerText = data.coin1Bought + data.coin1Generated;

    elCoin2Container.hidden = (data.coin2Bought + data.coin2Generated) == 0 && !game.canGetCoin2();
    elCoin2Cost.innerText = game.getCoin2Cost();
    elCoin2Count.innerText = data.coin2Bought + data.coin2Generated;
    
    elCoinUpgrade1Container.hidden = data.coinUpgrade1 == 0 && !game.canGetCoinUpgrade1();
    elCoinUpgrade1Cost.innerText = game.getCoinUpgrade1Cost();
    elCoinUpgrade1Count.innerText = data.coinUpgrade1;
  },

  getCoin1Cost() {
    return Math.round(5 * Math.pow(1.2, data.coin1Bought));
  },
  canGetCoin1() {
    return data.coins >= game.getCoin1Cost();
  },
  getCoin1() {
    if (game.canGetCoin1()) {
      data.coins -= game.getCoin1Cost();
      data.coin1Bought++;
    }
    game.updateDisplay();
  },

  getCoin2Cost() {
    return Math.round(100 * Math.pow(1.2, data.coin2Bought));
  },
  canGetCoin2() {
    return data.coins >= game.getCoin2Cost();
  },
  getCoin2() {
    if (game.canGetCoin2()) {
      data.coins -= game.getCoin2Cost();
      data.coin2Bought++;
    }
    game.updateDisplay();
  },

  getCoinUpgrade1Cost() {
    return Math.round(250 * Math.pow(1.2, data.coinUpgrade1));
  },
  canGetCoinUpgrade1() {
    return data.coins >= game.getCoinUpgrade1Cost();
  },
  getCoinUpgrade1() {
    if (game.canGetCoinUpgrade1()) {
      data.coins -= game.getCoinUpgrade1Cost();
      data.coinUpgrade1++;
    }
    game.updateDisplay();
  },

  // theese are not perfect, but they are simple 
  save(savename = 'idleSave') {
    localStorage.setItem(savename, JSON.stringify(data));
  },
  load(savename = 'idleSave') {
    Object.assign(data, JSON.parse(localStorage.getItem(savename) || '{}'));
    game.init();
    game.updateDisplay();
  },
  clearSave(savename = 'idleSave') {
    localStorage.setItem(savename, '{}');
    location.reload();
  },
  start() {
    // using setInterval is an okay practice, it has its own features and problems
    setInterval(() => game.tick(), /* 1 second */ 1e3);
    setInterval(() => game.save(), /* 10 seconds */ 10e3);
  },
}
game.load();
game.start();