// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IShapecraft {
    function balanceOf(address owner, uint256 id) external view returns (uint256);
} 