/** everything that saves goes here */
var data = {
  coins: {
    buyMode: 1,

    amount: 1000,
    tier1CoinBought: 0,
    tier1CoinGenerated: 0,
    tier2CoinBought: 0,
    tier2CoinGenerated: 0,

    tier1CoinMultiplier: 1,
  },
};

/** all buildings and upgrades goes here **/
var items = {
  tier1Coin: {
    baseCost: 5,
    growthFactor: 1.2,
    boughtKey: 'tier1CoinBought',
    generatedKey: 'tier1CoinGenerated',
    displayElement: {
      cost: elCoin1Cost,
      bought: elCoin1Bought,
      generated: elCoin1Generated,
      button: btnBuyCoin1,
    }
  },
  tier2Coin: {
    baseCost: 100,
    growthFactor: 1.2,
    boughtKey: 'tier2CoinBought',
    generatedKey: 'tier2CoinGenerated',
    displayElement: {
      cost: elCoin2Cost,
      bought: elCoin2Bought,
      generated: elCoin2Generated,
      button: btnBuyCoin2,
    }
  },
  tier1CoinMultiplier: {
    baseCost: 300,
    growthFactor: 1.5,
    boughtKey: 'tier1CoinMultiplier',
    displayElement: {
      cost: elCoinUpgrade1Cost,
      bought: elCoinUpgrade1Bought,
      generated: elCoinUpgrade1Generated = 0,
      button: btnBuyCoinUpgrade1,
    }
  },
};

/** everything that is function goes here */
var game = {
  init() {
    // Set the buy mode for each button
    btnBuyMode1x.onclick = () => game.setBuyMode(1);
    btnBuyMode5x.onclick = () => game.setBuyMode(5);
    btnBuyMode25x.onclick = () => game.setBuyMode(25);

    // Set the button actions for each item
    Object.keys(items).forEach(itemKey => {
      const item = items[itemKey];
      item.displayElement.button.onclick = () => game.buyItem(item);
    });
  },

  // Change buy mode
  setBuyMode(mode) {
    data.coins.buyMode = mode;
  
    // Update button styles
    document.querySelectorAll('.buyModeButton').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#btnBuyMode${mode === 'max' ? 'Max' : `${mode}x`}`).classList.add('active');
    
    game.updateDisplay();
  },

  // Calc if button is clickable
  canBuy(costFunction, amount = data.coins.amount) {
    return amount >= costFunction();
  },
  // Calc cost of item
  getCost(item) {
    const { baseCost, growthFactor, boughtKey } = item;

    let totalCost = 0;
    for (let i = 0; i < data.coins.buyMode; i++) {
      totalCost += Math.round(baseCost * Math.pow(growthFactor, data.coins[boughtKey] + i));
    }
    return totalCost;
  },
  // Calc buying said item
  buyItem(item) {
    const cost = game.getCost(item);

    if (data.coins.amount >= cost) {
      data.coins.amount -= cost;
      data.coins[item.boughtKey] += data.coins.buyMode;

      game.updateDisplay();
    }
  },
  

  /** everything that updates goes here */
  tick() {
    data.coins.amount += (data.coins.tier1CoinBought + data.coins.tier1CoinGenerated) * data.coins.tier1CoinMultiplier;
    data.coins.tier1CoinGenerated += data.coins.tier2CoinBought + data.coins.tier2CoinGenerated;

    game.updateDisplay();
  },

  /** everything that draws goes here */
  updateDisplay() {
    // Update coin amount and generation
    elCoins.innerText = data.coins.amount;
    elCoinGenAmount.innerText = (data.coins.tier1CoinBought + data.coins.tier1CoinGenerated) * data.coins.tier1CoinMultiplier;

    // Update each item's display
    Object.keys(items).forEach(itemKey => {
      const item = items[itemKey];
      item.displayElement.cost.innerText = game.getCost(item);
      item.displayElement.bought.innerText = data.coins[item.boughtKey]
      item.displayElement.generated.innerText = data.coins[item.generatedKey]
      

      item.displayElement.button.disabled = !game.canBuy(() => game.getCost(item));
      item.displayElement.button.className = game.canBuy(() => game.getCost(item)) ? "buildingPurchaseBtn available" : "buildingPurchaseBtn";
    });
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
game.init();
game.start();