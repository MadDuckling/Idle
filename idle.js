/** everything that saves goes here */
var data = {
  coins: {
    buyMode: 1,

    amount: 1000,
    tier1Bought: 0,
    tier1Generated: 0,
    tier2Bought: 0,
    tier2Generated: 0,

    tier1Multiplier: 1,
  },
};
/** everything that is function goes here */
var game = {
  /** initialization goes here */
  init() {
    btnBuyMode1x.onclick = () => game.setBuyMode(1);
    btnBuyMode5x.onclick = () => game.setBuyMode(5);
    btnBuyMode25x.onclick = () => game.setBuyMode(25);
    btnBuyModeMax.onclick = () => game.setBuyMode('max'); // Special case for MAX

    btnBuyCoin1.onclick = () => game.buyItem(5, 1.2, 'tier1Bought');
    btnBuyCoin2.onclick = () => game.buyItem(100, 1.2, 'tier2Bought');
    btnBuyCoinUpgrade1.onclick = () => game.buyItem(250, 1.2, 'tier1Multiplier');
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
  getCost(baseCost, growthFactor, coinsBought) {
    // Calculate the total cost based on the current buy mode
    const buyMode = data.coins.buyMode;
    if (buyMode === 'max') {
      let totalCost = 0;
      let tempCoinsBought = coinsBought;
      let tempAmount = data.coins.amount;

      while (tempAmount >= Math.round(baseCost * Math.pow(growthFactor, tempCoinsBought))) {
        const cost = Math.round(baseCost * Math.pow(growthFactor, tempCoinsBought));
        totalCost += cost;
        tempAmount -= cost;
        tempCoinsBought++;
      }
      
      return totalCost || Math.round(baseCost * Math.pow(growthFactor, coinsBought)); // Return single cost if no MAX purchase possible
    } else {
      let totalCost = 0;
      for (let i = 0; i < buyMode; i++) {
        totalCost += Math.round(baseCost * Math.pow(growthFactor, coinsBought + i));
      }
      return totalCost;
    }
  },
  // Calc buying said item
  buyItem(baseCost, growthFactor, coinsBoughtKey) {
    const buyMode = data.coins.buyMode;
  
    if (buyMode === 'max') {
      let tempAmount = data.coins.amount;
      let itemsBought = 0;
  
      // Buy as many items as possible
      while (tempAmount >= Math.round(baseCost * Math.pow(growthFactor, data.coins[coinsBoughtKey]))) {
        const cost = Math.round(baseCost * Math.pow(growthFactor, data.coins[coinsBoughtKey]));
        tempAmount -= cost;
        itemsBought++;
        data.coins[coinsBoughtKey]++;
      }
  
      // Update the amount after purchasing
      data.coins.amount -= (data.coins.amount - tempAmount);
    } else {
      // Buy fixed number of items
      const cost = game.getCost(baseCost, growthFactor, data.coins[coinsBoughtKey]);
      if (data.coins.amount >= cost) {
        data.coins.amount -= cost;
        data.coins[coinsBoughtKey] += buyMode;
      }
    }
  
    game.updateDisplay();
  },
  

  /** everything that updates goes here */
  tick() {
    data.coins.amount += (data.coins.tier1Bought + data.coins.tier1Generated) * data.coins.tier1Multiplier;
    data.coins.tier1Generated += data.coins.tier2Bought + data.coins.tier2Generated;

    game.updateDisplay();
  },

  /** everything that draws goes here */
  updateDisplay() {
    /// Value Displays
    // Coin amount display
    elCoins.innerText = data.coins.amount;
    elCoinGenAmount.innerText = (data.coins.tier1Bought + data.coins.tier1Generated) * data.coins.tier1Multiplier;

    /// Generators and Upgrades
    // Coin tier 1
    elCoin1Cost.innerText = game.getCost(5, 1.2, data.coins.tier1Bought);
    elCoin1Count.innerText = data.coins.tier1Bought + data.coins.tier1Generated;
    // Button
    btnBuyCoin1.disabled = !game.canBuy(() => game.getCost(5, 1.2, data.coins.tier1Bought));
    btnBuyCoin1.className = game.canBuy(() => game.getCost(5, 1.2, data.coins.tier1Bought)) ? "buildingPurchaseBtn available" : "buildingPurchaseBtn";

    // Coin tier 2
    elCoin2Cost.innerText = game.getCost(100, 1.2, data.coins.tier2Bought);
    elCoin2Count.innerText = data.coins.tier2Bought + data.coins.tier2Generated;
    // Button
    btnBuyCoin2.disabled = !game.canBuy(() => game.getCost(100, 1.2, data.coins.tier2Bought));
    btnBuyCoin2.className = game.canBuy(() => game.getCost(100, 1.2, data.coins.tier2Bought)) ? "buildingPurchaseBtn available" : "buildingPurchaseBtn";  

    // Coin Multiplier 1
    elCoinUpgrade1Cost.innerText = game.getCost(250, 1.2, data.coins.tier1Multiplier);
    elCoinUpgrade1Count.innerText = data.coins.tier1Multiplier - 1;
    // Button
    btnBuyCoinUpgrade1.disabled = !game.canBuy(() => game.getCost(250, 1.2, data.coins.tier1Multiplier));
    btnBuyCoinUpgrade1.className = game.canBuy(() => game.getCost(250, 1.2, data.coins.tier1Multiplier)) ? "buildingPurchaseBtn available" : "buildingPurchaseBtn";  

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