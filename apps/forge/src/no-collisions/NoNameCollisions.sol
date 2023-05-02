// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;
import "./INoNameCollisions.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@punkdomains/interfaces/IBasePunkTLD.sol";

contract NoNameCollisions is INoNameCollisions, Ownable {
    IBasePunkTLD public collisionRegistry;

    event CollisionRegistryUpdated(address NewCollisionRegistry);

    constructor(address _collisionRegistry) {
        collisionRegistry = IBasePunkTLD(_collisionRegistry);
    }

    /**
     * @dev Checks to see if there is a name collision for the given name between FNS Registry
     *      and another Registry. getDomainHolder also intakes the label without the TLD. i.e. "a"
     *      and not "a.flr"
     * @param name the name on TLD '.flr' to check for a name collision
     * @return true if there is a name collision, false otherwise
     */
    function isNameCollision(string calldata name) external view returns (bool) {
        return collisionRegistry.getDomainHolder(name) != address(0);
    }

    /**
     * @dev Allows the owner of the contract to update the Collision Registry, in case it
     *      is ever altered in the future
     * @dev This assumes that the interface to check
     * @param newCollisionRegistry the new CollisionRegistry address
     */
    function updateCollisionRegistry(IBasePunkTLD newCollisionRegistry) external onlyOwner {
        require(address(newCollisionRegistry) != address(0), "NoNameCollisions: Cannot Update To Zero Address");
        collisionRegistry = newCollisionRegistry;
        emit CollisionRegistryUpdated(address(newCollisionRegistry));
    }
}