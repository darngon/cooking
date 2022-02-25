let items = [];
let player = {
    money: 0,
    recentTransactions: []
};
let debug = {
    isInKitchen: true,
    location: "kitchen",
    groups: {},
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
        "transparent",
        "unknown",
        "unknownPowder"
    ]
};
let settings = {
    background: "#203",
    canMakeRecipes: true,
    maxPaycheckValue: 150,
    paycheckTime: 600,
    textColor: "#fff",
    tooltipsEnabled: true,
    units: "imperial",
    foodRottingSpeed: 1,
    cookSpeed: 1,
    minCookingTemperature: 120,
    roomTemp: 72
};

if (localStorage.getItem("savedItems") !== null) document.getElementById("loadGameBtn").style.display = "";
document.getElementById("icon").href = `img/food/${Object.keys(foods)[~~(Math.random() * Object.keys(foods).length)]}.png`;

function start(loadSave) {
    if (loadSave) load();
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("game").style.display = "";
    setInterval(save, 5000);
}

// settings.foods = foods;

for (const s in settings) {
    document.getElementById(s).setAttribute("onchange", `settings['${s}'] = this.type === "checkbox" ? this.checked : this.value; if ("${document.getElementById(s).type}" === "number") settings['${s}'] = Number(settings['${s}']); updateSettings();`);
}

for (const i in animations) {
    setInterval(() => {
        if (animations[i].currentFrame === undefined) animations[i].currentFrame = 0;
        document.getElementById(i).src = animations[i].img[animations[i].currentFrame];
        animations[i].currentFrame++;
        if (animations[i].currentFrame >= animations[i].img.length) animations[i].currentFrame = 0;
    }, 1000 / animations[i].fps);
}

function updateSettings() {
    for (const s in settings) {
        document.getElementById(s).value = settings[s];
        if (document.getElementById(s).type === "checkbox") document.getElementById(s).checked = settings[s];
    }
    document.getElementById("settings").value = JSON.stringify(settings, null, 2);
    /* foods = settings.foods;
    settings.foods = foods; */
    document.body.style.background = settings.background;
    document.body.style.color = settings.textColor;
}

