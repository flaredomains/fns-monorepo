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

import "fns-test/utils/FNSNamehash.sol";

contract UpdatePriceOracle is Script {
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    bytes32 constant rootNode = 0x0;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // FNSRegistry fnsRegistry = FNSRegistry(0x8E60eEeB7634930bba7a9d74f01Af9c9e78c9063);
        // BaseRegistrar baseRegistrar = BaseRegistrar(0x7113e298973444eCC1c52bDdA92B2Ad5d5399426);
        FLRRegistrarController flrRegistrarController = FLRRegistrarController(0x57798c5b167386fEbc0fC7C7ad5Da41aD1a2a238);

        console.log(flrRegistrarController.owner());
        flrRegistrarController.transferOwnership(owner);
        console.log(flrRegistrarController.owner());

        MockStablePriceOracle stablePriceOracle = new MockStablePriceOracle(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
            [uint256(5), 4, 3, 2, 1]);

        console.log("Stable Price Oracle Deployed to: %s", address(stablePriceOracle));

        flrRegistrarController.setPriceOracle(IPriceOracle(stablePriceOracle));

        IPriceOracle.Price memory price = flrRegistrarController.rentPrice(
            "a", stablePriceOracle.secondsPerYear());
        
        console.log("Price for 'a'");
        console.logUint(price.base);
        console.logUint(price.premium);

        vm.stopBroadcast();
    }
}