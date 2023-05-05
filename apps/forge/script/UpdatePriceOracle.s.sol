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
import "fns/flr-registrar/IPriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/FNSNamehash.sol";

contract UpdatePriceOracle is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        uint256 deployerAddress = vm.envUint("DEPLOYER_ADDRESS");
        vm.startBroadcast(deployerPrivateKey);

        // FNSRegistry fnsRegistry = FNSRegistry(0x8E60eEeB7634930bba7a9d74f01Af9c9e78c9063);
        // BaseRegistrar baseRegistrar = BaseRegistrar(0x7113e298973444eCC1c52bDdA92B2Ad5d5399426);
        FLRRegistrarController flrRegistrarController =
            FLRRegistrarController(0xD12560b5cf53055cf4717bA609b69914b816C8CA);

        console.log("FLRRegistrarController owner=%s", flrRegistrarController.owner());

        StablePriceOracle stablePriceOracle = new StablePriceOracle(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
            [uint256(5), 4, 3, 2, 1],
            "C2FLR");

        console.log("Stable Price Oracle Deployed to: %s", address(stablePriceOracle));

        flrRegistrarController.setPriceOracle(IPriceOracle(stablePriceOracle));

        IPriceOracle.Price memory price = flrRegistrarController.rentPrice("a", stablePriceOracle.secondsPerYear());
        console.log("Price for 'a'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice("ab", stablePriceOracle.secondsPerYear());
        console.log("Price for 'ab'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice("abc", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abc'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice("abcd", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcd'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice("abcde", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcde'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice("abcdef", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcdef'");
        console.logUint(price.base);
        console.logUint(price.premium);

        vm.stopBroadcast();
    }
}