function makeRecipe(ingredients) {
    if (!settings.canMakeRecipes) {
        alert("Making recipes is disabled");
        return;
    }
    let ingredients2 = [];
    let name = "";
    let cookSpeed = 0;
    let cooked = 0;
    let mass = 0;
    let volume = 0;
    let temp = 0;
    for (const i in ingredients) {
        ingredients2[i] = {};
        ingredients2[i].id = ingredients[i].id;
        ingredients2[i].mass = ingredients[i].mass1;

        cookSpeed += ingredients[i].cookSpeed;
        cooked += ingredients[i].cooked;
        mass += ingredients[i].mass1;
        volume += ingredients[i].volume;
        temp += ingredients[i].temp;

        name += `${ingredients[i].name} `;
    }

    ingredients2.sort((a, b) => {
        let textA = a.id.toUpperCase();
        let textB = b.id.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    for (const k in items) {
        if (items[k].location === "recipeMaker") {
            items[k].gone = true;
        }
    }

    cooked /= ingredients.length;
    cookSpeed /= ingredients.length;
    temp /= ingredients.length;

    for (const r of recipes) {
        let ingredients3 = [];
        let ingredients4 = [];
        let acceptable = true;
        r.ingredients.sort((a, b) => {
            const a1 = a.id.toUpperCase();
            const a2 = b.id.toUpperCase();
            return a1 < a2 ? -1 : a1 > a2 ? 1 : 0;
        });
        for (const k in ingredients2) {
            let a;
            if (r.ingredients[k] === undefined) {
                a = false;
                break;
            } else {
                a = Number(ingredients2[k].mass) === Number(r.ingredients[k].mass);
            }
            if (r.ingredients[k].cooked === undefined) r.ingredients[k].cooked = {
                min: -Infinity,
                max: Infinity
            };
            if (r.ingredients[k].mass === undefined) a = true;
            if (ingredients2[k].cooked < r.ingredients[k].cooked.min || ingredients2[k].cooked > r.ingredients[k].cooked.max || !a) {
                acceptable = false;
            }
            ingredients3.push(ingredients2[k].id);
        }
        for (const t in r.ingredients) {
            ingredients4.push(r.ingredients[t].id);
        }
        if (ingredients4.join() === ingredients3.join() && acceptable) {
            items.push(new food(r.output.name, 2, cookSpeed, cooked, mass, undefined, temp, r.output.name));
            return;
        }
    }

    name += "Meal";

    if (confirm("You made a new food! Would you like to name it?")) {
        name = prompt("What do you want to name your food?");
    }

    items.push(new food("custom", true, cookSpeed, cooked, mass, undefined, temp, name));
}

function toggleFoodList(close) {
    clearTimeout(debug.foodListTimeout);
    clearTimeout(debug.foodListTimeout2);
    const b = document.getElementById("foodListBtn");
    const f = document.getElementById('foodList');
    b.style.pointerEvents = "none";
    f.style.pointerEvents = "none";
    if (b.style.height !== "480px" && !close) {
        b.style.marginLeft = "0";
        b.style.left = "8px";
        b.style.height = "480px";
        b.style.minWidth = "240px";
        b.style.borderRadius = "20px";
        f.style.pointerEvents = "";
    } else {
        debug.foodListTimeout = setTimeout(() => {
            b.style.marginLeft = "-20px";
            b.style.left = "50%";
            b.style.height = "80px";
            b.style.minWidth = "40px";
            b.style.borderRadius = "3px";
            b.style.pointerEvents = "";
            f.style.pointerEvents = "none";
        }, 500);
    }
    debug.foodListTimeout2 = setTimeout(() => {
        f.style.opacity = f.style.opacity !== "1" ? "1" : "0";
    }, f.style.opacity !== "1" ? 500 : 0);
}

function buy(id) {
    const p = foods[id].price !== undefined ? foods[id].price : 5;
    if (debug.locations["counter"] < 20) {
        if (player.money >= p) {
            debug.selectedItem = items.length;
            items.push(new food(id, false, undefined, 0, foods[id].mass, foods[id].volume));
            addMoney(-p, foods[id].name);
        }
    } else {
        alert("Your table is full!");
    }
    toggleFoodList(true);
}

function reload() {
    updateSettings();
    let debugImgOutput = "";
    for (const f in foods) debugImgOutput += `<img alt="${f}" src='img/food/${f}.png' onload="if (foods['${f}'] === undefined) foods.${f} = {}; foods.${f}.imgAvailable = true;">`;
    for (const f of debug.otherFoodTextures) debugImgOutput += `<img alt="${f}" src='img/food/${f}.png' onload="if (foods['${f}'] === undefined) foods.${f} = {}; foods.${f}.imgAvailable = true;">`;
    document.getElementById("debugCheckImg").innerHTML = debugImgOutput;
    let foodList = `<img alt='Back' class='backBtn' onmousedown='if (debug.foodListLocation !== "none") showGroup("none"); else toggleFoodList();' src='img/back.png'><div id='foodGroupList'>`;
    debug.groups = {};
    for (const i in foods) {
        if (debug.groups[foods[i].group] === undefined && !foods[i].unavailable) debug.groups[foods[i].group] = [];
        let exists = false;
        for (const g of debug.groups[foods[i].group]) if (g.id === foods[i].id) exists = true;
        if (!foods[i].unavailable && !exists) debug.groups[foods[i].group].push({name: foods[i].name, id: i});
    }

    const groupList = Object.keys(debug.groups);
    groupList.sort();

    for (const g of groupList) foodList += `<h2 onmousedown="showGroup('${g}')" class="foodListItem">${g}</h2>`;
    foodList += "</div>";

    for (const j of groupList) {
        foodList += `<div id="foodGroup_${j}"><h2 onmousedown="showGroup('none');" class="foodListItem">${j}</h2>`;
        for (let i of debug.groups[j]) {
            i = i.id;
            foodList += `<p class="foodListItem" title="${foods[i].name}" onmousedown="buy('${i}');">${foods[i].name}${foods[i].mass !== undefined ? ` | ${format("mass", foods[i].mass)}` : ""}${foods[i].volume !== undefined ? ` | ${format("volume", foods[i].volume)}` : ""} | ${foods[i].price !== undefined ? "$" + format("money", foods[i].price) : "$5.00"}</p>`;
        }
        foodList += `</div>`;
    }
    document.getElementById("foodList").innerHTML = foodList;
    showGroup("none");
}

function showGroup(g) {
    debug.foodListLocation = g;
    document.getElementById("foodGroupList").style.display = g === "none" ? "" : "none";
    for (const i in debug.groups) {
        document.getElementById(`foodGroup_${i}`).style.display = i === g ? "" : "none";
    }
}

function save() {
    localStorage.setItem("savedItems", JSON.stringify(items));
    localStorage.setItem("savedPlayer", JSON.stringify(player));
    localStorage.setItem("savedSettings", JSON.stringify(settings));
}

function load() {
    items = JSON.parse(localStorage.getItem("savedItems"));
    player = JSON.parse(localStorage.getItem("savedPlayer"));
    settings = JSON.parse(localStorage.getItem("savedSettings"));
    for (const g in items) {
        items[g] = new food(items[g]);
    }
    document.getElementById("recentTransactions").innerHTML = player.recentTransactions.join("");
}

class food {
    constructor(id, isCustom, cookSpeed, cooked, mass, volume, temp, name, liquids) {
        if (typeof id !== "object") {
            this.id = id;
            this.custom = isCustom !== undefined ? isCustom : false;
            this.name = this.custom ? name : foods[this.id].name;
            this.location = "counter";
            this.temp = temp !== undefined ? temp : settings.roomTemp;
            this.cooked = cooked !== undefined ? cooked : 0;
            this.dateOfCreation = Date.now() / 1000;
            this.mass = mass;
            this.volume = volume;
            this.cookSpeed = cookSpeed;
            this.liquids = liquids !== undefined ? liquids : [];
            if (!this.custom) this.group = foods[id].group;
            if (!this.custom) this.cookSpeed = foods[id].cookSpeed !== undefined ? foods[id].cookSpeed : 1;
        } else {
            for (const g in id.liquids) id.liquids[g] = new food(id.liquids[g]);
            for (const g in id) this[g] = id[g];
        }
        setInterval(() => {
            this.age = (Date.now() / 1000 - this.dateOfCreation) * settings.foodRottingSpeed;
            this.temp = (this.temp - settings.roomTemp) * 0.9999 + settings.roomTemp;
            if (this.temp < -459) {
                this.temp = -459;
            } else if (this.temp > 212) {
                for (const l in this.liquids) {
                    this.liquids[l].volume /= 1 + (this.temp - 212) / 500000;
                    if (this.liquids[l].volume < 0.001) {
                        this.liquids.splice(Number(l), 1);
                    }
                }
            }
            this.cooked += (this.temp - settings.minCookingTemperature > 0 ? (this.temp - settings.minCookingTemperature) / (3000 / this.cookSpeed) : 0) * settings.cookSpeed;
            if (this.mass < 0.001 && this.mass > 0) this.gone = true;
            if (this.volume < 0.001 && this.volume > 0) this.gone = true;
        }, 20);
    }

    format() {
        let output = "";
        if (this.temp < 1500) {
            this.hue = 0;
            this.saturation = "0%";
            this.value = "0%";
        }
        if (this.temp >= 2.556e32) {
            if (this.mass !== undefined) this.mass /= 1.1;
            if (this.volume !== undefined) this.volume /= 1.1;
            output += "bye bye :)";
        } else if (this.temp >= 25000) {
            this.hue = 210;
            this.saturation = "50%";
            this.value = "50%";
            output += "Glowing Blue" + "+".repeat(Math.log10(this.temp) / 5.6 - 0.785);
        } else if (this.temp >= 10000) {
            this.hue = 210;
            this.saturation = `${this.temp / 300 - 10000 / 300}%`;
            this.value = "50%";
            output += "Glowing White" + "+".repeat(this.temp / 3000 - 10 / 3);
        } else if (this.temp >= 7500) {
            this.hue = 60;
            this.saturation = `100%`;
            this.value = `${100 - (400 - this.temp / 25) / 2}%`;
            output += "Glowing Yellow" + "+".repeat(this.temp / 500 - 15);
        } else if (this.temp >= 5000) {
            this.hue = this.temp / (2500 / 30) - 30;
            this.saturation = "100%";
            this.value = "50%";
            output += "Glowing Orange" + "+".repeat(this.temp / 500 - 10);
        } else if (this.temp >= 2000) {
            this.hue = this.temp / 100 - 20;
            this.saturation = "100%";
            this.value = "50%";
            output += "Glowing Red" + "+".repeat(this.temp / 600 - 20 / 6);
        } else if (this.temp >= 1500) {
            this.hue = 0;
            this.saturation = "100%";
            this.value = `${(this.temp / 5 - 300) / 2}%`;
            output += "Faint Red" + "+".repeat(this.temp / 100 - 15);
        } else if (this.cooked >= 500) {
            output += "Charcoal";
        } else if (this.cooked >= 200) {
            output += "Burnt" + "+".repeat(this.cooked / 60 - 20 / 6);
        } else if (this.cooked >= 150) {
            output += "Overcooked" + "+".repeat(this.cooked / 10 - 15);
        } else if (this.cooked >= 110) {
            output += "Slightly Overcooked" + "+".repeat(this.cooked / 8 - 13.75);
        } else if (this.cooked >= 90) {
            output += "Perfectly Cooked" + "+".repeat(this.cooked / 4 - 22.5);
        } else if (this.cooked >= 80) {
            output += "Slightly Undercooked" + "+".repeat(this.cooked / 2 - 40);
        } else if (this.cooked >= 30) {
            output += "Undercooked" + "+".repeat(this.cooked / 10 - 3);
        } else {
            output += "Uncooked" + "+".repeat(this.cooked / 6 >= 0 ? this.cooked / 6 : 0);
        }
        if (this.age > 86400) {
            let decompositionSpeed = (this.age - 7200) / 100000 + 1;
            output += " | Decomposing";
            if (this.mass !== undefined) this.mass /= decompositionSpeed;
            if (this.volume !== undefined) this.volume /= decompositionSpeed;
        } else if (this.age > 43200) {
            output += " | Rotten";
        } else if (this.age > 21600) {
            output += " | Old";
        } else if (this.age > 10800) {
            output += " | Expired";
        } else if (this.age > 5400) {
            output += " | Nearly Expired";
        } else if (this.age > 2700) {
            output += " | Aged";
        }
        return output;
    }

    serve() {
        this.gone = true;
        let temperatureAlert;
        if (this.temp > 10000) {
            temperatureAlert = `Customer died from looking at the food because of its insane temperature of ${this.temp.toFixed(0)}°F.`;
        } else if (this.temp > 2000) {
            temperatureAlert = `Customer died from touching the food because you heated it to ${this.temp.toFixed(0)}°F.`;
        } else if (this.temp > 1000) {
            temperatureAlert = `Customer died from eating the food because it was ${this.temp.toFixed(0)}°F.`;
        } else if (this.temp > 400) {
            temperatureAlert = `Customer was burned from touching the food because it was ${this.temp.toFixed(0)}°F.`;
        } else if (this.temp > -300) {
            temperatureAlert = "";
        } else {
            temperatureAlert = `Customer was frozen to death because it was ${this.temp.toFixed(0)}°F.`;
        }
        alert(`${this.custom ? this.id : foods[this.id].name} served! ${temperatureAlert}`);
    }

    grind() {
        if (foods[this.id] !== undefined && foods[this.id].grind !== undefined) {
            this.gone = true;
            items.push(new food(foods[this.id].grind.id, false, this.cookSpeed, this.cooked, foods[this.id].grind.mass, undefined, this.temp));
        } else {
            this.gone = true;
            items.push(new food("unknownPowder", true, this.cookSpeed, this.cooked, this.mass, undefined, this.temp, `Ground ${this.name}`));
        }

        debug.animations.mortar();
    }

    cut(size) {
        if (items[debug.selectedItem].mass > size) {
            items[debug.selectedItem].mass -= size;
            items.push(new food(items[debug.selectedItem].id, false, items[debug.selectedItem].cookSpeed, items[debug.selectedItem].cooked, size, undefined, items[debug.selectedItem].temp, items[debug.selectedItem].name));
        } else if (items[debug.selectedItem].mass !== undefined) {
            alert(`This is too small to cut ${format("mass", size)} off!`);
        } else {
            alert(`You can't cut a liquid!`);
        }
    }

    addLiquid(liquid) {
        console.log(liquid);
        for (const l of this.liquids) {
            if (liquid.liquids.sort().join() === l.liquids.sort().join() && liquid.id === l.id) {
                l.volume += liquid.volume;
                return;
            }
        }
        this.liquids.push(liquid);
    }
}

function format(type, value) {
    if (type === "mass") {
        if (settings.units === "metric") {
            if (Math.abs(value) >= 1000) {
                return `${toNumberName(value / 1000, true, 2)} kg`;
            } else if (Math.abs(value) >= 1) {
                return `${~~(value * 100) / 100} g`;
            } else {
                return `${~~(value * 100000) / 100} mg`;
            }
        } else if (settings.units === "imperial") {
            if (Math.abs(value) >= 4.41e6) {
                return `${toNumberName(value / 4.41e6, true, 2)} t`;
            } else if (Math.abs(value) >= 2205) {
                return `${toNumberName(value / 2205, true, 2)} lb`;
            } else if (Math.abs(value) >= 1.378125) {
                return `${(value / 137.8125).toFixed(2)} oz`;
            } else {
                return `${format("number", value / 137.8125)} oz`;
            }
        }
    } else if (type === "volume") {
        if (settings.units === "metric") {
            if (Math.abs(value) >= 1000) {
                return `${(value / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})} L`;
            } else if (Math.abs(value) >= 1) {
                return `${~~(value * 100) / 100} mL`;
            } else {
                return `${~~(value * 100000) / 100} μL`;
            }
        } else if (settings.units === "imperial") {
            value *= 0.033814;
            if (Math.abs(value) >= 128) {
                return `${toNumberName(value / 128, true, 2)} gal`;
            } else if (Math.abs(value) >= 32) {
                return `${toNumberName(value / 32, true, 2)} qt`;
            } else if (Math.abs(value) >= 8) {
                return `${toNumberName(value / 8, true, 2)} cups`;
            } else if (Math.abs(value) >= 0.01) {
                return `${toNumberName(value, true, 2)} fl. oz`;
            } else {
                return `${format("number", value)} fl. oz`;
            }
        }
    } else if (type === "number") {
        if (Math.abs(value) === Infinity) {
            return value.toLocaleString();
        } else if (Math.abs(value) >= 1e10) {
            return `${(value / 10 ** ~~Math.log10(value)).toFixed(2)} * 10<sup>${~~Math.log10(value)}</sup>`;
        } else if (Math.abs(value) >= 0.5) {
            return Math.round(value).toLocaleString();
        } else if (Math.abs(value) > 0) {
            return `1/${format("number", 1 / value)}`;
        } else if (!isNaN(value)) {
            return "0";
        } else {
            return "Not a Number";
        }
    } else if (type === "time") {
        if (Math.abs(value) === Infinity) {
            return "Forever";
        } else if (Math.abs(value) >= 2 ** 53) {
            return `${format("number", value / 31536000)}y`;
        } else if (Math.abs(value) >= 31536000) {
            return `${Math.floor(value / 31536000).toLocaleString()}y ${format("time", value % 31536000)}`;
        } else if (Math.abs(value) >= 86400) {
            return `${Math.floor(value / 86400)}d ${format("time", value % 86400)}`;
        } else if (Math.abs(value) >= 3600) {
            return `${Math.floor(value / 3600)}h ${format("time", value % 3600)}`;
        } else if (Math.abs(value) >= 60) {
            return `${Math.floor(value / 60)}m ${format("time", value % 60)}`;
        } else if (Math.abs(value) >= 1) {
            return `${Math.floor(value)}s`;
        } else {
            return "";
        }
    } else if (type === "money") {
        if (Math.abs(value) === Infinity) {
            return "Infinity";
        } else {
            return toNumberName(value, true, 2);
        }
    }
}

function showTooltip(title, text, x, y, shift) {
    document.getElementById("tooltip").innerHTML = `<p style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis;"><b>${title}</b></p><p>${text}</p><p class="tooltipHoldShift" style="display: none;">${shift}</p>`;
    if (!settings.tooltipsEnabled) return;
    if (x === undefined) x = debug.mouseX / debug.zoom;
    if (y === undefined) y = debug.mouseY / debug.zoom;
    if (x + 256 > window.innerWidth / debug.zoom) x = window.innerWidth / debug.zoom - document.getElementById("tooltip").clientWidth;
    if (y + 192 > window.innerHeight / debug.zoom) y = window.innerHeight / debug.zoom - document.getElementById("tooltip").clientHeight;
    document.getElementById("tooltip").style.display = "";
    document.getElementById("tooltip").style.left = `${x}px`;
    document.getElementById("tooltip").style.top = `${y}px`;
}

function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
}

function addMoney(amount, cause, operation) {
    const opposites = {"+": "-", "-": "+", "*": "/", "/": "*"};
    if (operation === undefined) operation = "+";
    if (operation === "+") {
        player.money += amount;
    } else if (operation === "-") {
        player.money -= amount;
    } else if (operation === "*") {
        player.money *= amount;
    } else if (operation === "/") {
        player.money /= amount;
    }

    function positive(n) {
        if (operation === "+" || operation === "-") {
            return Math.abs(n);
        } else {
            return Math.abs(n) < 1 ? 1 / n : n;
        }
    }

    player.recentTransactions.unshift(`<p style="color: ${amount > 0 ? "green" : amount < 0 ? "red" : "white"};">${cause} | ${amount > 0 ? operation : amount < 0 ? opposites[operation] : ""}$${format("money", positive(amount))}</p>`);
    while (player.recentTransactions.length > 10) {
        player.recentTransactions.pop();
    }
    document.getElementById("recentTransactions").innerHTML = player.recentTransactions.join("");
}

setInterval(() => {
    for (const g of document.getElementsByClassName("tooltipHoldShift")) g.style.display = debug.holdingShift ? "" : "none";
}, 20);

setInterval(() => {
    debug.ingredients = [];
    debug.zoom = window.innerWidth < 439 ? 0.25 : window.innerWidth < 878 ? 0.5 : 1;
    let output = "";
    let output2 = "";
    debug.locations = {
        counter: 0,
        oven: 0,
        fridge: 0,
        sun: 0,
        freezer: 0,
        particleAccelerator: 0,
        particleDecelerator: 0
    };
    for (const i in items) {
        if (debug.locations[items[i].location] === undefined) debug.locations[items[i].location] = 0;
        debug.locations[items[i].location]++;
        let left = 0,
            top = 0,
            width = 32,
            height = 32,
            rotation = 0,
            selected = false,
            visible = true;

        if (items[i].location === "counter" || items[i].location === "recipeMaker") {
            top = window.innerHeight / debug.zoom / 2 - 80 + 16 * ~~((debug.locations[items[i].location] - 1) / 5);
            left = window.innerWidth / debug.zoom / 2 - 80 + 32 * ((debug.locations[items[i].location] - 1) % 5);
        }
        if (items[i].location === "oven") {
            top = window.innerHeight / debug.zoom - 56;
            left = window.innerWidth / debug.zoom - 112 + 32 * ((debug.locations[items[i].location] - 1) % 5);
            items[i].temp = (items[i].temp - 650) * 0.9995 + 650;
        }
        if (items[i].location === "fridge") {
            top = window.innerHeight / debug.zoom - 80 + 32 * ~~((debug.locations[items[i].location] - 1) / 2);
            left = 32 + 32 * ((debug.locations[items[i].location] - 1) % 2);
            items[i].temp = (items[i].temp - 35) * 0.995 + 35;
        }
        if (items[i].location === "sun") {
            top = 160 + 32 * ~~((debug.locations[items[i].location] - 1) / 2);
            left = window.innerWidth / debug.zoom - 96 + 32 * ((debug.locations[items[i].location] - 1) % 2);
            items[i].temp = (items[i].temp - 15000) * 0.9995 + 15000;
        }
        if (items[i].location === "freezer") {
            top = window.innerHeight / debug.zoom - 56 - 32 * ~~((debug.locations[items[i].location] - 1) / 2);
            left = window.innerWidth / debug.zoom - 224 + 32 * ((debug.locations[items[i].location] - 1) % 2);
            items[i].temp = (items[i].temp + 460) * 0.995 - 460;
        }
        if (items[i].location === "particleAccelerator") {
            top = window.innerHeight / debug.zoom - 56;
            left = window.innerWidth / debug.zoom - 368;
            items[i].temp = (items[i].temp + 460) ** 1.01 - 460;
        }
        if (items[i].location === "particleDecelerator") {
            top = window.innerHeight / debug.zoom - 56;
            left = window.innerWidth / debug.zoom - 496;
            items[i].temp = (items[i].temp + 460) / 1.1 - 460;
        }

        if (debug.location !== "kitchen") visible = false;

        if (items[i].location === "recipeMaker") {
            visible = debug.location !== "kitchen";
            top += 32;
            let exists = false;

            function loop() {
                for (const k of debug.ingredients) {
                    if (k.id === items[i].id) {
                        exists = true;
                        if (k.mass1 === undefined) k.mass1 = 0;
                        if (k.volume1 === undefined) k.volume1 = 0;
                        if (!items[i].addedProperties) {
                            k.mass1 += items[i].mass !== undefined ? Number(items[i].mass) : 0;
                            k.volume1 += items[i].volume !== undefined ? Number(items[i].volume) : 0;
                        }
                        items[i].addedProperties = true;
                    }
                }
            }

            loop();

            if (!exists) {
                debug.ingredients.push(items[i]);
                loop();
            }
        }

        if (Number(i) === debug.selectedItem) {
            visible = true;
            items[i].location = "counter";
            selected = true;
            left = debug.mouseX / debug.zoom - width / 2;
            top = debug.mouseY / debug.zoom - height / 2;
        }

        const h = items[i].hue;
        const s = items[i].saturation;
        const v = items[i].value;
        let tempColor = `hsl(${h}, ${s}, ${v})`;

        const elem = document.createElement("div");
        elem.className = "food";
        elem.id = `foodIndex${i}`;
        let t = items[i].temp;
        let liquids = "";
        for (const l of items[i].liquids) {
            liquids += `<p>${l.name} | ${format("volume", l.volume)}</p>`;
        }
        if (settings.units === "metric") t = (items[i].temp - 32) / 1.8;
        elem.setAttribute("onmousedown", `if (items[debug.selectedItem] !== undefined && items[debug.selectedItem].volume !== undefined) {items[debug.selectedItem].gone = true; items[${i}].addLiquid(items[debug.selectedItem]);} else debug.selectedItem = debug.selectedItem !== ${i} ? ${i} : -1;`);
        elem.setAttribute("onmouseover", `showTooltip(items[${i}].name, \`<p>${format("number", t)}°${settings.units === "metric" ? "C" : settings.units === "imperial" ? "F" : ""}</p><p>${format("number", items[i].cooked)}% Cooked</p><p>${items[i].group !== "liquid" ? items[i].format() : ""}</p>${items[i].mass !== undefined && items[i].mass !== 0 ? `<p>${format("mass", items[i].mass)}</p>` : ''}${items[i].volume !== undefined && items[i].volume !== 0 ? `<p>${format("volume", items[i].volume)}</p>` : ''}<p>Age: ${format("time", items[i].age)}</p><div style="background: #00000080; width: fit-content;">${liquids}</div>\`);`);
        elem.setAttribute("onmouseout", "hideTooltip();");

        elem.append(document.createElement("img"));
        if (foods[items[i].id] === undefined) foods[items[i].id] = {imgAvailable: false};
        elem.children[0].style = `${visible ? "" : "display: none; "}position: absolute; left: ${left}px; top: ${top}px; filter: brightness(${100 - items[i].cooked / 2}%) drop-shadow(0 0 8px ${tempColor}); transform: rotate(${rotation}deg); ${debug.selectedItem === Number(i) ? "pointer-events: none" : ""};`;
        elem.children[0].src = `img/food/${foods[items[i].id].imgAvailable ? items[i].id : "unknown"}.png`;
        elem.children[0].height = height;
        elem.children[0].width = width;
        elem.children[0].alt = items[i].id;

        output += elem.outerHTML;

        document.getElementById("oven").src = debug.locations.oven > 0 ? "img/oven-on.png" : "img/oven.png";
        document.getElementById("oven").style.pointerEvents = debug.selectedItem > -1 ? "" : "none";
        document.getElementById("fridge").src = debug.locations.fridge > 0 ? "img/fridge-open.png" : "img/fridge.png";
        document.getElementById("freezer").style.pointerEvents = debug.selectedItem > -1 ? "" : "none";
        document.getElementById("accelerator").src = debug.locations.particleAccelerator > 0 ? "img/accelerator.png" : "img/accelerator-inactive.png";
        document.getElementById("decelerator").src = debug.locations.particleDecelerator > 0 ? "img/decelerator.png" : "img/decelerator-inactive.png";

        if (items[i].gone) {
            items.splice(Number(i), 1);
        }
    }

    const index = items.indexOf(undefined);
    if (index > -1) items.splice(index, 1);
    document.getElementById("items").innerHTML = `${output}`;
    document.getElementById("money").innerHTML = `Money: $${format("money", player.money)}`;
    document.getElementById("recipeMaker").innerHTML = `<legend>Plate</legend>${output2 !== "" ? `<button onmousedown="makeRecipe(debug.ingredients); for (const x in debug.ingredients) debug.ingredients[x].gone = true;">Create Food</button>` : ""}${output2}`;
}, 50);

reload();

document.onmousemove = e => {
    debug.mouseX = e.clientX;
    debug.mouseY = e.clientY;
}

document.onmousedown = () => {
    debug.editingSettings = false;
}

document.onkeydown = e => {
    if (debug.editingSettings) return;
    const locations = [
        "kitchen",
        "serve",
        "bank",
        "config"
    ];
    if (e.key === "Shift") {
        debug.holdingShift = true;
    } else if (e.key === "ArrowRight") {
        if (debug.location === "kitchen") {
            debug.location = "serve";
        } else if (debug.location === "config") {
            debug.location = "kitchen";
        }
    } else if (e.key === "ArrowLeft") {
        if (debug.location === "serve") {
            debug.location = "kitchen";
        } else if (debug.location === "kitchen") {
            debug.location = "config";
        }
    } else if (e.key === "ArrowDown") {
        if (debug.location === "kitchen") {
            debug.location = "bank";
        }
    } else if (e.key === "ArrowUp") {
        if (debug.location === "bank") {
            debug.location = "kitchen";
        }
    }
    for (const l of locations) {
        if (debug.location !== l) {
            document.getElementById(l).style.display = "none";
        } else {
            document.getElementById(l).style.display = "";
        }
    }
}

document.getElementById("autoCutter").onwheel = e => {
    const d = Number(document.getElementById("autoCutter").getAttribute("data-size"));
    let a = 1;
    if (d >= 10000) {
        a = 10 ** ~~Math.log10(d / 10);
    } else if (d >= 2500) {
        a = 25;
    } else if (d >= 1000) {
        a = 10;
    } else if (d >= 500) {
        a = 5;
    } else if (d >= 100) {
        a = 2;
    } else if (d < 0.5) {
        a = 0.001;
    } else if (d < 1) {
        a = 0.01;
    } else if (d < 5) {
        a = 0.1;
    } else if (d < 10) {
        a = 0.5;
    }

    const b = Math.round((d + (e.deltaY > 0 ? -a : a)) / a) * a;

    document.getElementById("autoCutter").setAttribute("data-size", String(b > 0 ? b : 0));
    document.getElementById("autoCutterSize").innerText = format("mass", Number(document.getElementById("autoCutter").getAttribute("data-size")));
}

document.onkeyup = () => {
    debug.holdingShift = false;
}

// THIS IS TEMPORARY

function pay() {
    addMoney(Math.random() * settings.maxPaycheckValue, "Paycheck", "+");
    setTimeout(pay, settings.paycheckTime * 1000);
}

pay();