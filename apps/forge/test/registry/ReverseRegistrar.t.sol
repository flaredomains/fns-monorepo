// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "fns/registry/ReverseRegistrar.sol";
import "fns/registry/ENSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/resolvers/mocks/DummyNameWrapper.sol";
import "fns/wrapper/INameWrapper.sol";

import "fns-test/utils/ENSNamehash.sol";
import "fns-test/utils/HardhatAddresses.sol";

contract TestReverseRegistrar is Test {
    ENSRegistry public ensRegistry;
    ReverseRegistrar public reverseRegistrar;
    PublicResolver public publicResolver;
    DummyNameWrapper public nameWrapper;

    ReverseRegistrar public dummyOwnableReverseRegistrar;

    bytes32 constant rootNode = 0x0;

    // Call solidity implementation of the expected normalized & namehashed reverseNode
    // hash for the given addresses
    bytes32 thisReverseNode = ENSNamehash.getReverseNode(address(this));
    bytes32 addr0ReverseNode = ENSNamehash.getReverseNode(address0);
    bytes32 addr1ReverseNode = ENSNamehash.getReverseNode(address1);
    bytes32 addr2ReverseNode = ENSNamehash.getReverseNode(address2);

    function setUp() public {

        ensRegistry = new ENSRegistry();
        nameWrapper = new DummyNameWrapper();
        reverseRegistrar = new ReverseRegistrar(ensRegistry);

        // A mocked nameWrapper is used here to always return the caller's address for 'ownerOf'
        publicResolver = new PublicResolver(
            ensRegistry,
            INameWrapper(address(nameWrapper)),
            0x0000000000000000000000000000000000000000,
            address(reverseRegistrar));

        reverseRegistrar.setDefaultResolver(address(publicResolver));

        // TODO: Why is it necessary to own the 'reverse' subnode here?
        ensRegistry.setSubnodeOwner(rootNode, keccak256('reverse'), address(this));

        // This makes sense to own, because the reverseRegistrar should control that node
        ensRegistry.setSubnodeOwner(
            ENSNamehash.namehash('reverse'),
            keccak256('addr'),
            address(reverseRegistrar));
        
        console.log("Pre-computed reverseNodes");
        console.logBytes32(thisReverseNode);
        console.logBytes32(addr0ReverseNode);
        console.logBytes32(addr1ReverseNode);
        console.logBytes32(addr2ReverseNode);
    }

    function testShouldCalcNodeHashCorrectly() public {
        assertEq(reverseRegistrar.node(address(this)), thisReverseNode);
        assertEq(reverseRegistrar.node(address0), addr0ReverseNode);
        assertEq(reverseRegistrar.node(address1), addr1ReverseNode);
        assertEq(reverseRegistrar.node(address2), addr2ReverseNode);
    }

    function testClaimAllowsAccountToClaimItsAddress() public {
        bytes32 nodehash = reverseRegistrar.claim(address1);
        assertEq(nodehash, thisReverseNode);
        assertEq(ensRegistry.owner(thisReverseNode), address1);
    }
}