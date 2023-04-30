// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/registry/ENSRegistry.sol";
import "fns/no-collisions/NoNameCollisions.sol";
import "fns/no-collisions/mocks/MockPunkTLD.sol";

import "@punkdomains/interfaces/IBasePunkTLD.sol";

import "fns-test/utils/ENSNamehash.sol";
import "fns-test/utils/HardhatAddresses.sol";

address constant ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
// Set Timestamp to something reasonable (3/9/23 @ 1:25pm) so that BaseRegistrar time
// keeping works correctly. Forge defaults this to 1
uint256 constant TIME_STAMP = 1678393495;

contract TestBaseRegistrar is Test {
    BaseRegistrar public registrar;
    ENSRegistry public ens;
    NoNameCollisions public noNameCollisions;

    address immutable ownerAccount = address(this);
    address constant controllerAccount = address0;
    address constant registrantAccount = address1;
    address constant otherAccount = address2;

    function setUp() public {
        ens = new ENSRegistry();
        MockPunkTLD mockPunkTLD = new MockPunkTLD();
        noNameCollisions = new NoNameCollisions(address(mockPunkTLD));
        registrar = new BaseRegistrar(ens, ENSNamehash.namehash('eth'), noNameCollisions);

        registrar.addController(controllerAccount);
        ens.setSubnodeOwner(0x0, keccak256('eth'), address(registrar));

        vm.warp(TIME_STAMP);
    }

    // Original Test: 'should allow new registrations'
    function testAllowNewRegistrations() public {
        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        assertEq(ens.owner(ENSNamehash.namehash('newname.eth')), registrantAccount);
        assertEq(registrar.ownerOf(uint256(keccak256('newname'))), registrantAccount);
        assertEq(registrar.nameExpires(uint256(keccak256('newname'))), TIME_STAMP + 86400);
    }

    // Original Test: 'should allow registrations without updating the registry'
    function testAllowRegistrationsWithoutUpdatingRegistry() public {
        vm.prank(controllerAccount);
        registrar.registerOnly('silentname', registrantAccount, 86400);
        assertEq(ens.owner(ENSNamehash.namehash('silentname.eth')), ZERO_ADDRESS);
        assertEq(registrar.ownerOf(uint256(keccak256('silentname'))), registrantAccount);
        assertEq(registrar.nameExpires(uint256(keccak256('silentname'))), TIME_STAMP + 86400);
    }

    // Original Test: 'should allow renewals'
    function testAllowRenewals() public {
        uint256 id = uint256(keccak256('newname'));

        vm.startPrank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        uint256 oldExpires = registrar.nameExpires(id);
        registrar.renew(id, 86400);

        assertEq(registrar.nameExpires(id), oldExpires + 86400);

        vm.stopPrank();
    }

    // Original Test: 'should only allow the controller to register'
    function testFail_OnlyAllowControllerToRegister() public {
        vm.prank(otherAccount);
        registrar.register('foo', otherAccount, 86400);
    }

    // Original Test: 'should only allow the controller to renew'
    function testFail_OnlyAllowControllerToRenew() public {
        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);    

        vm.prank(otherAccount);
        registrar.renew(uint256(keccak256('newname')), 86400);
    }

    // Original Test: 'should not permit registration of already registered names'
    function testFail_ShouldNotPremitRegistrationOfAlreadyRegisteredNames() public {
        vm.startPrank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);
        registrar.register('newname', otherAccount, 86400);
    }

    // Original Test: 'should not permit renewing a name that is not registered'
    function testFail_ShouldNotPermitRenewingRegisteredName() public {
        vm.prank(controllerAccount);
        registrar.renew(uint256(keccak256('non-registered-name')), 86400);
    }

    // Original Test: 'should permit the owner to reclaim a name'
    function testShouldPermitOwnerToReclaimName() public {
        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        // Make ZERO_ADDRESS the owner of newname.eth
        ens.setSubnodeOwner(0x0, keccak256('eth'), address(this));
        ens.setSubnodeOwner(ENSNamehash.namehash('eth'), keccak256('newname'), ZERO_ADDRESS);
        assertEq(ens.owner(ENSNamehash.namehash('newname.eth')), ZERO_ADDRESS);

        // Now attempt reclaim from registrantAccount
        ens.setSubnodeOwner(0x0, keccak256('eth'), address(registrar));
        vm.prank(registrantAccount);
        registrar.reclaim(uint256(keccak256('newname')), registrantAccount);

        assertEq(ens.owner(ENSNamehash.namehash('newname.eth')), registrantAccount);
    }

    // Original Test: 'should prohibit anyone else from reclaiming a name'
    function testFail_ShouldProhibitAnyoneElseFromReclaimingName() public {
        vm.prank(otherAccount);
        registrar.reclaim(uint256(keccak256('newname')), registrantAccount);
    }

    // Original Test: 'should permit the owner to transfer a registration'
    // TODO: Determine cause of failure
    function testShouldPermitOwnerToTransferRegistration() public {
        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        vm.prank(registrantAccount);
        registrar.transferFrom(registrantAccount, otherAccount, uint256(keccak256('newname')));

        assertEq(registrar.ownerOf(uint256(keccak256('newname'))), otherAccount);
        assertEq(ens.owner(ENSNamehash.namehash('newname.eth')), registrantAccount);

        vm.prank(otherAccount);
        registrar.transferFrom(otherAccount, registrantAccount, uint256(keccak256('newname')));
    }

    // Original Test: 'should prohibit anyone else from transferring a registration'
    function testFail_ShouldProhibitOthersFromTransferringRegistration() public {
        vm.prank(otherAccount);
        registrar.transferFrom(otherAccount, otherAccount, uint256(keccak256('newname')));
    }

    // Original Test: 'should not permit transfer or reclaim during the grace period'
    function testFail_ShouldNotPermitTransferDuringGracePeriod() public {
        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        skip(registrar.nameExpires(uint256(keccak256('newname'))) - block.timestamp + 3600);

        vm.prank(registrantAccount);
        registrar.transferFrom(registrantAccount, otherAccount, uint256(keccak256('newname')));
    }

    function testFail_ShouldNotPermitReclaimDuringGracePeriod() public {
        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        skip(registrar.nameExpires(uint256(keccak256('newname'))) - block.timestamp + 3600);

        vm.prank(registrantAccount);
        registrar.reclaim(uint256(keccak256('newname')), registrantAccount);
    }

    // Original Test: 'should allow renewal during the grace period'
    function testAllowRenewalDuringGracePeriod() public {
        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        vm.prank(controllerAccount);
        registrar.renew(uint256(keccak256('newname')), 86400);
    }

    // Original Test: 'should allow registration of an expired domain'
    function testShouldAllowRegistrationOfExpiredDomain() public {
        uint256 newnameId = uint256(keccak256('newname'));

        vm.prank(controllerAccount);
        registrar.register('newname', registrantAccount, 86400);

        uint256 expires = registrar.nameExpires(newnameId);
        uint256 grace = registrar.GRACE_PERIOD();
        skip(expires - block.timestamp + grace + 3600);

        // Ensure there's no owner after it has expired
        vm.expectRevert();
        registrar.ownerOf(newnameId);

        vm.prank(controllerAccount);
        registrar.register('newname', otherAccount, 86400);
        assertEq(registrar.ownerOf(newnameId), otherAccount);
    }

    // Original Test: 'should allow the owner to set a resolver address'
    function testShouldAllowOwnerToSetResolverAddress() public {
        vm.prank(ownerAccount);
        registrar.setResolver(registrantAccount);
        assertEq(ens.resolver(ENSNamehash.namehash('eth')), registrantAccount);
    }
}