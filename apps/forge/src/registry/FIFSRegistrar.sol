pragma solidity ^0.8.18;

import "./IFNS.sol";

/**
 * A registrar that allocates subdomains to the first person to claim them.
 */
contract FIFSRegistrar {
    IFNS fns;
    bytes32 rootNode;

    modifier only_owner(bytes32 label) {
        address currentOwner = fns.owner(keccak256(abi.encodePacked(rootNode, label)));
        require(currentOwner == address(0x0) || currentOwner == msg.sender);
        _;
    }

    /**
     * Constructor.
     * @param ensAddr The address of the FNS registry.
     * @param node The node that this registrar administers.
     */
    constructor(IFNS ensAddr, bytes32 node) {
        fns = ensAddr;
        rootNode = node;
    }

    /**
     * Register a name, or change the owner of an existing registration.
     * @param label The hash of the label to register.
     * @param owner The address of the new owner.
     */
    function register(bytes32 label, address owner) public only_owner(label) {
        fns.setSubnodeOwner(rootNode, label, owner);
    }
}
