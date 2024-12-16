// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ConsumableFactory.sol";
import "./interfaces/IShapecraft.sol";

contract TreasureChest is Ownable {
    ConsumableFactory public consumableFactory;
    
    // Shapecraft contracts
    IShapecraft public shapecraftKeyContract;
    IShapecraft public shapecraftEyeContract;
    
    // Track which keys have been used by address
    mapping(address => mapping(uint256 => bool)) public usedKeys;
    
    // Track total claims per address
    mapping(address => uint256) public totalClaims;
    
    // Track if address has received first-time bonus
    mapping(address => bool) public hasReceivedFirstTimeBonus;
    
    // Shapecraft contract addresses
    address public constant SHAPECRAFT_KEY_CONTRACT = 0x01eB5CF188ba7d075FDf7eDF2BB8426b17CA3320;
    address public constant SHAPECRAFT_EYE_CONTRACT = 0xAA394da7d62E502a7E3dA7e11d21A74c277143d5;
    
    // Events
    event TreasureChestOpened(address indexed player, uint256 keyTokenId, bool hasEye);
    event FirstTimeBonus(address indexed player);
    
    constructor(
        address _consumableFactory
    ) Ownable(msg.sender) {
        consumableFactory = ConsumableFactory(_consumableFactory);
        shapecraftKeyContract = IShapecraft(SHAPECRAFT_KEY_CONTRACT);
        shapecraftEyeContract = IShapecraft(SHAPECRAFT_EYE_CONTRACT);
    }
    
    function claimWithKey(uint256 keyTokenId) external {
        require(!usedKeys[msg.sender][keyTokenId], "Key already used");
        
        // Verify key ownership
        uint256 keyBalance = shapecraftKeyContract.balanceOf(msg.sender, keyTokenId);
        require(keyBalance > 0, "Must own Shapecraft key");
        
        // Check eye ownership for bonus rewards
        uint256 eyeBalance = shapecraftEyeContract.balanceOf(msg.sender, keyTokenId);
        bool hasEye = eyeBalance > 0;
        
        // Mark key as used
        usedKeys[msg.sender][keyTokenId] = true;
        totalClaims[msg.sender]++;
        
        // Mint rewards
        _mintKeyRewards(msg.sender, hasEye);
        
        // First time bonus
        if (!hasReceivedFirstTimeBonus[msg.sender]) {
            _mintFirstTimeBonus(msg.sender);
            hasReceivedFirstTimeBonus[msg.sender] = true;
            emit FirstTimeBonus(msg.sender);
        }
        
        emit TreasureChestOpened(msg.sender, keyTokenId, hasEye);
    }
    
    function _mintKeyRewards(address to, bool hasEye) private {
        // Base rewards (Common items)
        consumableFactory.mint(to, 1, 1);  // Common bomb
        consumableFactory.mint(to, 2, 1);  // Health potion
        
        // Eye holder rewards (Rare items)
        if (hasEye) {
            consumableFactory.mint(to, 101, 1);  // Non-slip shoes
            consumableFactory.mint(to, 102, 1);  // Magic shield
        }
        
        // Milestone rewards
        if (totalClaims[to] == 5) {
            consumableFactory.mint(to, 201, 1);  // Legendary item for 5 claims
        }
    }
    
    function _mintFirstTimeBonus(address to) private {
        // Special first-time rewards
        consumableFactory.mint(to, 301, 1);  // Welcome package
    }
    
    // View functions for game client
    function getPlayerStats(address player) external view returns (
        uint256 claims,
        bool firstTimeBonusClaimed
    ) {
        return (
            totalClaims[player],
            hasReceivedFirstTimeBonus[player]
        );
    }
} 