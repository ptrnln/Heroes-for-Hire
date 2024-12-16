export enum ItemType {
    CONSUMABLE = 'CONSUMABLE',
    EQUIPMENT = 'EQUIPMENT'
}

export enum ItemRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    LEGENDARY = 'LEGENDARY',
    SPECIAL = 'SPECIAL'
}

export interface GameItem {
    id: number;
    name: string;
    type: ItemType;
    rarity: ItemRarity;
    power: number;
    description: string;
}

export const GAME_ITEMS: { [key: number]: GameItem } = {
    // Common Items (1-100)
    1: {
        id: 1,
        name: "Common Bomb",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        power: 10,
        description: "Basic explosive for clearing obstacles"
    },
    2: {
        id: 2,
        name: "Salmon Bowl",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        power: 15,
        description: "Restores health"
    },
    3: {
        id: 2,
        name: "Ramen",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        power: 15,
        description: "Restores health"
    },
    
    // Rare Items (101-200)
    101: {
        id: 101,
        name: "Non-slip Shoes",
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        power: 25,
        description: "Prevents slipping on ice"
    },
    102: {
        id: 102,
        name: "Magic Shield",
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        power: 30,
        description: "Protects against magic damage"
    },
    
    // Legendary Items (201-300)
    201: {
        id: 201,
        name: "Champion's Crown",
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        power: 50,
        description: "Reward for opening 5 treasure chests"
    },
    
    // Special Items (301+)
    301: {
        id: 301,
        name: "Welcome Package",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.SPECIAL,
        power: 20,
        description: "Special first-time bonus"
    }
};

export class GameItemService {
    private static CONSUMABLE_FACTORY = "YOUR_DEPLOYED_CONTRACT";
    
    static async getPlayerItems(address: string): Promise<GameItem[]> {
        // TODO: Implement contract query
        console.log("Getting items for address:", address);
        return [];
    }
    
    static async useItem(itemId: number): Promise<void> {
        // TODO: Implement item usage
        console.log("Using item:", itemId);
    }
} 