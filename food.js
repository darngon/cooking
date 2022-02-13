let items = [];
let foods = {
    almond: {name: "Almond", group: "Nuts", imgAvailable: true},
    anchovy: {name: "Anchovy", group: "Seafood"},
    apple: {name: "Apple", group: "Fruits", weight: 200},
    asparagus: {name: "Asparagus", group: "Vegetables", weight: 20},
    avocado: {name: "Avocado", group: "Fruits"},
    bacon: {name: "Bacon", group: "Protein", weight: 20},
    banana: {name: "Banana", group: "Fruits"},
    basil: {name: "Basil Leaf", group: "Herbs / Spices", weight: 1},
    bay: {name: "Bay Leaf", group: "Herbs / Spices", weight: 1},
    beefChuck: {name: "Beef Chuck", group: "Protein", weight: 1000},
    beetroot: {name: "Beetroot", group: "Vegetables"},
    blackberry: {name: "Blackberry", group: "Fruits"},
    blackPepper: {name: "Black Pepper", group: "Herbs / Spices"},
    blueberry: {name: "Blueberry", group: "Fruits"},
    bread: {name: "Bread", group: "Grains", cookSpeed: 10},
    broccoli: {name: "Broccoli", group: "Vegetables"},
    brusselsSprouts: {name: "Brussels Sprouts", group: "Vegetables"},
    burgerBun: {name: "Burger Bun", group: "Grains", weight: 80, cookSpeed: 5},
    burgerPatty: {name: "Burger Patty", group: "Protein", weight: 500},
    buttonMushroom: {name: "Button Mushroom", group: "Vegetables"},
    cabbage: {name: "Cabbage", group: "Vegetables"},
    cantaloupe: {name: "Cantaloupe", group: "Fruits"},
    carrot: {name: "Carrot", group: "Vegetables"},
    cashew: {name: "Cashew", group: "Nuts"},
    caviar: {name: "Caviar", group: "Seafood"},
    cheddar: {name: "Cheddar Cheese", group: "Dairy"},
    cherry: {name: "Cherry", group: "Fruits"},
    chickenBreast: {name: "Chicken Breast", group: "Protein"},
    chickenLeg: {name: "Chicken Leg", group: "Protein"},
    chickenWing: {name: "Chicken Wing", group: "Protein"},
    chiliPepper: {name: "Chili Pepper", group: "Peppers"},
    chives: {name: "Chives", group: "Herbs / Spices"},
    cilantro: {name: "Cilantro Leaves", group: "Herbs / Spices", weight: 1},
    cinnamonStick: {name: "Cinnamon Stick", group: "Herbs / Spices"},
    cocoa: {name: "Cocoa Bean", group: "Vegetables"},
    coconut: {name: "Coconut", group: "Fruits"},
    cod: {name: "Cod", group: "Seafood"},
    cornCob: {name: "Corn Cob", group: "Vegetables"},
    cucumber: {name: "Cucumber", group: "Vegetables"},
    dill: {name: "Dill", group: "Herbs / Spices", weight: 1},
    duckBreast: {name: "Duck Breast", group: "Protein"},
    durian: {name: "Durian", group: "Fruits", weight: 2000},
    egg: {name: "Egg", group: "Protein"},
    eggplant: {name: "Eggplant", group: "Fruits"},
    englishMuffin: {name: "English Muffin", group: "Grains"},
    feta: {name: "Feta Cheese", group: "Dairy"},
    fig: {name: "Fig", group: "Fruits"},
    fusilli: {name: "Fusilli Noodles", group: "Pasta"},
    garlic: {name: "Garlic", group: "Herbs / Spices", weight: 5},
    ginger: {name: "Ginger", group: "Herbs / Spices"},
    goatCheese: {name: "Goat Cheese", group: "Dairy"},
    gorgonzola: {name: "Gorgonzola Cheese", group: "Dairy"},
    grape: {name: "Grape", group: "Fruits", weight: 15},
    greenBellPepper: {name: "Green Bell Pepper", group: "Peppers"},
    guava: {name: "Guava", group: "Fruits"},
    habanero: {name: "Habañero", group: "Peppers"},
    ham: {name: "Ham", group: "Protein", weight: 500},
    honeydew: {name: "Honeydew", group: "Fruits"},
    horseradish: {name: "Horseradish", group: "Herbs / Spices"},
    jalapeno: {name: "Jalapeño", group: "Peppers"},
    lambChop: {name: "Lamb Chop", group: "Protein"},
    lasagna: {name: "Lasagna Noodles", group: "Pasta"},
    lemon: {name: "Lemon", group: "Fruits"},
    lettuce: {name: "Lettuce", group: "Vegetables"},
    lime: {name: "Lime", group: "Fruits"},
    lobster: {name: "Lobster", group: "Seafood"},
    mango: {name: "Mango", group: "Fruits"},
    mint: {name: "Mint Leaf", group: "Herbs / Spices", weight: 1},
    mozzarella: {name: "Mozzarella Cheese", group: "Dairy"},
    onion: {name: "Onion", group: "Vegetables"},
    orange: {name: "Orange", group: "Fruits"},
    oregano: {name: "Oregano", group: "Herbs / Spices", weight: 1},
    oyster: {name: "Oyster", group: "Seafood"},
    pancetta: {name: "Pancetta", group: "Protein"},
    parmesan: {name: "Parmesan Cheese", group: "Dairy"},
    parsley: {name: "Parsley Leaves", group: "Herbs / Spices", weight: 1},
    parsleyRoot: {name: "Parsley Root", group: "Herbs / Spices"},
    parsnip: {name: "Parsnip", group: "Vegetables"},
    peach: {name: "Peach", group: "Fruits"},
    peanut: {name: "Peanut", group: "Nuts"},
    pear: {name: "Pear", group: "Fruits"},
    pecan: {name: "Pecan", group: "Nuts"},
    penne: {name: "Penne Noodles", group: "Pasta"},
    persimmon: {name: "Persimmon", group: "Fruits"},
    pineapple: {name: "Pineapple", group: "Fruits"},
    porkSausage: {name: "Pork Sausage", group: "Protein"},
    porkChop: {name: "Pork Chop", group: "Protein"},
    porkShoulder: {name: "Pork Shoulder", group: "Protein"},
    porkTenderloin: {name: "Pork Tenderloin", group: "Protein"},
    potatoDumplings: {name: "Potato Dumplings", group: "Other"},
    potato: {name: "Potato", group: "Vegetables", weight: 200},
    pufferfish: {name: "Pufferfish", group: "Seafood"},
    pumpkin: {name: "Pumpkin", group: "Vegetables", weight: 5000},
    radish: {name: "Radish", group: "Vegetables"},
    rambutan: {name: "Rambutan", group: "Fruits"},
    raspberry: {name: "Raspberry", group: "Fruits"},
    redBellPepper: {name: "Red Bell Pepper", group: "Peppers"},
    redCabbage: {name: "Red Cabbage", group: "Vegetables"},
    redPepper: {name: "Red Pepper", group: "Herbs / Spices"},
    redPotato: {name: "Red Potato", group: "Vegetables"},
    rosemary: {name: "Rosemary", group: "Herbs / Spices"},
    sage: {name: "Sage Leaf", group: "Herbs / Spices", weight: 1},
    salmon: {name: "Salmon", group: "Seafood"},
    salt: {name: "Salt", group: "Herbs / Spices", weight: 500, unavailable: true},
    saltCrystal: {
        name: "Salt Crystal", group: "Herbs / Spices", functions: [{
            name: "Grind",
            func: id => {
                items[id].gone = true;
                items.push(new food("salt"));
            }
        }]
    },
    sausage: {name: "Sausage", group: "Protein"},
    scallion: {name: "Scallion", group: "Vegetables"},
    scallop: {name: "Scallop", group: "Seafood"},
    serrano: {name: "Serrano Pepper", group: "Peppers"},
    shrimp: {name: "Shrimp", group: "Seafood"},
    spaghetti: {name: "Spaghetti Noodles", group: "Pasta"},
    starAnise: {name: "Star Anise", group: "Herbs / Spices"},
    steak: {name: "Steak", group: "Protein"},
    strawberry: {name: "Strawberry", group: "Fruits"},
    swordfish: {name: "Swordfish", group: "Seafood"},
    tBoneSteak: {name: "T-Bone Steak", group: "Protein"},
    thyme: {name: "Thyme", group: "Herbs / Spices"},
    tomato: {name: "Tomato", group: "Fruits"},
    tortellini: {name: "Tortellini", group: "Pasta"},
    tortilla: {name: "Tortilla", group: "Grains"},
    trout: {name: "Trout", group: "Seafood"},
    tuna: {name: "Tuna", group: "Seafood"},
    walnut: {name: "Walnut", group: "Nuts"},
    watermelon: {name: "Watermelon", group: "Fruits", weight: 3000},
    yakCheese: {name: "Yak Cheese", group: "Dairy"},
    yellowBellPepper: {name: "Yellow Bell Pepper", group: "Peppers"},
    zucchini: {name: "Zucchini", group: "Vegetables"},

    almondMilk: {name: "Almond Milk", group: "Liquids", defaultSize: 500},
    coconutMilk: {name: "Coconut Milk", group: "Liquids", defaultSize: 500},
    milk: {name: "Milk", group: "Liquids", defaultSize: 500},
    vinegar: {name: "Vinegar", group: "Liquids", defaultSize: 1000},
    water: {name: "Water", group: "Liquids", defaultSize: 1000},
};
let debug = {
    groups: {},
    tooltips: {
        counter: () => {
            showTooltip("Table", "This can be used to store food without modifying it.");
        },
        oven: () => {
            showTooltip("Oven", "This device can be used to slowly heat up foods.");
        },
        fridge: () => {
            showTooltip("Fridge", "This device can be used to slowly cool down foods.");
        },
        sun: () => {
            showTooltip("Sun", "This can be used to quickly heat food up.");
        },
        freezer: () => {
            showTooltip("Freezer", "This glass of liquid nitrogen can be used to quickly cool food down.");
        },
        accelerator: () => {
            showTooltip("Particle Accelerator", "This device can be used to extremely quickly heat up food.");
        },
        decelerator: () => {
            showTooltip("Particle Decelerator", "This device can be used to extremely quickly cool down food.");
        },
        mortar: () => {
            showTooltip("Mortar", "This device can be used to grind up some substances.");
        }
    },
    selectedItem: -1
};

