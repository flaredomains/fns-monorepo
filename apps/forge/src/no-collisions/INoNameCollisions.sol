// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface INoNameCollisions {
    /**
     * @dev Checks to see if there is a name collision for the given name between FNS Registry
     *      and another Registry
     * @param name the name on TLD '.flr' to check for a name collision
     * @return true if there is a name collision, false otherwise
     */
    function isNameCollision(string calldata name) external view returns (bool);
}
