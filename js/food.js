class food {
    constructor(id, isCustom, cookSpeed, cooked, mass, volume, temp, name, liquids, ingredients) {
        this.id = id;
        if (typeof id === "object") isCustom = true;
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
        this.ingredients = ingredients;
        this.amount = 1;
        if (!this.custom) this.group = foods[id].group;
        if (!this.custom) this.cookSpeed = foods[id].cookSpeed !== undefined ? foods[id].cookSpeed : 1;
        if (typeof id === "object") {
            for (const g in id) this[g] = id[g];
            for (const g in this.liquids) this.liquids[g] = new food(this.liquids[g]);
        }
    }

    format() {
        let output = "";
        if (this.temp < 1500) {
            this.hue = 0;
            this.saturation = "0%";
            this.value = "0%";
        }
        if (this.cooked >= 500) {
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
        if (this.temp >= 2.556e32) {
            if (this.mass !== undefined) this.mass /= 1.1;
            if (this.volume !== undefined) this.volume /= 1.1;
            output += ", bye bye :)";
        } else if (this.temp >= 25000) {
            this.hue = 210;
            this.saturation = "50%";
            this.value = "50%";
            output += ", Glowing Blue" + "+".repeat(Math.log10(this.temp) / 5.6 - 0.785);
        } else if (this.temp >= 10000) {
            this.hue = 210;
            this.saturation = `${this.temp / 300 - 10000 / 300}%`;
            this.value = `${100 - (this.temp / 300 - 33.333)}%`;
            output += ", Glowing White" + "+".repeat(this.temp / 3000 - 10 / 3);
        } else if (this.temp >= 7500) {
            this.hue = 60;
            this.saturation = `100%`;
            this.value = `${100 - (400 - this.temp / 25) / 2}%`;
            output += ", Glowing Yellow" + "+".repeat(this.temp / 500 - 15);
        } else if (this.temp >= 5000) {
            this.hue = this.temp / (2500 / 30) - 30;
            this.saturation = "100%";
            this.value = "50%";
            output += ", Glowing Orange" + "+".repeat(this.temp / 500 - 10);
        } else if (this.temp >= 2000) {
            this.hue = this.temp / 100 - 20;
            this.saturation = "100%";
            this.value = "50%";
            output += ", Glowing Red" + "+".repeat(this.temp / 600 - 20 / 6);
        } else if (this.temp >= 1500) {
            this.hue = 0;
            this.saturation = "100%";
            this.value = `${(this.temp / 5 - 300) / 2}%`;
            output += ", Faint Red" + "+".repeat(this.temp / 100 - 15);
        }
        if (this.mass > 50000) {
            output += ", Extremely Heavy";
        } else if (this.mass > 10000) {
            output += ", Very Heavy";
        } else if (this.mass > 2000) {
            output += ", Heavy";
        } else if (this.mass > 500) {
            output += ", Moderately Heavy";
        } else if (this.mass > 100) {
            output += ", Moderately Light";
        } else if (this.mass > 20) {
            output += ", Light";
        } else if (this.mass > 5) {
            output += ", Very Light";
        } else if (this.mass > 1) {
            output += ", Extremely Light";
        } else if (this.mass !== undefined) {
            output += ", Weightless";
        }
        if (this.age > 86400) {
            let decompositionSpeed = (this.age - 86400) / 10000000 + 1;
            output += ", Decomposing";
            if (this.mass !== undefined) this.mass /= decompositionSpeed;
            if (this.volume !== undefined) this.volume /= decompositionSpeed;
        } else if (this.age > 43200) {
            output += ", Rotten";
        } else if (this.age > 21600) {
            output += ", Old";
        } else if (this.age > 10800) {
            output += ", Expired";
        } else if (this.age > 5400) {
            output += ", Nearly Expired";
        } else if (this.age > 2700) {
            output += ", Aged";
        }
        if (this.poisoned) output += ", Poisoned";
        return output;
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
            showAlert(`This is too small to cut ${format("mass", size)} off!`);
        } else {
            showAlert(`You can't cut a liquid!`);
        }
    }

    addLiquid(liquid) {
        console.log(liquid);
        if (liquid.id === "poison") this.poisoned = true;
        for (const l of this.liquids)
            if (liquid.liquids.sort().join() === l.liquids.sort().join() && liquid.id === l.id) {
                l.volume += liquid.volume;
                return;
            }
        this.liquids.push(liquid);
    }
}