export interface Recipe {
    name: string;
    ingredients: { type: string; state: string; quantity: number }[];
}

export const recipes: Recipe[] = [
    {
        name: "Beef Stew",
        ingredients: [
            { type: "carrot", state: "chopped", quantity: 2 },
            { type: "potato", state: "chopped", quantity: 2 },
            { type: "onion", state: "chopped", quantity: 2 },
            { type: "beef", state: "cooked", quantity: 1 }
        ]
    }
];