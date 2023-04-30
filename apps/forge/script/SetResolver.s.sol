pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";
import "fns/flr-registrar/mock/MockStablePriceOracle.sol";
import "fns/flr-registrar/IPriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/ENSNamehash.sol";

contract SetResolver is Script {
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    bytes32 constant rootNode = 0x0;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address publicResolver = 0xAA8ED66a4F725F72032e1DAD66Fd67ec6aDf5e12;
        address simoneWallet = 0x8D37cb3624e1CB8480DceCC7884330a0449Dd9f0;

        ReverseRegistrar reverseRegistrar = ReverseRegistrar(0x7E0079327c621Ff30F40800f21BCeC2B0eFbAC6E);
        reverseRegistrar.setDefaultResolver(publicResolver);

        reverseRegistrar.claimForAddr(
            simoneWallet,
            simoneWallet,
            publicResolver);
        reverseRegistrar.setNameForAddr(
            simoneWallet,
            simoneWallet,
            publicResolver,
            "simone"
        );

        vm.stopBroadcast();
    }
}