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
    ReverseRegistrar public dummyOwnableContract;
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
    bytes32 dummyOwnableReverseNode;

    function setUp() public {
        ensRegistry = new ENSRegistry();
        nameWrapper = new DummyNameWrapper();
        reverseRegistrar = new ReverseRegistrar(ensRegistry);

        // Setup another ReverseRegistrar as a dummy ownable contract, because it is ownable
        dummyOwnableContract = new ReverseRegistrar(ensRegistry);
        dummyOwnableReverseNode = ENSNamehash.getReverseNode(address(dummyOwnableContract));

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

    // Original ENS test: 'should calculate node hash correctly'
    function testShouldCalcNodeHashCorrectly() public {
        assertEq(reverseRegistrar.node(address(this)), thisReverseNode);
        assertEq(reverseRegistrar.node(address0), addr0ReverseNode);
        assertEq(reverseRegistrar.node(address1), addr1ReverseNode);
        assertEq(reverseRegistrar.node(address2), addr2ReverseNode);
    }

    // Original ENS test: 'claim'::'allows an account to claim its address'
    function testClaimAllowsAccountToClaimItsAddress() public {
        bytes32 nodehash = reverseRegistrar.claim(address1);
        assertEq(nodehash, thisReverseNode);
        assertEq(ensRegistry.owner(thisReverseNode), address1);
    }

    // Original ENS test: 'claim'::'event ReverseClaimed is emitted'
    event ReverseClaimed(address indexed addr, bytes32 indexed node);
    function testClaimEventReverseClaimedIsEmitted() public {
        vm.expectEmit(true, true, false, true, address(reverseRegistrar));

        // We emit the event that we expect to see
        // NOTE: The event emitted will be the reverse being claimed for the caller, 
        //       not the new owner
        emit ReverseClaimed(address(this), thisReverseNode);

        // Then we perform the call
        reverseRegistrar.claim(address1);
    }

    // Original ENS test: 'claimForAddr'::'allows an account to claim its address'
    function testClaimForAddrAllowsAccountToClaimItsAddress() public {
        bytes32 nodehash = reverseRegistrar.claimForAddr(address(this), address1, address(publicResolver));
        assertEq(nodehash, thisReverseNode);
        assertEq(ensRegistry.owner(thisReverseNode), address1);
    }

    // Original ENS test: 'claimForAddr'::'event ReverseClaimed is emitted'
    function testClaimForAddrEventReverseClaimedIsEmitted() public {
        vm.expectEmit(true, true, false, true, address(reverseRegistrar));

        // We emit the event that we expect to see
        // NOTE: The event emitted will be the reverse being claimed for the caller, 
        //       not the new owner
        emit ReverseClaimed(address(this), thisReverseNode);

        // Then we perform the call
        reverseRegistrar.claimForAddr(address(this), address1, address(publicResolver)); 
    }

    // Original ENS test: 'claimForAddr'::'forbids an account to claim another address'
    function testClaimForAddrForbidsAccountClaimingAnotherAddress() public {
        vm.expectRevert();
        reverseRegistrar.claimForAddr(address1, address(this), address(publicResolver));
    }

    // Original ENS test: 'claimForAddr'::'allows an authorised account to claim a different address'
    function testClaimForAddrAllowsAuthorisedAccountToClaimDifferentAddress() public {
        // First, grant approval on this test contract from address1 as sender
        vm.prank(address1);
        ensRegistry.setApprovalForAll(address(this), true);

        reverseRegistrar.claimForAddr(address1, address2, address(publicResolver));
        assertEq(ensRegistry.owner(addr1ReverseNode), address2);
    }
    
    // Original ENS test: 'claimForAddr'::'allows a controller to claim a different address'
    function testClaimForAddrAllowsControllerClaimDifferentAddress() public {
        reverseRegistrar.setController(address(this), true);
        reverseRegistrar.claimForAddr(address1, address2, address(publicResolver));
        assertEq(ensRegistry.owner(addr1ReverseNode), address2);
    }

    // Original ENS test: 'claimForAddr'::'allows an owner() of a contract to claim the reverse node of that contract'
    function testClaimForAddrAllowsContractOwnerToClaimReverseNodeOfContract() public {
        reverseRegistrar.setController(address(this), true);
        reverseRegistrar.claimForAddr(address(dummyOwnableContract), address(this), address(publicResolver));
        assertEq(ensRegistry.owner(dummyOwnableReverseNode), address(this));
    }



}