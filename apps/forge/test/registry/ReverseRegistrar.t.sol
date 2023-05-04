// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "fns/registry/ReverseRegistrar.sol";
import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/resolvers/mocks/DummyNameWrapper.sol";
import "fns/wrapper/INameWrapper.sol";

import "fns-test/utils/FNSNamehash.sol";
import "fns-test/utils/HardhatAddresses.sol";

contract TestReverseRegistrar is Test {
    FNSRegistry public fnsRegistry;
    ReverseRegistrar public reverseRegistrar;
    ReverseRegistrar public dummyOwnableContract;
    PublicResolver public publicResolver;
    DummyNameWrapper public nameWrapper;

    bytes32 constant rootNode = 0x0;

    // Call solidity implementation of the expected normalized & namehashed reverseNode
    // hash for the given addresses
    bytes32 thisReverseNode = FNSNamehash.getReverseNode(address(this));
    bytes32 addr0ReverseNode = FNSNamehash.getReverseNode(address0);
    bytes32 addr1ReverseNode = FNSNamehash.getReverseNode(address1);
    bytes32 addr2ReverseNode = FNSNamehash.getReverseNode(address2);
    bytes32 dummyOwnableReverseNode;

    function setUp() public {
        fnsRegistry = new FNSRegistry();
        nameWrapper = new DummyNameWrapper();
        reverseRegistrar = new ReverseRegistrar(fnsRegistry);

        // Setup another ReverseRegistrar as a dummy ownable contract, because it is ownable
        dummyOwnableContract = new ReverseRegistrar(fnsRegistry);
        dummyOwnableReverseNode = FNSNamehash.getReverseNode(address(dummyOwnableContract));

        // A mocked nameWrapper is used here to always return the caller's address for 'ownerOf'
        publicResolver = new PublicResolver(
            fnsRegistry,
            INameWrapper(address(nameWrapper)),
            0x0000000000000000000000000000000000000000,
            address(reverseRegistrar));

        reverseRegistrar.setDefaultResolver(address(publicResolver));

        // TODO: Why is it necessary to own the 'reverse' subnode here?
        fnsRegistry.setSubnodeOwner(rootNode, keccak256("reverse"), address(this));

        // This makes sense to own, because the reverseRegistrar should control that node
        fnsRegistry.setSubnodeOwner(FNSNamehash.namehash("reverse"), keccak256("addr"), address(reverseRegistrar));

        console.log("Pre-computed reverseNodes");
        console.logBytes32(thisReverseNode);
        console.logBytes32(addr0ReverseNode);
        console.logBytes32(addr1ReverseNode);
        console.logBytes32(addr2ReverseNode);
    }

    // Original Test: 'should calculate node hash correctly'
    function testShouldCalcNodeHashCorrectly() public {
        assertEq(reverseRegistrar.node(address(this)), thisReverseNode);
        assertEq(reverseRegistrar.node(address0), addr0ReverseNode);
        assertEq(reverseRegistrar.node(address1), addr1ReverseNode);
        assertEq(reverseRegistrar.node(address2), addr2ReverseNode);
    }

    // Original Test: 'claim'::'allows an account to claim its address'
    function testClaimAllowsAccountToClaimItsAddress() public {
        bytes32 nodehash = reverseRegistrar.claim(address1);
        assertEq(nodehash, thisReverseNode);
        assertEq(fnsRegistry.owner(thisReverseNode), address1);
    }

    // Original Test: 'claim'::'event ReverseClaimed is emitted'
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

    // Original Test: 'claimForAddr'::'allows an account to claim its address'
    function testClaimForAddrAllowsAccountToClaimItsAddress() public {
        bytes32 nodehash = reverseRegistrar.claimForAddr(address(this), address1, address(publicResolver));
        assertEq(nodehash, thisReverseNode);
        assertEq(fnsRegistry.owner(thisReverseNode), address1);
    }

    // Original Test: 'claimForAddr'::'event ReverseClaimed is emitted'
    function testClaimForAddrEventReverseClaimedIsEmitted() public {
        vm.expectEmit(true, true, false, true, address(reverseRegistrar));

        // We emit the event that we expect to see
        // NOTE: The event emitted will be the reverse being claimed for the caller,
        //       not the new owner
        emit ReverseClaimed(address(this), thisReverseNode);

        // Then we perform the call
        reverseRegistrar.claimForAddr(address(this), address1, address(publicResolver));
    }

    // Original Test: 'claimForAddr'::'forbids an account to claim another address'
    function testClaimForAddrForbidsAccountClaimingAnotherAddress() public {
        vm.expectRevert();
        reverseRegistrar.claimForAddr(address1, address(this), address(publicResolver));
    }

    // Original Test: 'claimForAddr'::'allows an authorised account to claim a different address'
    function testClaimForAddrAllowsAuthorisedAccountToClaimDifferentAddress() public {
        // First, grant approval on this test contract from address1 as sender
        vm.prank(address1);
        fnsRegistry.setApprovalForAll(address(this), true);

        reverseRegistrar.claimForAddr(address1, address2, address(publicResolver));
        assertEq(fnsRegistry.owner(addr1ReverseNode), address2);
    }

    // Original Test: 'claimForAddr'::'allows a controller to claim a different address'
    function testClaimForAddrAllowsControllerClaimDifferentAddress() public {
        reverseRegistrar.setController(address(this), true);
        reverseRegistrar.claimForAddr(address1, address2, address(publicResolver));
        assertEq(fnsRegistry.owner(addr1ReverseNode), address2);
    }

    // Original Test: 'claimForAddr'::'allows an owner() of a contract to claim the reverse node of that contract'
    function testClaimForAddrAllowsContractOwnerToClaimReverseNodeOfContract() public {
        reverseRegistrar.setController(address(this), true);
        reverseRegistrar.claimForAddr(address(dummyOwnableContract), address(this), address(publicResolver));
        assertEq(fnsRegistry.owner(dummyOwnableReverseNode), address(this));
    }

    // Original Test: 'claimWithResolver'::'allows an account to specify resolver'
    function testClaimWithResolverAllowsAccountToSpecifyResolver() public {
        reverseRegistrar.claimWithResolver(address1, address2);
        assertEq(fnsRegistry.owner(thisReverseNode), address1);
        assertEq(fnsRegistry.resolver(thisReverseNode), address2);
    }

    // Original Test: 'claimWithResolver'::'event ReverseClaimed is emitted'
    function testClaimWithResolverEventReverseClaimedIsEmitted() public {
        vm.expectEmit(true, true, false, true, address(reverseRegistrar));

        // We emit the event that we expect to see
        // NOTE: The event emitted will be the reverse being claimed for the caller,
        //       not the new owner
        emit ReverseClaimed(address(this), thisReverseNode);

        reverseRegistrar.claimWithResolver(address1, address2);
    }

    // Original Test: 'setName'::'sets name records'
    function testSetNameSetsNameRecords() public {
        reverseRegistrar.setName("testname");
        assertEq(fnsRegistry.resolver(thisReverseNode), address(publicResolver));
        assertEq(publicResolver.name(thisReverseNode), "testname");
    }

    // Original Test: 'setName'::'event ReverseClaimed is emitted'
    function testSetNameEventReverseClaimedIsEmitted() public {
        vm.expectEmit(true, true, false, true, address(reverseRegistrar));

        // We emit the event that we expect to see
        // NOTE: The event emitted will be the reverse being claimed for the caller,
        //       not the new owner
        emit ReverseClaimed(address(this), thisReverseNode);

        reverseRegistrar.setName("testname");
    }

    // Original Test: 'setNameForAddr'::'allows controller to set name records for other accounts'
    function testSetNameForAddrAllowControllerToSetNameRecordsOnOtherAccounts() public {
        reverseRegistrar.setController(address(this), true);
        reverseRegistrar.setNameForAddr(address1, address(this), address(publicResolver), "testname");
        assertEq(fnsRegistry.resolver(addr1ReverseNode), address(publicResolver));
        assertEq(publicResolver.name(addr1ReverseNode), "testname");
    }

    // Original Test: 'setNameForAddr'::'event ReverseClaimed is emitted'
    function testSetNameForAddrEventReverseClaimedIsEmitted() public {
        vm.expectEmit(true, true, false, true, address(reverseRegistrar));
        emit ReverseClaimed(address(this), thisReverseNode);
        reverseRegistrar.setNameForAddr(address(this), address(this), address(publicResolver), "testname");
    }

    // Original Test: 'setNameForAddr'::'forbids non-controller if address is different from sender and not authorised'
    function testSetNameForAddrForbidsNonControllerIfNonSenderAddressAndNotAuthorised() public {
        vm.expectRevert();
        reverseRegistrar.setNameForAddr(address1, address(this), address(publicResolver), "testname");
    }

    // Original Test: 'setNameForAddr'::'allows name to be set for an address if the sender is the address'
    function testSetNameForAddrAllowsSettingNameForAnAddressIfSenderIsTheAddress() public {
        reverseRegistrar.setNameForAddr(address(this), address(this), address(publicResolver), "testname");
        assertEq(fnsRegistry.resolver(thisReverseNode), address(publicResolver));
        assertEq(publicResolver.name(thisReverseNode), "testname");
    }

    // Original Test: 'setNameForAddr'::'allows name to be set for an address if the sender is authorised'
    function testSetNameForAddrAllowSettingNameForAnAddressIfSenderIsAuthorised() public {
        fnsRegistry.setApprovalForAll(address1, true);
        reverseRegistrar.setNameForAddr(address(this), address(this), address(publicResolver), "testname");
        assertEq(fnsRegistry.resolver(thisReverseNode), address(publicResolver));
        assertEq(publicResolver.name(thisReverseNode), "testname");
    }

    // Original Test: 'setNameForAddr'::'allows an owner() of a contract to claimWithResolverForAddr on behalf of the contract'
    function testSetNameForAddrAllowOwnerOfContractToClaimWithResolverForAddrOnBehalfOfContract() public {
        string memory name = "dummyownable.flr";
        reverseRegistrar.setNameForAddr(address(dummyOwnableContract), address(this), address(publicResolver), name);
        assertEq(fnsRegistry.owner(dummyOwnableReverseNode), address(this));
        assertEq(publicResolver.name(dummyOwnableReverseNode), name);
    }

    // Original Test: 'setController'::'forbid non-owner from setting a controller'
    function testSetControllerForbidNonOwnerFromSettingController() public {
        vm.expectRevert();
        vm.prank(address1);
        reverseRegistrar.setController(address1, true);
    }
}
