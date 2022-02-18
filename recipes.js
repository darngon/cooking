let recipes = [
    {
        ingredients: [
            {
                id: "cheddar",
                mass: 25
            },
            {
                id: "tomato",
                mass: 25
            },
            {
                id: "onion",
                mass: 25
            },
            {
                id: "lettuce",
                mass: 25
            },
            {
                id: "bacon",
                mass: 25
            },
            {
                id: "burgerBun",
                mass: 120,
                cooked: {
                    min: 90,
                    max: 110
                }
            },
            {
                id: "burgerPatty",
                mass: 100,
                cooked: {
                    min: 90,
                    max: 110
                }
            }
        ],
        output: {
            name: "Hamburger",
            cooked: 100
        }
    },
    {
        ingredients: [
            {
                id: "cabbage",
                mass: 25,
                cooked: {
                    min: 20,
                    max: 50
                }
            }
        ],
        output: {
            name: "../plate"
        }
    }
];