function makeRecipe(ingredients) {

    function capitalize(w) {
        if (w.length === 0) return w;
        return w[0].toUpperCase() + w.slice(1);
    }

    let ingredients2 = [];
    let name = "";
    let cookSpeed = 0;
    let cooked = 0;
    for (const i in ingredients) {
        ingredients2[i] = {};
        ingredients2[i].id = ingredients[i].id;
        ingredients2[i].count = ingredients[i].count;

        cookSpeed += ingredients[i].cookSpeed;
        cooked += ingredients[i].cooked;

        name += capitalize(toCount(ingredients[i].count));

        name += `${foods[ingredients[i].id] !== undefined ? foods[ingredients[i].id].name : ingredients[i].id} `;
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

    for (const r in recipes) {
        recipes[r].ingredients.sort((a, b) => {
            let textA = a.id.toUpperCase();
            let textB = b.id.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        if (recipes[r].ingredients.join() === ingredients2.join()) {
            for (let i = 0; i < recipes[r].output.count; i++) {
                items.push(new food(recipes[r].output.name, 2, cookSpeed / ingredients.length, cooked / ingredients.length));
            }
            return;
        }
    }

    name += "Meal";

    if (confirm("You made a new food! Would you like to name it?")) {
        name = prompt("What do you want to name your food?");
    }

    items.push(new food(name, true, cookSpeed / ingredients.length, cooked / ingredients.length));
}

function toggleFoodList() {
    document.getElementById('foodList').style.height = document.getElementById('foodList').style.height !== '90vh' ? '90vh' : '0';
    document.getElementById('foodList').style.opacity = document.getElementById('foodList').style.opacity !== '1' ? '1' : '0';
}

function reload() {
    let debugImgOutput = "";
    for (const f in foods) {
        debugImgOutput += `<img alt="${f}" src='img/food/${f}.png' onload="foods.${f}.imgAvailable = true;">`;
    }
    document.getElementById("debugCheckImg").innerHTML = debugImgOutput;
    let foodList = `<img alt='Back' class='backBtn' onmousedown='if (debug.foodListLocation !== "none") showGroup("none"); else toggleFoodList();' src='img/back.png'><div id='foodGroupList'>`;
    for (const i in foods) {
        if (debug.groups[foods[i].group] === undefined && !foods[i].unavailable) debug.groups[foods[i].group] = [];
        if (!foods[i].unavailable) debug.groups[foods[i].group].push({name: foods[i].name, id: i});
    }

    const groupList = Object.keys(debug.groups);
    groupList.sort();

    for (const g of groupList) {
        foodList += `<h2 onmousedown="showGroup('${g}')" class="foodListItem">${g}</h2>`
    }
    foodList += "</div>";

    for (const j of groupList) {
        foodList += `<div id="foodGroup_${j}"><h2 onmousedown="showGroup('none');" class="foodListItem">${j}</h2>`;
        for (let i of debug.groups[j]) {
            i = i.id;
            foodList += `<p class="foodListItem" title="${foods[i].name}" onmousedown="if (debug.locations['counter'] < 20) items.push(new food('${i}')); else alert('Your table is full!'); document.getElementById('foodList').style.height = '0'; document.getElementById('foodList').style.opacity = '0';">${foods[i].name}</p>`;
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

class food {
    constructor(id, isCustom, cookSpeed, cooked) {
        this.id = id;
        this.custom = isCustom !== undefined ? isCustom : false;
        this.location = "counter";
        this.temp = 72;
        this.cooked = cooked !== undefined ? cooked : 0;
        this.age = 0;
        this.cookSpeed = cookSpeed;
        if (!this.custom) this.group = foods[id].group;
        if (!this.custom) this.cookSpeed = foods[id].cookSpeed !== undefined ? foods[id].cookSpeed : 1;
        setInterval(() => {
            this.temp = (this.temp - 72) * 0.9999 + 72;
            this.cooked += this.temp - 120 > 0 ? (this.temp - 120) / (3000 / this.cookSpeed) : 0;
            this.rating = (-Math.abs(this.cooked - 100) + 100) / 20 + (-Math.abs(this.temp - 120) + 120) / 24 - this.age / 5000;
            if (this.rating > 10) this.rating = 10;
            if (this.rating < 0) this.rating = 0;
            this.rating = this.rating.toFixed(1);
        }, 20);
    }

    format() {
        if (this.temp < 1500) {
            this.hue = 0;
            this.saturation = "0%";
            this.value = "0%";
        }
        if (this.temp >= 2.556e32) {
            setTimeout(() => {
                this.gone = true;
            }, 1000);
            return "bye bye :)";
        } else if (this.temp >= 25000) {
            this.hue = 210;
            this.saturation = "50%";
            this.value = "50%";
            return "Glowing Blue" + "+".repeat(Math.log10(this.temp) / 5.6 - 0.785);
        } else if (this.temp >= 10000) {
            this.hue = 210;
            this.saturation = `${this.temp / 300 - 10000 / 300}%`;
            this.value = "50%";
            return "Glowing White" + "+".repeat(this.temp / 3000 - 10 / 3);
        } else if (this.temp >= 7500) {
            this.hue = 60;
            this.saturation = `${400 - this.temp / 25}%`;
            this.value = `${(400 - this.temp / 25) / 2 + 50}%`;
            return "Glowing Yellow" + "+".repeat(this.temp / 500 - 15);
        } else if (this.temp >= 5000) {
            this.hue = this.temp / (2500 / 30) - 60;
            this.saturation = "100%";
            this.value = "50%";
            return "Glowing Orange" + "+".repeat(this.temp / 500 - 10);
        } else if (this.temp >= 2000) {
            this.hue = this.temp / 100 - 20;
            this.saturation = "100%";
            this.value = "50%";
            return "Glowing Red" + "+".repeat(this.temp / 600 - 20 / 6);
        } else if (this.temp >= 1500) {
            this.hue = 0;
            this.saturation = "100%";
            this.value = `${(this.temp / 5 - 300) / 2}%`;
            return "Faint Red" + "+".repeat(this.temp / 100 - 15);
        } else if (this.cooked >= 500) {
            return "Charcoal";
        } else if (this.cooked >= 200) {
            return "Burnt" + "+".repeat(this.cooked / 60 - 20 / 6);
        } else if (this.cooked >= 150) {
            return "Overcooked" + "+".repeat(this.cooked / 10 - 15);
        } else if (this.cooked >= 110) {
            return "Slightly Overcooked" + "+".repeat(this.cooked / 8 - 13.75);
        } else if (this.cooked >= 90) {
            return "Perfectly Cooked" + "+".repeat(this.cooked / 4 - 22.5);
        } else if (this.cooked >= 80) {
            return "Slightly Undercooked" + "+".repeat(this.cooked / 2 - 40);
        } else if (this.cooked >= 30) {
            return "Undercooked" + "+".repeat(this.cooked / 10 - 3);
        } else if (this.temp > -459) {
            return "Uncooked" + "+".repeat(this.cooked / 6 >= 0 ? this.cooked / 6 : 0);
        } else {
            return "Somehow below absolute zero";
        }
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
        alert(`${this.custom ? this.id : foods[this.id].name} served! Customer gives rating of ${this.rating} / 10. ${temperatureAlert}`);
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

function showTooltip(title, text, x, y) {
    if (x === undefined) x = debug.mouseX;
    if (y === undefined) y = debug.mouseY;
    if (x + 256 > window.innerWidth) x = window.innerWidth - 256;
    if (y + 192 > window.innerHeight) y = window.innerHeight - 192;
    document.getElementById("tooltip").style.display = "";
    document.getElementById("tooltip").style.left = `${x}px`;
    document.getElementById("tooltip").style.top = `${y}px`;
    document.getElementById("tooltip").innerHTML = `<p><b>${title}</b></p><p>${text}</p>`;
}

function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
}

setInterval(() => {
    if (window.innerWidth < 750) {
        document.getElementById("tooSmallAlert").style.display = "";
        document.getElementById("main").style.display = "none";
    } else {
        document.getElementById("tooSmallAlert").style.display = "none";
        document.getElementById("main").style.display = "";
    }
    let output = "";
    let output2 = "";
    let ingredients = [];
    debug.locations = {
        counter: 0,
        oven: 0,
        fridge: 0,
        sun: 0,
        particleAccelerator: 0,
        particleDecelerator: 0
    };
    for (const i in items) {
        if (items[i].location !== "recipeMaker") {
            if (debug.locations[items[i].location] === undefined) debug.locations[items[i].location] = 0;
            debug.locations[items[i].location]++;
            items[i].age++;
            let left = 0;
            let top = 0;
            let width = 0;
            let height = 0;
            if (foods[items[i].id] !== undefined) for (const j in foods[items[i].id].functions) {
                output += `<br><button onmousedown="foods[items[${i}].id].functions[${j}].func(${i});">${foods[items[i].id].functions[j].name}</button>`;
            }
            width = 32;
            height = 32;
            if (items[i].location === "counter") {
                top = window.innerHeight / 2 - 80 + 16 * ~~((debug.locations[items[i].location] - 1) / 5);
                left = window.innerWidth / 2 - 80 + 32 * ((debug.locations[items[i].location] - 1) % 5);
            }
            if (items[i].location === "oven") {
                top = window.innerHeight - 56;
                left = window.innerWidth - 112 + 32 * ((debug.locations[items[i].location] - 1) % 5);
                items[i].temp = (items[i].temp - 650) * 0.9995 + 650;
            }
            if (items[i].location === "fridge") {
                top = window.innerHeight - 80 + 32 * ~~((debug.locations[items[i].location] - 1) / 2);
                left = 32 + 32 * ((debug.locations[items[i].location] - 1) % 2);
                items[i].temp = (items[i].temp - 35) * 0.995 + 35;
            }
            if (items[i].location === "sun") {
                top = 160 + 32 * ~~((debug.locations[items[i].location] - 1) / 2);
                left = window.innerWidth - 96 + 32 * ((debug.locations[items[i].location] - 1) % 2);
                items[i].temp = (items[i].temp - 15000) * 0.9995 + 15000;
            }
            if (items[i].location === "freezer") {
                top = window.innerHeight - 56 - 32 * ~~((debug.locations[items[i].location] - 1) / 2);
                left = window.innerWidth - 224 + 32 * ((debug.locations[items[i].location] - 1) % 2);
                items[i].temp = (items[i].temp + 460) * 0.995 - 460;
            }
            if (items[i].location === "particleAccelerator") {
                top = window.innerHeight - 56;
                left = window.innerWidth - 368;
                items[i].temp = items[i].temp > 1 ? items[i].temp * 1.1 : items[i].temp / 1.1 + 1;
            }
            if (items[i].location === "particleDecelerator") {
                top = window.innerHeight - 56;
                left = window.innerWidth - 496;
                items[i].temp = items[i].temp > -1 ? items[i].temp / 1.1 - 1 : items[i].temp * 1.1;
            }

            const h = items[i].hue;
            const s = items[i].saturation;
            const v = items[i].value;
            let tempColor = `hsl(${h}, ${s}, ${v})`;

            output += `<div class="food" id="foodIndex${i}" onmousedown="debug.selectedItem = debug.selectedItem !== ${i} ? ${i} : -1;" oncontextmenu="items.splice(${i}, 1); debug.selectedItem = -1; hideTooltip();" onmouseover="showTooltip('${items[i].custom ? items[i].id : foods[items[i].id].name}', '<p>${Math.round(items[i].temp).toLocaleString()}°F</p><p>${Math.round(items[i].cooked).toLocaleString()}% Cooked</p><p>${items[i].group !== "liquid" ? items[i].format() : ""}</p>');" onmouseout="hideTooltip();"><img style="${(foods[items[i].id].imgAvailable ? '' : 'border-width: 3px; border-style: solid; border-color: white; ')}position: absolute; left: ${left}px; top: ${top}px; filter: brightness(${100 - items[i].cooked / 2}%); drop-shadow(0 0 8px ${tempColor}); ${debug.selectedItem === Number(i) ? "background: #00000060" : ""};" src="img/food/${foods[items[i].id].imgAvailable ? items[i].id : "transparent"}.png" height="${height}" width="${width}" alt="${items[i].id}"></div>`;
            document.getElementById("oven").src = debug.locations.oven > 0 ? "img/oven-on.png" : "img/oven.png";
            document.getElementById("oven").style.pointerEvents = debug.selectedItem > -1 ? "" : "none";
            document.getElementById("fridge").src = debug.locations.fridge > 0 ? "img/fridge-open.png" : "img/fridge.png";
            document.getElementById("freezer").style.pointerEvents = debug.selectedItem > -1 ? "" : "none";
            document.getElementById("accelerator").src = debug.locations.particleAccelerator > 0 ? "img/accelerator.png" : "img/accelerator-inactive.png";
            document.getElementById("decelerator").src = debug.locations.particleDecelerator > 0 ? "img/decelerator.png" : "img/decelerator-inactive.png";
        } else {
            let exists = false;
            for (const k in ingredients) {
                if (ingredients[k].id === items[i].id) {
                    exists = true;
                    ingredients[k].count++;
                    break;
                }
            }
            if (!exists) {
                ingredients.push({id: items[i].id, count: 1, cookSpeed: items[i].cookSpeed, cooked: items[i].cooked});
            }
            output2 += `<fieldset class="food"><legend>${items[i].custom ? items[i].id : foods[items[i].id].name}</legend><p>${Math.round(items[i].temp).toLocaleString()}°F</p><p>${Math.round(items[i].cooked).toLocaleString()}% Cooked</p><p>${items[i].group !== "liquid" ? items[i].format() : ""}</p><button onmousedown="items.splice(${i}, 1);">Trash</button><button onmousedown="items[${i}].serve();">Serve</button><button onmousedown="items[${i}].location = 'counter';">Counter</button></fieldset>`;
        }
        if (items[i].gone) {
            items.splice(Number(i), 1);
        }
    }
    debug.ingredients = ingredients;
    const index = items.indexOf(undefined);
    if (index > -1) items.splice(index, 1);
    document.getElementById("items").innerHTML = `${output}`;
    document.getElementById("recipeMaker").innerHTML = `<legend>Plate</legend>${output2 !== "" ? `<button onmousedown="makeRecipe(debug.ingredients); for (const x in debug.ingredients) debug.ingredients[x].gone = true;">Create Food</button>` : ""}${output2}`;
}, 50);

reload();

document.onmousemove = e => {
    debug.mouseX = e.clientX;
    debug.mouseY = e.clientY;
}