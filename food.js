let items = [];
let foods = {
    almond: {name: "Almond", group: "Nuts"},
    apple: {name: "Apple", group: "Fruits", weight: 200},
    asparagus: {name: "Asparagus", group: "Vegetables", weight: 20},
    avocado: {name: "Avocado", group: "Fruits"},
    bacon: {name: "Bacon", group: "Protein", weight: 20},
    banana: {name: "Banana", group: "Banana"},
    basil: {name: "Basil Leaf", group: "Herbs", weight: 1},
    bay: {name: "Bay Leaf", group: "Herbs", weight: 1},
    beefChuck: {name: "Beef Chuck", group: "Protein", weight: 1000},
    beetroot: {name: "Beetroot", group: "Vegetables"},
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
    cheddar: {name: "Cheddar Cheese", group: "Dairy"},
    cherry: {name: "Cherry", group: "Fruits"},
    chickenBreast: {name: "Chicken Breast", group: "Protein"},
    chickenLeg: {name: "Chicken Leg", group: "Protein"},
    chiliPepper: {name: "Chili Pepper", group: "Peppers"},
    chives: {name: "Chives", group: "Herbs"},
    cilantro: {name: "Cilantro Leaves", group: "Herbs", weight: 1},
    cinnamonStick: {name: "Cinnamon Stick", group: "Spices"},
    cocoa: {name: "Cocoa", group: "Vegetables"},
    coconut: {name: "Coconut", group: "Fruits"},
    cod: {name: "Cod", group: "Seafoods"},
    cornCob: {name: "Corn Cob", group: "Vegetables"},
    cucumber: {name: "Cucumber", group: "Vegetables"},
    dill: {name: "Dill", group: "Herbs", weight: 1},
    duckBreast: {name: "Duck Breast", group: "Protein"},
    durian: {name: "Durian", group: "Fruits", weight: 2000},
    egg: {name: "Egg", group: "Protein"},
    eggplant: {name: "Eggplant", group: "Fruits"},
    fig: {name: "Fig", group: "Fruits"},
    fusilli: {name: "Fusilli Noodles", group: "Grains"},
    garlic: {name: "Garlic", group: "Spices", weight: 5},
    ginger: {name: "Ginger", group: "Spices"},
    goatCheese: {name: "Goat Cheese", group: "Dairy"},
    grape: {name: "Grape", group: "Fruits", weight: 15},
    greenBellPepper: {name: "Green Bell Pepper", group: "Peppers"},
    guava: {name: "Guava", group: "Fruits"},
    habanero: {name: "Habañero", group: "Peppers"},
    ham: {name: "Ham", group: "Protein", weight: 500},
    honeydew: {name: "Honeydew", group: "Fruits"},
    jalapeno: {name: "Jalapeño", group: "Peppers"},
    lamb: {name: "Lamb", group: "Protein"},
    lambChop: {name: "Lamb Chop", group: "Protein"},
    lasagna: {name: "Lasagna Noodles", group: "Grains"},
    lemon: {name: "Lemon", group: "Fruits"},
    lettuce: {name: "Lettuce", group: "Vegetables"},
    mango: {name: "Mango", group: "Fruits"},
    mint: {name: "Mint Leaf", group: "Herbs", weight: 1},
    mozzarella: {name: "Mozzarella Cheese", group: "Dairy"},
    onion: {name: "Onion", group: "Vegetables"},
    orange: {name: "Orange", group: "Fruits"},
    oregano: {name: "Oregano Twig", group: "Herbs", weight: 1},
    oyster: {name: "Oyster", group: "Seafood"},
    parsley: {name: "Parsley Leaves", group: "Herbs", weight: 1},
    parsleyRoot: {name: "Parsley Root", group: "Herbs"},
    parsnip: {name: "Parsnip", group: "Vegetables"},
    peach: {name: "Peach", group: "Fruits"},
    peanut: {name: "Peanut", group: "Nuts"},
    pear: {name: "Pear", group: "Fruits"},
    pecan: {name: "Pecan", group: "Nuts"},
    penne: {name: "Penne Noodles", group: "Grains"},
    persimmon: {name: "Persimmon", group: "Fruits"},
    pineapple: {name: "Pineapple", group: "Fruits"},
    porkChop: {name: "Pork Chop", group: "Protein"},
    porkShoulder: {name: "Pork Shoulder", group: "Protein"},
    porkTenderloin: {name: "Pork Tenderloin", group: "Protein"},
    potatoDumplings: {name: "Potato Dumplings", group: "Other"},
    potato: {name: "Potato", group: "Vegetables", weight: 200},
    pufferfish: {name: "Pufferfish", group: "Seafood"},
    pumpkin: {name: "Pumpkin", group: "Vegetables", weight: 5000},
    radish: {name: "Radish", group: "Vegetables"},
    rambutan: {name: "Rambutan", group: "Fruits"},
    redBellPepper: {name: "Red Bell Pepper", group: "Peppers"},
    redCabbage: {name: "Red Cabbage", group: "Vegetables"},
    redPotato: {name: "Red Potato", group: "Vegetables"},
    rosemary: {name: "Rosemary Twig", group: "Herbs"},
    sage: {name: "Sage Leaf", group: "Herbs", weight: 1},
    salmon: {name: "Salmon", group: "Seafood"},
    sausage: {name: "Sausage", group: "Protein"},
    scallion: {name: "Scallion", group: "Vegetables"},
    scallop: {name: "Scallop", group: "Seafood"},
    shrimp: {name: "Shrimp", group: "Seafood"},
    spaghetti: {name: "Spaghetti Noodles", group: "Grains"},
    starAnise: {name: "Star Anise", group: "Spices"},
    steak: {name: "Steak", group: "Protein"},
    strawberry: {name: "Strawberry", group: "Fruits"},
    tBoneSteak: {name: "T-Bone Steak", group: "Protein"},
    thyme: {name: "Thyme Twig", group: "Herbs"},
    tomato: {name: "Tomato", group: "Fruits"},
    tortilla: {name: "Tortilla", group: "Grains"},
    trout: {name: "Trout", group: "Seafood"},
    tuna: {name: "Tuna", group: "Seafood"},
    watermelon: {name: "Watermelon", group: "Fruits", weight: 3000},
    whale: {name: "Whale Meat", group: "Seafood"},
    yakCheese: {name: "Yak Cheese", group: "Dairy"},
    yellowBellPepper: {name: "Yellow Bell Pepper", group: "Peppers"},
    zucchini: {name: "Zucchini", group: "Vegetables"},

    almondMilk: {name: "Almond Milk", group: "Liquids", defaultSize: 500},
    coconutMilk: {name: "Coconut Milk", group: "Liquids", defaultSize: 500},
    milk: {name: "Milk", group: "Liquids", defaultSize: 500},
    vinegar: {name: "Vinegar", group: "Liquids", defaultSize: 1000},
    water: {name: "Water", group: "Liquids", defaultSize: 1000}
};

