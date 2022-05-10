if (localStorage.getItem("savedItems") !== null)
    document.getElementById("loadGameBtn").style.display = "";

(() => {
    const a = randomFood();
    document.getElementById("icon").href = `img/food/${a}.png`;
})();

for (const s in settings) {
    document.getElementById(s).setAttribute("onchange", `settings['${s}'] = this.type === "checkbox" ? this.checked : this.value; if ("${document.getElementById(s).type}" === "number") settings['${s}'] = Number(settings['${s}']); reload(true);`);
}

for (const i in animations) {
    setInterval(() => {
        if (animations[i].currentFrame === undefined) animations[i].currentFrame = 0;
        document.getElementById(i).src = animations[i].img[animations[i].currentFrame];
        animations[i].currentFrame++;
        if (animations[i].currentFrame >= animations[i].img.length) animations[i].currentFrame = 0;
    }, 1000 / animations[i].fps);
}

function updateSettings(clear) {
    if (clear === undefined) clear = true;
    if (clear) clearTimeout(debug.paycheckInterval);
    for (const s in settings) {
        document.getElementById(s).value = settings[s];
        if (document.getElementById(s).type === "checkbox") document.getElementById(s).checked = settings[s];
    }
    document.getElementById("settings").value = JSON.stringify(settings, null, 2);
    /* foods = settings.foods;
    settings.foods = foods; */
    document.body.style.background = settings.background;
    document.body.style.color = settings.textColor;
    if (clear) pay();
    document.getElementById("sandboxSettings").style.display = settings.sandboxMode ? "" : "none";
}

function randomFood(includeLiquids) {
    if (includeLiquids === undefined) includeLiquids = true;
    let a = Object.keys(foods)[~~(Math.random() * Object.keys(foods).length)];
    while (debug.otherFoodTextures.includes(a) || /Money|Cleaning/.test(foods[a].group) || !includeLiquids && foods[a].volume !== undefined && !/humanMeat|gusAshes/.test(a))
        a = Object.keys(foods)[~~(Math.random() * Object.keys(foods).length)];
    return a;
}

