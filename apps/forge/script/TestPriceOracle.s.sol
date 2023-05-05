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
import "fns/flr-registrar/mock/MockStablePriceOracle.sol";
import "fns/flr-registrar/IPriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/FNSNamehash.sol";

contract TestPriceOracle is Script {
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    bytes32 constant rootNode = 0x0;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        FLRRegistrarController flrRegistrarController =
            FLRRegistrarController(0x57798c5b167386fEbc0fC7C7ad5Da41aD1a2a238);
        MockStablePriceOracle stablePriceOracle = MockStablePriceOracle(0xB6CF79583256858c385FD56bFC7210bf1ade05a0);

        IPriceOracle.Price memory price = flrRegistrarController.rentPrice("a", stablePriceOracle.secondsPerYear());
        console.log("Price for 'a'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice("simone", stablePriceOracle.secondsPerYear());
        console.log("Price for 'simone'");
        console.logUint(price.base);
        console.logUint(price.premium);

        vm.stopBroadcast();
    }
}
