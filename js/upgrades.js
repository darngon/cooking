let upgrades = [];
let otherUpgrades = {
    chances: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 1,
        legendary: 1 / 3,
        elite: 0.5,
        mythical: 0.4,
        premium: 0.25,
        godTier: 0.1
    },
    common: [],
    uncommon: [],
    rare: [],
    epic: [
        {
            condition: "document.getElementById('alert').style.display === 'none' && !upgrades.map(g => g.text).includes(`'Enable Alerts (New order, new upgrade, etc)'`)",
            text: "'Enable Alerts (New order, new upgrade, etc)'",
            effect: "document.getElementById('alert').style.display = ''; otherSaved.unlockedAlerts = true; showAlert('Alerts Unlocked!');",
            cost: 200
        },
        {
            condition: "otherSaved.timeUpPopDec && !upgrades.map(g => g.effect).includes('otherSaved.timeUpPopDec = false')",
            text: "'Customers leaving won\\'t affect your popularity'",
            effect: "otherSaved.timeUpPopDec = false",
            cost: "player.totalEarnings / 5"
        }
    ],
    legendary: [
        {
            condition: true,
            text: "'Double Upgrade Level'",
            effect: "modifiers.upgradeLevel *= 2;",
            cost: "player.totalEarnings / 1.5"
        }
    ],
    elite: [
        {
            condition: "modifiers.maxUpgrades < 25 && upgrades.map(g => g.effect).filter(g => g === 'modifiers.maxUpgrades++;').length < 25 - modifiers.maxUpgrades",
            text: "'+1 Upgrade Slot'",
            effect: "modifiers.maxUpgrades++;",
            cost: "7 ** (modifiers.maxUpgrades + upgrades.map(g => g.effect).filter(g => g === 'modifiers.maxUpgrades++;').length)"
        }
    ],
    mythical: [
        {
            condition: true,
            text: "'Get three new legendary upgrades'",
            effect: "for (let i = 0; i < 3; i++) newUpgrade('legendary', 20, true);"
        }
    ],
    premium: [
        {
            condition: "player.money < Number.MAX_VALUE ** 0.5",
            text: "'Money ^2'",
            effect: "player.money **= 2"
        }
    ],
    godTier: [
        {
            condition: true,
            text: "'Every Modifier ^2'",
            effect: "for (const i in modifiers) if (typeof modifiers[i] === 'number' && i !== 'maxUpgrades') modifiers[i] **= 2;"
        }
    ]
};
let modifiers = {
    upgradeLevel: 1,
    customerPayment: 1,
    foodPrice: 1,
    foodAgingSpeed: 1,
    serveTime: 1,
    upgradeSpeed: 1,
    maxUpgrades: 3
};

function newUpgrade(rank, multiplier, ignoreLimit) {
    clearTimeout(debug.newUpgradeTimeout);
    if (upgrades.length >= modifiers.maxUpgrades && !ignoreLimit) return;
    if (multiplier === undefined) multiplier = 1;
    let n = Math.random();
    if (rank === undefined) {
        if (n < 1 / 6561) {
            rank = "godTier";
            multiplier = 10000;
        } else if (n < 1 / 2187) {
            rank = "premium";
            multiplier = 1000;
        } else if (n < 1 / 729) {
            rank = "mythical";
            multiplier = 100;
        } else if (n < 1 / 243) {
            rank = "elite";
            multiplier = 50;
        } else if (n < 1 / 81) {
            rank = "legendary";
            multiplier = 20;
        } else if (n < 1 / 27) {
            rank = "epic";
            multiplier = 10;
        } else if (n < 1 / 9) {
            rank = "rare";
            multiplier = 5;
        } else if (n < 1 / 3) {
            rank = "uncommon";
            multiplier = 2;
        } else {
            rank = "common";
        }
    }

    let availableOtherUpgrades = [];
    for (const i of otherUpgrades[rank])
        if (eval(i.condition))
            availableOtherUpgrades.push(i);

    let upgrade = {
        cost: Math.random() * player.totalEarnings * multiplier,
        rank: rank,
        type: randomKey(modifiers),
        multiplier: multiplier
    };

    if (Math.random() < otherUpgrades.chances[rank] && availableOtherUpgrades.join() !== "") {
        const {effect, text, cost} = availableOtherUpgrades[~~(Math.random() * availableOtherUpgrades.length)];
        upgrade.text = text;
        upgrade.effect = effect;
        if (cost !== undefined) upgrade.cost = typeof cost === "string" ? eval(cost) : cost;
    }

    while (/upgradeLevel|maxUpgrades/.test(upgrade.type)) upgrade.type = randomKey(modifiers);
    const {type} = upgrade;
    if (type === "customerPayment" || type === "serveTime") {
        upgrade.amount = Math.random() * 0.2 * modifiers.upgradeLevel * multiplier + 1;
    } else if (type === "foodPrice" || type === "foodAgingSpeed" || type === "upgradeSpeed") {
        upgrade.amount = multiplier / 20 + 1;
    }
    upgrades.push(upgrade);
    showAlert(`New ${capitalize(rank.replace("godTier", "God Tier"))} Upgrade`);
    updateUpgradeDiv();
    debug.newUpgradeTimeout = setTimeout(newUpgrade, Math.random() * 600000 / modifiers.upgradeSpeed);
}