function makeRecipe(ingredients) {
    if (!settings.canMakeRecipes) {
        showAlert("Making recipes is disabled");
        return;
    }
    let ingredients2 = [];
    let name = "";
    let cookSpeed = 0;
    let cooked = 0;
    let mass = 0;
    let volume = 0;
    let temp = 0;
    let poisoned = false;
    for (const i in ingredients) {
        if (ingredients[i].poisoned) poisoned = true;
        ingredients2[i] = {};
        ingredients2[i].id = ingredients[i].id;
        ingredients2[i].mass = ingredients[i].mass1;
        ingredients[i].count1 = ingredients[i].count;
        ingredients[i].cooked1 = ingredients[i].cooked2;
        console.log(ingredients[i]);
        cookSpeed += ingredients[i].cookSpeed;
        cooked += ingredients[i].cooked1 / ingredients[i].count1;
        mass += ingredients[i].mass1;
        volume += ingredients[i].volume;
        temp += ingredients[i].temp1 / ingredients[i].count1;

        name += `${capitalize(toCount(ingredients[i].count))}${ingredients[i].name} `;
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

    /* for (const r of recipes) {
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
    } */

    name += "Meal";

    if (ingredients.length > 0 && confirm("You made a new food! Would you like to name it?")) {
        const p = prompt("What do you want to name your food?");
        if (p !== "") name = p;
    }

    console.log(ingredients);
    console.log(ingredients2);
    items.push(new food({
        id: ingredients.length > 0 ? "custom" : "empty",
        custom: true,
        cookSpeed: cookSpeed,
        cooked: ingredients.length > 0 ? cooked : 0,
        mass: mass,
        temp: ingredients.length > 0 ? temp : 72,
        name: ingredients.length > 0 ? name : "Empty Plate",
        ingredients: ingredients,
        poisoned: poisoned
    }, true));
    sendUpdate();
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
    const p = (foods[id].price !== undefined ? foods[id].price : 5) * (debug.groups.Money.map(g => g.id).includes(id) ? 1 : modifiers.foodPrice);
    if (debug.locations["counter"] < 20) {
        if (player.money >= p && !(foods[id].count <= 0)) {
            foods[id].bought++;
            if (foods[id].count !== undefined) foods[id].count--;
            debug.selectedItem = items.length;
            items.push(new food(id, false, undefined, 0, foods[id].mass, foods[id].volume));
            addMoney(-p, foods[id].name);
            sendUpdate();
        }
    } else {
        showAlert("Your table is full!");
    }
    toggleFoodList(true);
}

function reload(onlyFoodList) {
    if (onlyFoodList === undefined) onlyFoodList = false;
    updateSettings(false);
    if (!onlyFoodList) {
        updateUpgradeDiv();
        let debugImgOutput = "";
        for (const f of debug.otherFoodTextures)
            debugImgOutput += `<img alt="${f}" src='img/food/${f}.png' onload="if (foods['${f}'] === undefined) foods.${f} = {}; foods.${f}.imgAvailable = true;">`;
        for (const f in foods)
            debugImgOutput += `<img alt="${f}" src='img/food/${f}.png' onload="if (foods['${f}'] === undefined) foods.${f} = {}; foods.${f}.imgAvailable = true;">`;
        document.getElementById("debugCheckImg").innerHTML = debugImgOutput;
    }
    createFoodList();
}

function createFoodList() {
    // noinspection HtmlUnknownTarget
    let foodList = `<img alt='Back' class='backBtn' onmousedown='if (debug.foodListLocation !== "none") showGroup("none"); else toggleFoodList();' src='img/back.png'><div id='foodGroupList'>`;
    debug.groups = {};
    for (const i in foods) {
        if (foods[i].bought === undefined) foods[i].bought = 0;
        if (foods[i].condition === undefined) foods[i].condition = `player.money >= foods["${i}"].price`;
        if (foods[i].condition !== undefined) foods[i].unavailable = !eval(foods[i].condition);
        if (debug.groups[foods[i].group] === undefined && !foods[i].unavailable) debug.groups[foods[i].group] = [];
        let exists = false;
        if (!foods[i].unavailable)
            for (const g of debug.groups[foods[i].group])
                if (g.id === foods[i].id)
                    exists = true;
        if (!foods[i].unavailable && !exists) debug.groups[foods[i].group].push({name: foods[i].name, id: i});
    }

    delete debug.groups.undefined;

    const groupList = Object.keys(debug.groups);
    groupList.sort();

    for (const g of groupList)
        foodList += `<h2 onmousedown="showGroup('${g}')" class="foodListItem">${g}</h2>`;
    foodList += "</div>";

    for (const j of groupList) {
        foodList += `<div id="foodGroup_${j}"><h2 onmousedown="showGroup('none');" class="foodListItem">${j}</h2>`;
        for (let i of debug.groups[j]) {
            i = i.id;
            if (foods[i].count === 0) {
                foods[i].unavailable = true;
            } else if (foods[i].count > 0) {
                foods[i].unavailable = false;
            }

            foodList += `<p class="foodListItem" title="${foods[i].name}" onmousedown="buy('${i}');">${foods[i].name}${foods[i].mass !== undefined ? ` | ${format("mass", foods[i].mass)}` : ""}${foods[i].volume !== undefined ? ` | ${format("volume", foods[i].volume)}` : ""}${foods[i].price !== 0 ? ` | ${format("money", (foods[i].price !== undefined ? foods[i].price : 5) * (j !== "Money" ? modifiers.foodPrice : 1))}` : ""}${(foods[i].count === undefined ? "" : ` | ${format("number", foods[i].count)} Remaining`)}</p>`;
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
    localStorage.setItem("savedGame", JSON.stringify(game));
    localStorage.setItem("savedSettings", JSON.stringify(settings));
    localStorage.setItem("savedOrders", JSON.stringify(orders));
    localStorage.setItem("savedUpgrades", JSON.stringify(upgrades));
    localStorage.setItem("savedModifiers", JSON.stringify(modifiers));
    localStorage.setItem("otherSaved", JSON.stringify(otherSaved));
    localStorage.setItem("foods", JSON.stringify(foods));
}

function load() {
    items = JSON.parse(localStorage.getItem("savedItems"));
    player = JSON.parse(localStorage.getItem("savedPlayer"));
    game = JSON.parse(localStorage.getItem("savedGame"));
    settings = JSON.parse(localStorage.getItem("savedSettings"));
    orders = JSON.parse(localStorage.getItem("savedOrders"));
    upgrades = JSON.parse(localStorage.getItem("savedUpgrades"));
    let foods1 = JSON.parse(localStorage.getItem("foods"));
    const modifiers1 = JSON.parse(localStorage.getItem("savedModifiers"));
    const otherSaved1 = JSON.parse(localStorage.getItem("otherSaved"));
    for (const m in modifiers1) modifiers[m] = modifiers1[m];
    for (const m in otherSaved1) otherSaved[m] = otherSaved1[m];
    if (otherSaved.unlockedAlerts) document.getElementById("alert").style.display = "";
    updateUpgradeDiv();
    for (const g in items) items[g] = new food(items[g], true);
    for (const g in foods1) {
        foods[g].count = foods1[g].count;
        foods[g].bought = foods1[g].bought;
    }
    document.getElementById("recentTransactions").innerHTML = player.recentTransactions.join("");
}

function toBills(n) {
    let output = [];
    if (n >= Infinity) {
        // noinspection SpellCheckingInspection
        output.push("infinitibuck");
        n = 0;
    }
    for (let i = 307; i > 33; i--) {
        while (n >= 10 ** i) {
            output.push(`e${i}`);
            n -= 10 ** i;
        }
    }
    while (n >= 1e33) {
        output.push("decillion");
        n -= 1e33;
    }
    while (n >= 1e32) {
        output.push("hundredNonillion");
        n -= 1e32;
    }
    while (n >= 1e31) {
        output.push("tenNonillion");
        n -= 1e31;
    }
    while (n >= 1e30) {
        output.push("nonillion");
        n -= 1e30;
    }
    while (n >= 1e29) {
        output.push("hundredOctillion");
        n -= 1e29;
    }
    while (n >= 1e28) {
        output.push("tenOctillion");
        n -= 1e28;
    }
    while (n >= 1e27) {
        output.push("octillion");
        n -= 1e27;
    }
    while (n >= 1e26) {
        output.push("hundredSeptillion");
        n -= 1e26;
    }
    while (n >= 1e25) {
        output.push("tenSeptillion");
        n -= 1e25;
    }
    while (n >= 1e24) {
        output.push("septillion");
        n -= 1e24;
    }
    while (n >= 1e23) {
        output.push("hundredSextillion");
        n -= 1e23;
    }
    while (n >= 1e22) {
        output.push("tenSextillion");
        n -= 1e22;
    }
    while (n >= 1e21) {
        output.push("sextillion");
        n -= 1e21;
    }
    while (n >= 1e20) {
        output.push("hundredQuintillion");
        n -= 1e20;
    }
    while (n >= 1e19) {
        output.push("tenQuintillion");
        n -= 1e19;
    }
    while (n >= 1e18) {
        output.push("quintillion");
        n -= 1e18;
    }
    while (n >= 1e17) {
        output.push("hundredQuadrillion");
        n -= 1e17;
    }
    while (n >= 1e16) {
        output.push("tenQuadrillion");
        n -= 1e16;
    }
    while (n >= 1e15) {
        output.push("quadrillion");
        n -= 1e15;
    }
    while (n >= 1e14) {
        output.push("hundredTrillion");
        n -= 1e14;
    }
    while (n >= 1e13) {
        output.push("tenTrillion");
        n -= 1e13;
    }
    while (n >= 1e12) {
        output.push("trillion");
        n -= 1e12;
    }
    while (n >= 1e11) {
        output.push("hundredBillion");
        n -= 1e11;
    }
    while (n >= 1e10) {
        output.push("tenBillion");
        n -= 1e10;
    }
    while (n >= 1e9) {
        output.push("billion");
        n -= 1e9;
    }
    while (n >= 1e8) {
        output.push("hundredMillion");
        n -= 1e8;
    }
    while (n >= 1e7) {
        output.push("tenMillion");
        n -= 1e7;
    }
    while (n >= 1e6) {
        output.push("million");
        n -= 1e6;
    }
    while (n >= 100000) {
        output.push("hundredThousand");
        n -= 100000;
    }
    while (n >= 10000) {
        output.push("tenThousand");
        n -= 10000;
    }
    while (n >= 1000) {
        output.push("thousand");
        n -= 1000;
    }
    while (n >= 500) {
        output.push("fiveHundred");
        n -= 500;
    }
    while (n >= 100) {
        output.push("hundred");
        n -= 100;
    }
    while (n >= 50) {
        output.push("fifty");
        n -= 50;
    }
    while (n >= 20) {
        output.push("twenty");
        n -= 20;
    }
    while (n >= 10) {
        output.push("ten");
        n -= 10;
    }
    while (n >= 5) {
        output.push("five");
        n -= 5;
    }
    while (n >= 2) {
        output.push("two");
        n -= 2;
    }
    while (n >= 1) {
        output.push("one");
        n--;
    }
    while (n >= 0.5) {
        output.push("fiftyCents");
        n -= 0.5;
    }
    while (n >= 0.25) {
        output.push("quarter");
        n -= 0.25;
    }
    while (n >= 0.1) {
        output.push("dime");
        n -= 0.1;
    }
    while (n >= 0.05) {
        output.push("nickel");
        n -= 0.05;
    }
    while (n >= 0.01) {
        output.push("penny");
        n -= 0.01;
    }
    return output;
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
        } else if (Math.abs(value) >= 1) {
            return Math.round(value).toLocaleString();
        } else if (Math.abs(value) > 0) {
            const a = 10 ** ~~(Math.log10(Math.abs(value)) - 1);
            return (Math.round(value / a) * a).toLocaleString(undefined, {maximumFractionDigits: 15});
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
        if (Math.abs(value) >= Infinity) {
            // noinspection SpellCheckingInspection
            return "Infinity";
        } else if (Math.abs(value) >= 1e281) {
            return `${(value / Number(`1e${~~Math.log10(value)}`)).toFixed(2)} ${foods[`e${~~Math.log10(value)}`].name}`;
        } else if (Math.abs(value) >= 1e217) {
            return `${Math.round(Math.log10(value / 1e217)).toString(2).replaceAll("0", "○").replaceAll("1", "●")}`;
        } else if (Math.abs(value) >= 1e202) {
            return `${Math.log10(value / 1e201).toFixed(2)} Gooragonbucks`;
        } else if (Math.abs(value) >= 1e172) {
            return `${Math.log10(value / 1e171).toFixed(2)} Dragonbucks`;
        } else if (Math.abs(value) >= 1e153) {
            return `${Math.log10(value / 1e152).toFixed(2)} Goosebucks`;
        } else {
            return `$${toNumberName(value, false, 2)}`;
        }
    }
}

function showTooltip(title, text, x, y) {
    document.getElementById("tooltip").innerHTML = `<p style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis;"><b>${title}</b></p><p>${text}</p>`;
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

function showAlert(text) {
    if (debug.alertTimeout !== undefined) clearTimeout(debug.alertTimeout);
    document.getElementById("alert").innerHTML = `<span>${text}</span>`;
    document.getElementById("alert").style.opacity = "1";
    debug.alertTimeout = setTimeout(() => document.getElementById("alert").style.opacity = "0", 5000);
}

function addMoney(amount, cause, asCheck) {
    player.recentTransactions.unshift(`<p style="color: ${amount > 0 ? "green" : amount < 0 ? "red" : "white"};">${cause} | ${amount > 0 ? "+" : amount < 0 ? "-" : ""}${format("money", Math.abs(amount))}</p>`);
    while (player.recentTransactions.length > 10) {
        player.recentTransactions.pop();
    }
    document.getElementById("recentTransactions").innerHTML = player.recentTransactions.join("");
    if (cause !== "Deposit" && amount >= 0) {
        if (cause !== "Withdraw" && cause !== "Sold Upgrade")
            player.totalEarnings += amount;
        if (!asCheck) {
            for (const b of toBills(amount)) {
                items.push(new food(b, false, undefined, undefined, 1));
                items[items.length - 1].location = "wallet";
            }
        } else {
            items.push(new food("check", true, undefined, undefined, amount, undefined, undefined, `${format("money", amount)} Check`));
            items[items.length - 1].location = "wallet";
        }
    } else {
        player.money += amount;
    }
    sendUpdate();
    reload(true);
}

function deposit() {
    if (foods[items[debug.selectedItem].id].group === "Money") {
        items[debug.selectedItem].gone = true;
        addMoney(foods[items[debug.selectedItem].id].price * items[debug.selectedItem].mass, "Deposit");
    }
}

function depositAll() {
    for (const i in items)
        if (foods[items[i].id].group === "Money") {
            debug.selectedItem = Number(i);
            deposit();
        }
}

function toCount(n) {
    n = ~~n;
    if (n <= 1) return "";
    const arrays = [
        ["", "hen", "do", "triskai", "tetrakai", "pentakai", "hexakai", "heptakai", "octakai", "enneakai"],
        ["", "double", "triple", "quadruple", "quintuple", "sextuple", "septuple", "octuple", "nonuple"],
        ["deca", "icosa", "triaconta", "tetraconta", "pentaconta", "hexaconta", "heptaconta", "octaconta", "enneaconta"],
        ["hecta", "dihecta", "trihecta", "tetrahecta", "pentahecta", "hexahecta", "heptahecta", "octahecta", "enneahecta"],
        ["killia", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"],
        ["", "hena", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"]
    ];

    if (n < 10) {
        return `${arrays[1][n - 1]}-`;
    } else if (n < 20) {
        return `${arrays[0][n - 10]}${arrays[2][0]}-`;
    } else if (n < 100) {
        return `${arrays[2][~~(n / 10) - 1]}-${arrays[5][n % 10]}-`.replace("--", "-");
    } else if (n < 1000) {
        return `${arrays[3][~~(n / 100) - 1]}-${arrays[2][~~((n % 100) / 10) - 1]}-${arrays[5][n % 10]}-`.replace("---", "--").replace("--", "-");
    } else {
        return `${n}-`;
    }
}

setInterval(() => {
    for (const g of document.getElementsByClassName("tooltipHoldShift"))
        g.style.display = debug.holdingShift ? "" : "none";
}, 20);

function tick() {
    game.time += settings.timeSpeed;
    game.day = ~~(game.time / 50000) + 1;
    game.year = ~~(game.day / 365) + 1;
    debug.ingredients = [];
    debug.zoom = window.innerWidth < 1 ? 1 / 2048 : window.innerWidth < 2 ? 1 / 1024 : window.innerWidth < 4 ? 1 / 512 : window.innerWidth < 7 ? 1 / 256 : window.innerWidth < 14 ? 1 / 128 : window.innerWidth < 28 ? 1 / 64 : window.innerWidth < 55 ? 1 / 32 : window.innerWidth < 110 ? 1 / 16 : window.innerWidth < 220 ? 1 / 8 : window.innerWidth < 439 ? 1 / 4 : window.innerWidth < 878 ? 1 / 2 : 1;
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
        items[i].age = (Date.now() / 1000 - items[i].dateOfCreation) * settings.foodRottingSpeed * modifiers.foodAgingSpeed;
        items[i].temp = (items[i].temp - settings.roomTemp) * 0.9999 + settings.roomTemp;
        if (items[i].temp < -459) {
            items[i].temp = -459;
        } else if (items[i].temp > 212) {
            for (const l in items[i].liquids) {
                items[i].liquids[l].volume /= 1 + (items[i].temp - 212) / 2e6;
                if (items[i].liquids[l].volume < 0.001)
                    items[i].liquids.splice(Number(l), 1);
            }
        }
        let cookSpeed = 1;
        if (!/oven|sun|particleAccelerator/.test(items[i].location)) cookSpeed = 0.1;
        if (cookSpeed < 0) cookSpeed = 0;
        items[i].cooked += ((items[i].temp - settings.minCookingTemperature > 0 ? (items[i].temp - settings.minCookingTemperature) / (3000 / items[i].cookSpeed) : 0) * settings.cookSpeed * cookSpeed) / Math.cbrt(items[i].mass / 60);
        if (items[i].mass < 0.001 && items[i].mass > 0) items[i].gone = true;
        if (items[i].volume < 0.001 && items[i].volume > 0) items[i].gone = true;
        if (items[i].cooked >= 500) items[i].name = "Charcoal";
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

        if (items[i].location === "wallet") {
            height = 16;
            width = 16;
            visible = debug.location === "bank";
            top = 180 + 4 * ~~((debug.locations[items[i].location] - 1) / 8);
            left = 64 + 16 * ((debug.locations[items[i].location] - 1) % 8);
        }

        if (items[i].location === "recipeMaker") {
            visible = debug.location === "serve";
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
                        k.count++;
                        if (k.count !== 1)
                            k.cooked2 += items[i].cooked;
                        k.temp1 += items[i].temp;
                        items[i].addedProperties = true;
                    }
                }
            }

            loop();

            if (!exists) {
                debug.ingredients.push(items[i]);
                debug.ingredients[debug.ingredients.length - 1].cooked2 = items[i].cooked;
                debug.ingredients[debug.ingredients.length - 1].temp1 = 0;
                debug.ingredients[debug.ingredients.length - 1].count = 0;
                loop();
            }
        }

        if (Number(i) === debug.selectedItem) {
            visible = true;
            if (items[i].location !== "counter") {
                items[i].location = "counter";
                sendUpdate();
            }
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
        for (const l of items[i].liquids)
            liquids += `<p>${l.name} | ${format("volume", l.volume)}</p>`;
        if (settings.units === "metric") t = (items[i].temp - 32) / 1.8;
        //language=js
        elem.setAttribute("onmousedown", `clickFunction(${i});`);
        elem.setAttribute("onmouseover", `showTooltip(${items[i].amount !== 1 ? `"${items[i].amount}× " +` : ""}items[${i}].name, \`<p>${format("number", t)}°${settings.units === "metric" ? "C" : settings.units === "imperial" ? "F" : ""}</p><p>${format("number", items[i].cooked)}% Cooked</p><p>${items[i].group !== "liquid" ? items[i].format() : ""}</p>${items[i].mass !== undefined && items[i].mass !== 0 ? `<p>${format("mass", items[i].mass)}</p>` : ''}${items[i].volume !== undefined && items[i].volume !== 0 ? `<p>${format("volume", items[i].volume)}</p>` : ''}<p>Age: ${format("time", items[i].age)}</p><div style="background: #00000080; width: fit-content;">${liquids}</div>\`, event.clientX, event.clientY);`);
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
        document.getElementById("oven").style.pointerEvents = debug.selectedItem > -1 || debug.locations.oven === 0 ? "" : "none";
        document.getElementById("fridge").src = debug.locations.fridge > 0 ? "img/fridge-open.png" : "img/fridge.png";
        document.getElementById("freezer").style.pointerEvents = debug.selectedItem > -1 || debug.locations.freezer === 0 ? "" : "none";
        document.getElementById("accelerator").src = debug.locations.particleAccelerator > 0 ? "img/accelerator.png" : "img/accelerator-inactive.png";
        document.getElementById("decelerator").src = debug.locations.particleDecelerator > 0 ? "img/decelerator.png" : "img/decelerator-inactive.png";

        if (items[i].gone) {
            items.splice(Number(i), 1);
            if (Number(i) < debug.selectedItem)
                debug.selectedItem--;
            else if (Number(i) === debug.selectedItem)
                debug.selectedItem = -1;
        }
    }

    const index = items.indexOf(undefined);
    if (index > -1) items.splice(index, 1);
    document.getElementById("items").innerHTML = `${output}`;
    document.getElementById("money").innerHTML = `Money: ${format("money", player.money)}`;
    document.getElementById("recipeMaker").innerHTML = `<legend>Plate</legend>${output2 !== "" ? `<button onmousedown="makeRecipe(debug.ingredients); for (const x in debug.ingredients) debug.ingredients[x].gone = true;">Create Food</button>` : ""}${output2}`;

    let timeH = ~~(game.time / (50000 / 24));
    const hour2 = timeH % 24;
    let timeM = ~~((game.time / (50000 / 24 / 60)) % 60);
    let timeAMPM;
    if (timeH % 24 < 12) {
        timeAMPM = "AM";
    } else {
        timeAMPM = "PM";
    }
    timeH = timeH % 12;
    if (timeH === 0) timeH = 12;
    if (String(timeM).length === 1) timeM = `0${timeM}`;

    const clockHTML = document.getElementById("clock");
    let closed;
    const clock = clockHTML.getContext("2d");
    // noinspection SillyAssignmentJS
    clockHTML.width = clockHTML.width;
    if (hour2 >= 9 && hour2 < 17) {
        clock.fillStyle = "#afa";
        game.open = true;
        closed = "Open";
    } else {
        clock.fillStyle = "#faa";
        game.open = false;
        closed = "Closed";
    }
    //language=js
    clockHTML.setAttribute("onmousemove", `showTooltip("Clock", "Year ${game.year}, Day ${game.day}<br>${timeH}:${timeM} ${timeAMPM}<br>${closed}${!game.open ? `<br>Click to skip to tomorrow morning` : ""}", event.mouseX, event.mouseY);`);
    clock.arc(48, 48, 48, 0, Math.PI * 2);
    clock.fill();
    clock.strokeStyle = "#888";
    const hour = new Path2D();
    hour.moveTo(48, 48);
    hour.lineTo(Math.cos(game.time * Math.PI / 12500 - Math.PI / 2) * 24 + 48, Math.sin(game.time * Math.PI / 12500 - Math.PI / 2) * 24 + 48);
    clock.stroke(hour);
    const minute = new Path2D();
    minute.moveTo(48, 48);
    minute.lineTo(Math.cos(game.time * Math.PI / 12500 * 12 - Math.PI / 2) * 36 + 48, Math.sin(game.time * Math.PI / 12500 * 12 - Math.PI / 2) * 36 + 48);
    clock.stroke(minute);
    if (Math.round(game.time % 50000) === 18740) newDay();
}

function newDay() {
    document.getElementById("newDayScreen").children[0].innerHTML = `Year ${(game.year).toLocaleString()}<br>Day ${Math.round((game.day - 1) % 365 + 1).toLocaleString()}`;
    document.getElementById("newDayScreen").style.opacity = "1";
    setTimeout(() => document.getElementById("newDayScreen").style.opacity = "0", 5000);
}

function clickFunction(i) {
    if (items[debug.selectedItem] !== undefined) {
        if (items[debug.selectedItem].volume !== undefined) {
            items[debug.selectedItem].gone = true;
            items[i].addLiquid(items[debug.selectedItem]);
        } else if (items[debug.selectedItem].id === items[i].id || items[debug.selectedItem].cooked >= 500 && items[i].cooked >= 500) {
            items[i].mass += items[debug.selectedItem].mass;
            items[i].amount += items[debug.selectedItem].amount;
            items[debug.selectedItem].gone = true;
        }
    } else {
        debug.selectedItem = debug.selectedItem !== i ? i : -1;
    }
}

reload();

addEventListener("beforeunload", () => {
    if (debug.started) save();
});

document.onmousemove = e => {
    debug.mouseX = e.clientX;
    debug.mouseY = e.clientY;
}

document.onmousedown = () => {
    document.getElementById('controls').style.display = 'none';
    debug.editingSettings = false;
}

document.oncontextmenu = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementById('controls').style.display = '';
        document.getElementById('controls').style.left = `${debug.mouseX / debug.zoom - 18}px`;
        document.getElementById('controls').style.top = `${debug.mouseY / debug.zoom - 18}px`;
    }
    return false;
}

