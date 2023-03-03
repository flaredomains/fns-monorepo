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

contract TestReverseRegistrar is Test {
    ENSRegistry public ensRegistry;
    ReverseRegistrar public reverseRegistrar;
    PublicResolver public publicResolver;
    DummyNameWrapper public nameWrapper;

    ReverseRegistrar public dummyOwnableReverseRegistrar;

    bytes32 constant rootNode = 0x0;
    address constant addr = 0x0000000000000000000000000000000000001234;

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
        ensRegistry.setSubnodeOwner(rootNode, sha256('reverse'), address(this));

        // This makes sense to own, because the reverseRegistrar should control that node
        ensRegistry.setSubnodeOwner(
            ENSNamehash.namehash('reverse'),
            sha256('addr'),
            address(reverseRegistrar));
    }

    function testShouldCalcNodeHashCorrectly() public {
        // First, call a solidity implementation of the expected normalized & namehashed reverseNode
        // hash for the given address
        bytes32 expectedReverseNode = ENSNamehash.getReverseNode(address(this));
        assertEq(reverseRegistrar.node(address(this)), expectedReverseNode);
    }
}