let debug = {};

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
                items.push(new food(recipes[r].output.name, true, cookSpeed / ingredients.length, cooked / ingredients.length));
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

function reload() {
    let foodList = "";
    let groups = [];
    for (const i in foods) {
        if (groups[foods[i].group] === undefined) groups[foods[i].group] = [];
        groups[foods[i].group].push(foods[i].name);
        foodList += `<p class="foodListItem" title="${foods[i].name}" onmousedown="items.push(new food('${i}')); document.getElementById('foodList').style.height = '0'; document.getElementById('foodList').style.opacity = '0';">${foods[i].name}</p>`;
    }
    document.getElementById("foodList").innerHTML = foodList;
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
            this.cooked += this.temp + 300 < 0 ? (this.temp + 300) / (3000 / this.cookSpeed) : 0;
            this.rating = (-Math.abs(this.cooked - 100) + 100) / 20 + (-Math.abs(this.temp - 120) + 120) / 24 - this.age / 5000;
            if (this.rating > 10) this.rating = 10;
            if (this.rating < 0) this.rating = 0;
            this.rating = this.rating.toFixed(1);
        }, 20);
    }

    format() {
        if (this.temp >= 2.556e32) {
            setTimeout(() => {
                this.gone = true;
            }, 1000);
            return "bye bye :)";
        } else if (this.temp >= 25000) {
            return "Glowing Blue" + "+".repeat(Math.log10(this.temp) / 5.6 - 0.785);
        } else if (this.temp >= 10000) {
            return "Glowing White" + "+".repeat(this.temp / 3000 - 10 / 3);
        } else if (this.temp >= 7500) {
            return "Glowing Yellow" + "+".repeat(this.temp / 500 - 15);
        } else if (this.temp >= 5000) {
            return "Glowing Orange" + "+".repeat(this.temp / 500 - 10);
        } else if (this.temp >= 2000) {
            return "Glowing Red" + "+".repeat(this.temp / 600 - 20 / 6);
        } else if (this.temp >= 1500) {
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
            return "Raw" + "+".repeat(this.cooked / 6 >= 0 ? this.cooked / 6 : 0);
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
        return `${arrays[0][n - 10]}${arrays[2][0]}`;
    } else if (n < 100) {
        return `${arrays[2][~~(n / 10) - 1]}-${arrays[5][n % 10]}-`.replace("--", "-");
    } else if (n < 1000) {
        return `${arrays[3][~~(n / 100) - 1]}-${arrays[2][~~((n % 100) / 10) - 1]}-${arrays[5][n % 10]}-`.replace("---", "--").replace("--", "-");
    } else {
        return `${n}-`;
    }
}

