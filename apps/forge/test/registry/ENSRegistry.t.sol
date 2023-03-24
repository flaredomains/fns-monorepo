// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/registry/ENSRegistry.sol";

contract TestENSRegistry is Test {
    ENSRegistry public ensRegistry;
    bytes32 constant rootNode = 0x0;
    address constant addr = 0x0000000000000000000000000000000000001234;

    function setUp() public {
        ensRegistry = new ENSRegistry();
    }

    // Original ENS test: 'should allow ownership transfers'
    function testAllowOwnershipTransfer() public {
        ensRegistry.setOwner(rootNode, addr);
        assertEq(addr, ensRegistry.owner(rootNode));
    }

    // Original ENS test: 'should prohibit transfers by non-owners'
    function testCannotTransferAsNonOwner() public {
        bytes32 unOwnedNode = bytes32(uint256(0x1));
        vm.expectRevert();
        ensRegistry.setOwner(unOwnedNode, addr);
    }

    // Original ENS test: 'should allow setting resolvers'
    function testAllowSettingResolvers() public {
        ensRegistry.setResolver(rootNode, addr);
        assertEq(ensRegistry.resolver(rootNode), addr);
    }

    // Original ENS test: 'should prevent setting resolvers by non-owners'
    function testCannotSetResolversAsNonOwner() public {
        bytes32 unOwnedNode = bytes32(uint256(0x1));
        vm.expectRevert();
        ensRegistry.setResolver(unOwnedNode, addr);
    }

    // Original ENS test: 'should allow setting the TTL'
    function testAllowSettingTTL() public {
        ensRegistry.setTTL(rootNode, 3600);
        assertEq(ensRegistry.ttl(rootNode), uint64(3600));
    }

    // Original ENS test: 'should prevent setting the TTL by non-owners'
    function testCannotSetTTLAsNonOwner() public {
        vm.expectRevert();
        ensRegistry.setTTL('0x1', 3600);
    }

    // Original ENS test: 'should allow the creation of subnodes'
    function testAllowCreatingSubnodes() public {
        ensRegistry.setSubnodeOwner(rootNode, sha256('label'), addr);

        // Manually perform the same hashing alg that setSubnodeOwner performs (namehash?)
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, sha256('label')));
        assertEq(ensRegistry.owner(subnode), addr);
    }

    // Original ENS test: 'should prohibit subnode creation by non-owners'
    function testCannotCreateSubnodesAsNonOwner() public {
        bytes32 label = sha256('label'); // must be done early to avoid expectRevert on sha256
        vm.expectRevert();
        vm.prank(address(0));
        ensRegistry.setSubnodeOwner(rootNode, label, addr);
    }

    // Original ENS test: 'should allow setting the record' in ENSRegistryWithFallback
    function testAllowSettingRecord() public {
        address newOwner = address(1);
        address newResolver = address(2);
        uint64 newTTL = 3600;

        ensRegistry.setRecord(rootNode, newOwner, newResolver, newTTL);
        assertEq(ensRegistry.owner(rootNode), newOwner);
        assertEq(ensRegistry.resolver(rootNode), newResolver);
        assertEq(ensRegistry.ttl(rootNode), newTTL);
    }

    // Original ENS test: 'should allow setting subnode records' in ENSRegistryWithFallback
    function testAllowSettingSubnodeRecords() public {
        bytes32 subnodeLabel = sha256('label');
        address newOwner = address(1);
        address newResolver = address(2);
        uint64 newTTL = 3600;

        ensRegistry.setSubnodeRecord(rootNode, subnodeLabel, newOwner, newResolver, newTTL);

        // Manually perform the same hashing alg that setSubnodeOwner performs (namehash?)
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, sha256('label')));

        assertEq(ensRegistry.owner(subnode), newOwner);
        assertEq(ensRegistry.resolver(subnode), newResolver);
        assertEq(ensRegistry.ttl(subnode), newTTL);
    }

    // Original ENS test: 'should implement authorisations/operators' in ENSRegistryWithFallback
    // NOTE: This has been rewritten to actually test that the new operator can succesfully update
    //       the owner of an ENS record they don't own (one that has been delegated to them with
    //       3rd party rights)
    // TODO: Make a negative test for this same pattern
    function testAllowSetApprovalForAll() public {
        ensRegistry.setApprovalForAll(addr, true);

        vm.prank(addr);
        ensRegistry.setOwner(rootNode, address(2));

        assertEq(ensRegistry.owner(rootNode), address(2));
    }
}