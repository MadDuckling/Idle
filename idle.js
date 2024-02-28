/** everything that saves goes here */
var data = {
  coins: {
    amount: 1000000,
    tier1Bought: 0,
    tier1Generated: 0,
    tier2Bought: 0,
    tier2Generated: 0,
  
    tier1Multiplier: 0,
  },
};
/** everything that is function goes here */
var game = {
  /** initialization goes here */
  init() {
    btnBuyCoin1.onclick = () => game.getCoin1();
    btnBuyCoin2.onclick = () => game.getCoin2();
    btnBuyCoinUpgrade1.onclick = () => game.getCoinUpgrade1();
  },
  /** everything that updates goes here */
  tick() {
    data.coins.amount += (data.coins.tier1Bought + data.coins.tier1Generated) * (1.5 ^ data.coins.tier1Multiplier);
    data.coins.tier1Generated += data.coins.tier2Bought + data.coins.tier2Generated;

    game.updateDisplay();
  },
  /** everything that draws goes here */
  updateDisplay() {
    elCoins.innerText = data.coins.amount;
    elCoinGenAmount.innerText = (data.coins.tier1Bought + data.coins.tier1Generated) * data.coins.tier1Multiplier;

    elCoin1Container.hidden = (data.coins.tier1Bought + data.coins.tier1Generated) == 0 && !game.canGetCoin1();
    elCoin1Cost.innerText = game.getCoin1Cost();
    elCoin1Count.innerText = data.coins.tier1Bought + data.coins.tier1Generated;

    elCoin2Container.hidden = (data.coins.tier2Bought + data.coins.tier2Generated) == 0 && !game.canGetCoin2();
    elCoin2Cost.innerText = game.getCoin2Cost();
    elCoin2Count.innerText = data.coins.tier2Bought + data.coins.tier2Generated;
    
    elCoinUpgrade1Container.hidden = data.coins.tier1Multiplier == 0 && !game.canGetCoinUpgrade1();
    elCoinUpgrade1Cost.innerText = game.getCoinUpgrade1Cost();
    elCoinUpgrade1Count.innerText = data.coins.tier1Multiplier;
  },

  getCoin1Cost() {
    return Math.round(5 * Math.pow(1.2, data.coins.tier1Bought));
  },
  canGetCoin1() {
    return data.coins.amount >= game.getCoin1Cost();
  },
  getCoin1() {
    if (game.canGetCoin1()) {
      data.coins.amount -= game.getCoin1Cost();
      data.coins.tier1Bought++;
    }
    game.updateDisplay();
  },

  getCoin2Cost() {
    return Math.round(100 * Math.pow(1.2, data.coins.tier2Bought));
  },
  canGetCoin2() {
    return data.coins.amount >= game.getCoin2Cost();
  },
  getCoin2() {
    if (game.canGetCoin2()) {
      data.coins.amount -= game.getCoin2Cost();
      data.coins.tier2Bought++;
    }
    game.updateDisplay();
  },

  getCoinUpgrade1Cost() {
    return Math.round(250 * Math.pow(1.2, data.coins.tier1Multiplier));
  },
  canGetCoinUpgrade1() {
    return data.coins.amount >= game.getCoinUpgrade1Cost();
  },
  getCoinUpgrade1() {
    if (game.canGetCoinUpgrade1()) {
      data.coins.amount -= game.getCoinUpgrade1Cost();
      data.coins.tier1Multiplier++;
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