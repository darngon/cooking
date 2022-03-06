let orders = [];

function getOrder() {
    showAlert(`New Order! (#${debug.orderId + 1})`);
    let ingredients = [];
    for (let i = 0; i < Math.random() * player.skill; i++) {
        const a = randomFood(false);
        ingredients.push({
            id: a,
            mass: foods[a].mass !== undefined ? ~~(Math.random() * 9 + 1) * foods[a].mass : undefined,
            cooked: Math.random() * 200
        });
    }
    ingredients.sort((a, b) => {
        let a1 = a.id.toUpperCase();
        let b2 = b.id.toUpperCase();
        return a1 < b2 ? -1 : a1 > b2 ? 1 : 0;
    });
    debug.orderId++;
    orders.push({
        id: debug.orderId,
        ingredients: ingredients.filter(({id}, index) => !ingredients.map(o => o.id).includes(id, index + 1)),
        time: (Math.random() * 600 + 600) * modifiers.serveTime,
        customer: {
            wealth: Math.random() < 0.9999 ? Math.random() * player.totalEarnings / 1000 + 1 : Math.random() * player.totalEarnings * 20 + 1
        }
    });
    sendUpdate();
    setTimeout(getOrder, Math.random() * 300000 / player.popularity);
}

function serve(foodId, orderId) {
    let rating = 0;
    const ingredients = items[foodId].ingredients.sort((a, b) => {
        const a1 = a.id.toUpperCase();
        const b1 = b.id.toUpperCase();
        return a1 > b1 ? 1 : a1 < b1 ? -1 : 0;
    });
    const foodIds = ingredients.map(g => g.id);
    const orderIds = orders[orderId].ingredients.map(g => g.id);
    const commonIngredients = foodIds.filter(g => orderIds.includes(g));
    rating += commonIngredients.length / orderIds.length;
    for (let i = 0; i < ingredients.length; i++)
        if (!commonIngredients.includes(ingredients[i].id)) {
            ingredients.splice(i, 1);
            i--;
        }
    for (let i = 0; i < orders[orderId].ingredients.length; i++)
        if (!commonIngredients.includes(orders[orderId].ingredients[i].id)) {
            orders[orderId].ingredients.splice(i, 1);
            i--;
        }

    let r = 0;

    for (const f in ingredients) {
        if (ingredients[f].poisoned) items[foodId].poisoned = true;
        ingredients[f].mass = ingredients[f].mass1;
        const a = ingredients[f].cooked1 / ingredients[f].count1;
        let {ingredients: ingredients2} = orders[orderId];
        console.log(ingredients[f].mass);
        console.log(ingredients2[f].mass);
        ingredients[f].rating = 5 * ingredients[f].mass > ingredients2[f].mass ? 2 ** -Math.abs(ingredients[f].mass / ingredients2[f].mass - 1) : ingredients[f].mass < ingredients2[f].mass ? 2 ** -Math.abs(ingredients2[f].mass / ingredients[f].mass - 1) : 1;
        ingredients[f].rating += 5 * a > ingredients2[f].cooked ? 2 ** -Math.abs(a / ingredients2[f].cooked - 1) : a < ingredients2[f].cooked ? 2 ** -Math.abs(ingredients2[f].cooked / a - 1) : 1;
        ingredients[f].rating /= 2;
        r += ingredients[f].rating;
    }

    rating += !isNaN(r / ingredients.length) ? r / ingredients.length : 0;

    ingredients.sort((a, b) => {
        let a1 = a.id.toUpperCase();
        let b2 = b.id.toUpperCase();
        return a1 < b2 ? -1 : a1 > b2 ? 1 : 0;
    });
    rating /= 2;
    player.skill += rating / 20;
    player.popularity += rating > 0.5 ? rating / 20 : -1 - rating / 20;
    let extraMessage = "";
    if (items[foodId].poisoned) {
        extraMessage += "Customer was poisoned and died, which strongly damaged your reputation.";
        player.popularity /= 2;
        foods.humanMeat.count += ~~(Math.random() * 20);
    }
    items[foodId].gone = true;

    let cost = 0;
    for (const i of ingredients)
        cost += foods[i.id].price * i.mass / foods[i.id].mass;
    const payment = Math.random() * cost * 3 * settings.priceMultiplier * orders[orderId].customer.wealth * modifiers.customerPayment;

    showAlert(`Rating: ${(rating * 5).toFixed(1)}☆ / 5.0☆. Customer Paid ${format("money", payment)}. ${extraMessage}`);
    addMoney(payment, "Customer Paid");
    orders.splice(orderId, 1);
    sendUpdate();
}

setInterval(() => {
    let output = '<h1 style="font-size: 200%;">Orders</h1>';
    for (const o in orders) {
        orders[o].time--;
        if (orders[o].time <= 0) {
            showAlert(`You ran out of time to serve Order #${orders[o].id}!`);
            if (otherSaved.timeUpPopDec) player.popularity -= 0.1;
            orders.splice(Number(o), 1);
        }
        output += `<div class="order" onclick="serve(debug.selectedItem, ${o});"><h1>Order #${orders[o].id}</h1><p>${format("time", orders[o].time)}</p>`;
        for (const i of orders[o].ingredients)
            output += `<p>${foods[i.id].name} | ${format("mass", i.mass)} | ${format("number", i.cooked)}% Cooked</p>`;
        output += `</div>`;
    }
    if (orders.length === 0) output += "<p>No orders yet</p>";
    if (player.popularity < 1) player.popularity = 1;
    if (player.money === Infinity) player.money = Number.MAX_VALUE;
    document.getElementById("orders").innerHTML = output;
    document.getElementById("stats").innerHTML = `<p>Total Earnings: ${format("money", player.totalEarnings)}</p><p>Popularity: ${player.popularity.toLocaleString()}</p><p>Skill: ${player.skill.toLocaleString()}</p>`;
}, 1000);