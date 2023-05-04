pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";
import "fns/flr-registrar/StablePriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";

import "fns-test/utils/FNSNamehash.sol";

// FlexiPunkTLD Contract: 0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a

contract CreateDomain is Script {
    address constant destination = 0x8D37cb3624e1CB8480DceCC7884330a0449Dd9f0;
    address constant owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2;
    bytes32 constant rootNode = 0x0;

    string constant name = 'simone2';

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        FNSRegistry fnsRegistry = FNSRegistry(0x8E60eEeB7634930bba7a9d74f01Af9c9e78c9063);
        BaseRegistrar baseRegistrar = BaseRegistrar(0x7113e298973444eCC1c52bDdA92B2Ad5d5399426);
        
        baseRegistrar.register(name, destination, 365 days);

        // require(fnsRegistry.owner(FNSNamehash.namehash('simone.flr')) == owner, "Owner not expected");
        // require(baseRegistrar.ownerOf(uint256(keccak256(name))) == owner, "Owner not expected");

        // baseRegistrar.transferFrom(owner, destination, uint256(keccak256(name)));

        // require(fnsRegistry.owner(FNSNamehash.namehash('simone.flr')) == destination, "destination not expected");
        
        console.log(baseRegistrar.ownerOf(uint256(keccak256(bytes(name)))));
        require(baseRegistrar.ownerOf(uint256(keccak256(bytes(name)))) == destination, "destination not expected");

        vm.stopBroadcast();
    }
}
