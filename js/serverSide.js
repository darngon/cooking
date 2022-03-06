// noinspection DuplicatedCode

const ws = new WebSocket("ws://192.168.31.99:8080");

let SERVER_ID;
let username;
let chat = [];
let items = [];
let player = {
    money: 100,
    recentTransactions: [],
    popularity: 1,
    skill: 1,
    totalEarnings: 100
};
let debug = {
    websocketFailed: false,
    isInKitchen: true,
    location: "kitchen",
    groups: {
        Money: undefined,
        undefined: undefined
    },
    tooltips: {
        counter() {
            showTooltip("Table", "This can be used to store food without modifying it.");
        },
        oven() {
            showTooltip("Oven", "This device can be used to slowly heat up foods.");
        },
        fridge() {
            showTooltip("Fridge", "This device can be used to slowly cool down foods.");
        },
        sun() {
            showTooltip("Sun", "This can be used to quickly heat food up.");
        },
        freezer() {
            showTooltip("Freezer", "This glass of liquid nitrogen can be used to quickly cool food down.");
        },
        accelerator() {
            showTooltip("Particle Accelerator", "This device can be used to heat up food extremely quickly.");
        },
        decelerator() {
            showTooltip("Particle Decelerator", "This device can be used to cool down food extremely quickly.");
        },
        mortar() {
            showTooltip("Mortar", "This device can be used to grind up some substances.");
        },
        foodList() {
            showTooltip("Magic Tablet", "You can use this to buy basic ingredients and liquids.");
        },
        autoCutter() {
            showTooltip("Automatic Cutter", "This is used to cut foods into smaller pieces. You can scroll up or down to change the size of the cutter.");
        },
        plate() {
            showTooltip("Plate", "You can put foods on this and use it to make meals. Right click to make a meal.");
        },
        trash() {
            showTooltip("Trash", "bye bye food");
        },
        wallet() {
            showTooltip("Wallet", "Used to store money outside of the bank");
        },
        modifiers() {
            let output = `Upgrade Level: ${toNumberName(modifiers.upgradeLevel, true)}<br>Max Upgrades: ${Math.round(modifiers.maxUpgrades)}<br>`;
            if (modifiers.upgradeSpeed !== 1)
                output += `New Upgrade Time: ÷${toNumberName(modifiers.upgradeSpeed, true)}<br>`;
            if (modifiers.customerPayment !== 1)
                output += `Customer Payment: +${toNumberName((modifiers.customerPayment - 1) * 100, true)}%<br>`;
            if (modifiers.foodPrice !== 1)
                output += `Food Price: ÷${toNumberName(1 / modifiers.foodPrice, true)}<br>`;
            if (modifiers.foodAgingSpeed !== 1)
                output += `Food Aging Speed: ÷${toNumberName(1 / modifiers.foodAgingSpeed, true)}<br>`;
            if (modifiers.serveTime !== 1)
                output += `Serve Time: +${toNumberName((modifiers.serveTime - 1) * 100, true)}%<br>`;
            showTooltip("Modifiers", output);
        }
    },
    selectedItem: -1,
    animations: {
        mortar() {
            let interval = 50;
            let i = 0;

            function f() {
                setTimeout(() => {
                    i++;
                    if (i > 3) i = 0;
                    interval *= 1.23;
                    document.getElementById("mortar").src = `img/mortar/${i}.png`;
                    if (interval < 500) f();
                }, interval);
            }

            f();
        }
    },
    otherFoodTextures: [
        "custom",
        "empty",
        "transparent",
        "unknown",
        "unknownPowder"
    ],
    orderId: 0,
    buyUpgradeInterval: undefined,
    holdTime: 0
};
let settings = {
    background: "#203",
    textColor: "#fff",
    tooltipsEnabled: true,
    units: "metric",
    sandboxMode: false,
    canMakeRecipes: true,
    maxPaycheckValue: 150,
    paychecksEnabled: false,
    paycheckTime: 600,
    foodRottingSpeed: 1,
    cookSpeed: 1,
    minCookingTemperature: 120,
    roomTemp: 72,
    priceMultiplier: 1
};
let otherSaved = {
    unlockedAlerts: false,
    // When you fail to serve an order in time, your popularity decreases
    timeUpPopDec: true
};

function sendUpdate() {
    if (SERVER_ID !== undefined) {
        ws.send(JSON.stringify({id: SERVER_ID, type: "itemUpdate", data: items}));
        ws.send(JSON.stringify({id: SERVER_ID, type: "playerUpdate", data: player}));
        ws.send(JSON.stringify({id: SERVER_ID, type: "orderUpdate", data: orders}));
    }
}

function sendChatMsg() {
    ws.send(JSON.stringify({id: SERVER_ID, type: "chat", message: `${username}: ${document.getElementById("sendChatMsg").value}`}));
    document.getElementById("sendChatMsg").value = "";
}

ws.onopen = () => {
    debug.websocketFailed = false;
    ws.onmessage = m => {
        console.log(m);
        m = JSON.parse(m.data);
        if (SERVER_ID === m.id) {
            if (m.type === "log") {
                console.log(m.value);
            } else if (m.type === "itemUpdate") {
                items = m.data;
                for (const item in items) items[item] = new food(items[item]);
            } else if (m.type === "playerUpdate") {
                player = m.data;
            } else if (m.type === "orderUpdate") {
                orders = m.data;
            } else if (m.type === "chat") {
                chat.push(m.message);
                document.getElementById("chatMsg").innerHTML = chat.join("<br>");
            } else if (m.type === "missingServer") {
                alert(`Failed to connect to ${SERVER_ID}. Try hosting a server instead.`);
                location.reload();
            }
        }
    };
    console.log("Connected");
    ws.send(JSON.stringify({type: "log", value: "New user connected"}));
}

ws.onerror = () => {
    debug.websocketFailed = true;
    console.log("Failed to connect to the WebSocket servers");
}

ws.onclose = () => {
    debug.websocketFailed = true;
    console.log("Disconnected from server");
}