setInterval(() => {
    let output = "";
    let output2 = "";
    let ingredients = [];
    for (const i in items) {
        if (items[i].location !== "recipeMaker") {
            items[i].age++;
            output += `<fieldset class="food"><legend>${items[i].custom ? items[i].id : foods[items[i].id].name}</legend><p>${Math.round(items[i].temp).toLocaleString()}°F</p><p>${Math.round(items[i].cooked).toLocaleString()}% Cooked</p><p>${items[i].group !== "liquid" ? items[i].format() : ""}</p><button onmousedown="items.splice(${i}, 1);">Throw Away</button><button onmousedown="items[${i}].serve();">Serve</button><button onmousedown="items[${i}].location = 'recipeMaker';">Move to Recipe Maker</button>`;
            if (items[i].location !== "counter") {
                output += `<br><button onmousedown="items[${i}].location = 'counter'">Move to Counter</button>`;
            }
            if (items[i].location !== "oven") {
                output += `<br><button onmousedown="items[${i}].location = 'oven'">Move to Oven</button>`;
            } else {
                items[i].temp = (items[i].temp - 650) * 0.9995 + 650;
            }
            if (items[i].location !== "fridge") {
                output += `<br><button onmousedown="items[${i}].location = 'fridge'">Move to Fridge</button>`;
            } else {
                items[i].temp = (items[i].temp - 35) * 0.995 + 35;
            }
            if (items[i].location !== "sun") {
                output += `<br><button onmousedown="items[${i}].location = 'sun'">Move to Sun</button>`;
            } else {
                items[i].temp = (items[i].temp - 15000) * 0.9995 + 15000;
            }
            if (items[i].location !== "freezer") {
                output += `<br><button onmousedown="items[${i}].location = 'freezer'">Move to Freezer</button>`;
            } else {
                items[i].temp = (items[i].temp + 460) * 0.995 - 460;
            }
            if (items[i].location !== "particleAccelerator") {
                output += `<br><button onmousedown="items[${i}].location = 'particleAccelerator'">Move to Particle Accelerator</button>`;
            } else {
                items[i].temp = items[i].temp > 1 ? items[i].temp * 1.1 : items[i].temp / 1.1 + 1;
            }
            if (items[i].location !== "particleDecelerator") {
                output += `<br><button onmousedown="items[${i}].location = 'particleDecelerator'">Move to Particle Decelerator</button>`;
            } else {
                items[i].temp = items[i].temp > -1 ? items[i].temp / 1.1 - 1 : items[i].temp * 1.1;
            }
            output += "</fieldset>";
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
            output2 += `<fieldset class="food"><legend>${items[i].custom ? items[i].id : foods[items[i].id].name}</legend><p>${Math.round(items[i].temp).toLocaleString()}°F</p><p>${Math.round(items[i].cooked).toLocaleString()}% Cooked</p><p>${items[i].group !== "liquid" ? items[i].format() : ""}</p><button onmousedown="items.splice(${i}, 1);">Throw Away</button><button onmousedown="items[${i}].serve();">Serve</button><button onmousedown="items[${i}].location = 'counter';">Move to Counter</button></fieldset>`;
        }
        if (items[i].gone) {
            items.splice(Number(i), 1);
        }
    }
    debug.ingredients = ingredients;
    const index = items.indexOf(undefined);
    if (index > -1) items.splice(index, 1);
    document.getElementById("items").innerHTML = output;
    document.getElementById("recipeMaker").innerHTML = `<legend>Meal Maker</legend>${output2 !== "" ? `<button onmousedown="makeRecipe(debug.ingredients); for (const x in debug.ingredients) debug.ingredients[x].gone = true;">Make Meal</button>` : ""}${output2}`;
}, 50);

reload();