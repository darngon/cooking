// noinspection DuplicatedCode

const ws = new WebSocket("wss://10.214.148.236:9928");

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
let game = {
    time: 18738,
    day: 1,
    year: 1,
    open: false
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
        counter(e) {
            showTooltip("Table", "This can be used to store food without modifying it.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        oven(e) {
            showTooltip("Oven", "This device can be used to slowly heat up foods.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        fridge(e) {
            showTooltip("Fridge", "This device can be used to slowly cool down foods.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        sun(e) {
            showTooltip("Sun", "This can be used to quickly heat food up.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        freezer(e) {
            showTooltip("Freezer", "This glass of liquid nitrogen can be used to quickly cool food down.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        accelerator(e) {
            showTooltip("Particle Accelerator", "This device can be used to heat up food extremely quickly.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        decelerator(e) {
            showTooltip("Particle Decelerator", "This device can be used to cool down food extremely quickly.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        mortar(e) {
            showTooltip("Mortar", "This device can be used to grind up some substances.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        foodList(e) {
            showTooltip("Magic Tablet", "You can use this to buy basic ingredients and liquids.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        autoCutter(e) {
            showTooltip("Automatic Cutter", "This is used to cut foods into smaller pieces. You can scroll up or down to change the size of the cutter.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        plate(e) {
            showTooltip("Plate", "You can put foods on this and use it to make meals. Right click to make a meal.", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        trash(e) {
            showTooltip("Trash", "bye bye food", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        wallet(e) {
            showTooltip("Wallet", "Used to store money outside of the bank", e.clientX / debug.zoom, e.clientY / debug.zoom);
        },
        modifiers(e) {
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
            showTooltip("Modifiers", output, e.clientX / debug.zoom, e.clientY / debug.zoom);
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
    priceMultiplier: 1,
    timeSpeed: 1
};
let otherSaved = {
    unlockedAlerts: true,
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
    ws.send(JSON.stringify({
        id: SERVER_ID,
        type: "chat",
        message: `${username}: ${document.getElementById("sendChatMsg").value}`
    }));
    document.getElementById("sendChatMsg").value = "";
}

function start(loadSave, isMultiplayer) {
    debug.started = true;
    if (loadSave) load();
    if (isMultiplayer) {
        if (debug.websocketFailed) {
            alert("Server connection failed. Check your connection.");
            return;
        }
        SERVER_ID = prompt("Multiplayer Server ID?");
        username = prompt("Username?");
        document.getElementById("chat").style.display = "";
        ws.send(JSON.stringify({type: "newUser", id: SERVER_ID}));
    }
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("game").style.display = "";
    reload();
    debug.newUpgradeTimeout = setTimeout(newUpgrade, Math.random() * 600000 / modifiers.upgradeSpeed);
    setTimeout(getOrder, 5000);
    setInterval(save, 5000);
    setInterval(tick, 50);
}

function hostServer() {
    if (debug.websocketFailed) {
        alert("Websocket server connection failed. Check your connection.");
        return;
    }
    let serverId = "";
    while (serverId.length < 5)
        serverId = (~~(Math.random() * 60466176)).toString(36);
    SERVER_ID = serverId;
    console.log(serverId);
    start(false);
    ws.send(JSON.stringify({type: "newServer", id: serverId}));
    document.getElementById("chat").style.display = "";
    alert(`Server ID: ${serverId}`);
    username = prompt("Username?");
}

ws.addEventListener("open", () => {
    debug.websocketFailed = false;
	document.querySelector("#host").disabled = false;
	document.querySelector("#join").disabled = false;
	document.querySelector("#host").innerText = "Host Multiplayer Server";
	document.querySelector("#join").innerText = "Join Multiplayer Server";
    ws.onmessage = m => {
        try {
			m = JSON.parse(m.data);
			console.log(`Received ${m.type} from ${m.id}`)
		} catch (e) {
			console.log(`Failed to parse ${m.data} as JSON`);
			return;
		}

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
                document.getElementById("chatMsg").innerText = chat.join("\n");
                document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
            } else if (m.type === "missingServer") {
                alert(`Failed to connect to ${SERVER_ID}. Try hosting a server instead.`);
                location.reload();
            }
        }
    };
    console.log("%cConnected", "color: #0f0");
    ws.send(JSON.stringify({type: "log", value: "New user connected"}));
});

ws.onerror = () => {
    debug.websocketFailed = true;
    console.log("%cFailed to connect to the WebSocket servers", "color: #ff0");
	document.querySelector("#host").innerText = "Host Multiplayer Server (Unavailable)";
	document.querySelector("#join").innerText = "Join Multiplayer Server (Unavailable)";
}

ws.onclose = () => {
    debug.websocketFailed = true;
    console.log("%cDisconnected from server", "color: #ff0");
	if (SERVER_ID !== undefined) {
		showAlert("You have been disconnected from the server. Press OK to reload the page.");
		location.reload();
	}
}