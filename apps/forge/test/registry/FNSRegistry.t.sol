// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/registry/FNSRegistry.sol";

contract TestFNSRegistry is Test {
    FNSRegistry public fnsRegistry;
    bytes32 constant rootNode = 0x0;
    address constant addr = 0x0000000000000000000000000000000000001234;

    function setUp() public {
        fnsRegistry = new FNSRegistry();
    }

    // Original FNS test: 'should allow ownership transfers'
    function testAllowOwnershipTransfer() public {
        fnsRegistry.setOwner(rootNode, addr);
        assertEq(addr, fnsRegistry.owner(rootNode));
    }

    // Original FNS test: 'should prohibit transfers by non-owners'
    function testCannotTransferAsNonOwner() public {
        bytes32 unOwnedNode = bytes32(uint256(0x1));
        vm.expectRevert();
        fnsRegistry.setOwner(unOwnedNode, addr);
    }

    // Original FNS test: 'should allow setting resolvers'
    function testAllowSettingResolvers() public {
        fnsRegistry.setResolver(rootNode, addr);
        assertEq(fnsRegistry.resolver(rootNode), addr);
    }

    // Original FNS test: 'should prevent setting resolvers by non-owners'
    function testCannotSetResolversAsNonOwner() public {
        bytes32 unOwnedNode = bytes32(uint256(0x1));
        vm.expectRevert();
        fnsRegistry.setResolver(unOwnedNode, addr);
    }

    // Original FNS test: 'should allow setting the TTL'
    function testAllowSettingTTL() public {
        fnsRegistry.setTTL(rootNode, 3600);
        assertEq(fnsRegistry.ttl(rootNode), uint64(3600));
    }

    // Original FNS test: 'should prevent setting the TTL by non-owners'
    function testCannotSetTTLAsNonOwner() public {
        vm.expectRevert();
        fnsRegistry.setTTL("0x1", 3600);
    }

    // Original FNS test: 'should allow the creation of subnodes'
    function testAllowCreatingSubnodes() public {
        fnsRegistry.setSubnodeOwner(rootNode, sha256("label"), addr);

        // Manually perform the same hashing alg that setSubnodeOwner performs (namehash?)
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, sha256("label")));
        assertEq(fnsRegistry.owner(subnode), addr);
    }

    // Original FNS test: 'should prohibit subnode creation by non-owners'
    function testCannotCreateSubnodesAsNonOwner() public {
        bytes32 label = sha256("label"); // must be done early to avoid expectRevert on sha256
        vm.expectRevert();
        vm.prank(address(0));
        fnsRegistry.setSubnodeOwner(rootNode, label, addr);
    }

    // Original FNS test: 'should allow setting the record' in ENSRegistryWithFallback
    function testAllowSettingRecord() public {
        address newOwner = address(1);
        address newResolver = address(2);
        uint64 newTTL = 3600;

        fnsRegistry.setRecord(rootNode, newOwner, newResolver, newTTL);
        assertEq(fnsRegistry.owner(rootNode), newOwner);
        assertEq(fnsRegistry.resolver(rootNode), newResolver);
        assertEq(fnsRegistry.ttl(rootNode), newTTL);
    }

    // Original FNS test: 'should allow setting subnode records' in ENSRegistryWithFallback
    function testAllowSettingSubnodeRecords() public {
        bytes32 subnodeLabel = sha256("label");
        address newOwner = address(1);
        address newResolver = address(2);
        uint64 newTTL = 3600;

        fnsRegistry.setSubnodeRecord(rootNode, subnodeLabel, newOwner, newResolver, newTTL);

        // Manually perform the same hashing alg that setSubnodeOwner performs (namehash?)
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, sha256("label")));

        assertEq(fnsRegistry.owner(subnode), newOwner);
        assertEq(fnsRegistry.resolver(subnode), newResolver);
        assertEq(fnsRegistry.ttl(subnode), newTTL);
    }

    // Original FNS test: 'should implement authorisations/operators' in ENSRegistryWithFallback
    // NOTE: This has been rewritten to actually test that the new operator can succesfully update
    //       the owner of an FNS record they don't own (one that has been delegated to them with
    //       3rd party rights)
    // TODO: Make a negative test for this same pattern
    function testAllowSetApprovalForAll() public {
        fnsRegistry.setApprovalForAll(addr, true);

        vm.prank(addr);
        fnsRegistry.setOwner(rootNode, address(2));

        assertEq(fnsRegistry.owner(rootNode), address(2));
    }
}