document.onkeydown = e => {
    if (debug.editingSettings) return;
    const locations = [
        "kitchen",
        "serve",
        "bank",
        "config",
        "orders",
        "upgrades"
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
        } else if (debug.location === "orders") {
            debug.location = "kitchen";
        } else if (debug.location === "bank") {
            debug.location = "upgrades";
        }
    } else if (e.key === "ArrowUp") {
        if (debug.location === "bank") {
            debug.location = "kitchen";
        } else if (debug.location === "kitchen") {
            debug.location = "orders";
        } else if (debug.location === "upgrades") {
            debug.location = "bank";
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

document.onkeyup = () => {
    debug.holdingShift = false;
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

function randomKey(object) {
    return Object.keys(object)[~~(Math.random() * Object.keys(object).length)];
}

function capitalize(word) {
    const all = word.split(" ");
    for (const i in all) {
        const firstLetter = all[i].slice(0, 1);
        all[i] = firstLetter.toUpperCase() + all[i].slice(1);
    }
    return all.join(" ");
}

function pay() {
    if (settings.paychecksEnabled) {
        addMoney(Math.random() * settings.maxPaycheckValue, "Paycheck", "+");
        debug.paycheckInterval = setTimeout(pay, settings.paycheckTime * 1000);
    }
}

// Idea: Downgrades that return money