function buyUpgrade(i) {
    const {amount, cost, type, multiplier, effect} = upgrades[i];
    if (player.money >= cost) {
        addMoney(-cost, "Purchased Upgrades");
        if (effect !== undefined) {
            eval(effect);
        } else if (type === "upgradeSpeed") {
            modifiers.upgradeSpeed *= amount;
        } else if (type === "customerPayment") {
            modifiers.customerPayment += amount - 1;
        } else if (type === "foodPrice") {
            modifiers.foodPrice /= amount;
            reload(true);
        } else if (type === "foodAgingSpeed") {
            modifiers.foodAgingSpeed /= amount;
        } else if (type === "serveTime") {
            modifiers.serveTime += amount - 1;
        }
        modifiers.upgradeLevel *= Math.random() * multiplier / 25 + 1;
        upgrades.splice(i, 1);
        updateUpgradeDiv();
    }
    sendUpdate();
}

function holdToBuyUpgrade(id) {
    if (player.money >= upgrades[id].cost) debug.holdTime++;
    document.getElementById(`upgradeBG_${id}`).style.width = `${debug.holdTime / 2}%`;
    if (debug.holdTime >= 200) {
        buyUpgrade(id);
        debug.holdTime = 0;
        clearInterval(debug.buyUpgradeInterval);
    }
}

function stopHoldingUpgrade() {
    debug.holdTime = 0;
    clearInterval(debug.buyUpgradeInterval);
    for (const i in upgrades) document.getElementById(`upgradeBG_${i}`).style.width = "0";
}

function updateUpgradeDiv() {
    let output = "<h1 onmousemove='debug.tooltips.modifiers(event);'>Upgrades</h1>";
    for (const u in upgrades) {
        let text;
        if (upgrades[u].text !== undefined) {
            text = eval(upgrades[u].text);
        } else if (upgrades[u].type === "upgradeSpeed") {
            text = `New Upgrade Time ÷${upgrades[u].amount.toLocaleString()}`;
        } else if (upgrades[u].type === "customerPayment") {
            text = `Customer Payment +${((upgrades[u].amount - 1) * 100).toLocaleString()}%`;
        } else if (upgrades[u].type === "foodPrice") {
            text = `Food Price ÷${upgrades[u].amount.toLocaleString()}`;
        } else if (upgrades[u].type === "foodAgingSpeed") {
            text = `Food Aging Speed ÷${upgrades[u].amount.toLocaleString()}`;
        } else if (upgrades[u].type === "serveTime") {
            text = `Serve Time +${((upgrades[u].amount - 1) * 100).toLocaleString()}%`;
        }
        output += `<div id='upgrade_${u}' class='upgrade ${upgrades[u].rank}' onmousemove='showTooltip(\`${capitalize(upgrades[u].rank.replace("godTier", "God Tier"))} Upgrade\`, "Click to purchase, right click to sell for a quarter of the buying price.");' onmousedown='clearInterval(debug.buyUpgradeInterval); if (event.button === 0) debug.buyUpgradeInterval = setInterval(() => {holdToBuyUpgrade(${u})}, 20);' onmouseup="stopHoldingUpgrade(${u});" oncontextmenu='addMoney(upgrades[${u}].cost / 4, "Sold Upgrade"); upgrades.splice(${u}, 1); updateUpgradeDiv();'><span style='position: absolute; left: 8px;'>${text}</span><span style='position: absolute; right: 8px;'>${format("money", upgrades[u].cost)}</span><div id="upgradeBG_${u}" style="width: 0; height: 100%; border-radius: 50vh; background: #fff; opacity: 0.5;"></div></div>`;
    }
    for (let i = upgrades.length; i < modifiers.maxUpgrades; i++)
        output += `<div class="upgrade empty" onmousemove="showTooltip('Empty Upgrade Slot', 'Eventually a new upgrade will appear here');"><span style="width: 100%;">Empty</span></div>`
    document.getElementById("upgrades").innerHTML = output;
}