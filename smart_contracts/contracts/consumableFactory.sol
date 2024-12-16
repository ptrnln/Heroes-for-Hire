// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConsumableFactory is ERC1155, Ownable {
    // Item types
    enum ItemType { CONSUMABLE, EQUIPMENT }
    
    // Add rarity levels
    enum Rarity { COMMON, RARE, LEGENDARY }
    
    struct Item {
        string name;
        ItemType itemType;
        Rarity rarity;
        uint256 power;
        bool active;
    }
    
    // Mapping from token ID to Item details
    mapping(uint256 => Item) public items;
    
    // Only TreasureChest contract can mint
    address public treasureChestContract;
    
    constructor() ERC1155("ipfs://bafybeieqkbxvglazvg7lmmibrngnzlxy4c2dnl3aq3zrge5ohehskxr5xu/") Ownable(msg.sender) {}
    
    function setTreasureChestContract(address _treasureChest) external onlyOwner {
        treasureChestContract = _treasureChest;
    }
    
    function createItem(
        uint256 tokenId,
        string memory name,
        ItemType itemType,
        Rarity rarity,
        uint256 power
    ) external onlyOwner {
        require(!items[tokenId].active, "Item already exists");
        
        items[tokenId] = Item({
            name: name,
            itemType: itemType,
            rarity: rarity,
            power: power,
            active: true
        });
    }
    
    function mint(address to, uint256 tokenId, uint256 amount) external {
        require(msg.sender == treasureChestContract, "Only TreasureChest can mint");
        require(items[tokenId].active, "Item does not exist");
        
        _mint(to, tokenId, amount, "");
    }
}