pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/flr-registrar/mock/MockStablePriceOracle.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";

contract TestStablePriceOracle is Script {
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    bytes32 constant rootNode = 0x0;

    // Entrypoint to deploy script
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // MockStablePriceOracle stablePriceOracle = new MockStablePriceOracle(
        //     0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
        //     [uint256(5), 4, 3, 2, 1]);

        MockStablePriceOracle stablePriceOracle = MockStablePriceOracle(0xB6CF79583256858c385FD56bFC7210bf1ade05a0);      
        FLRRegistrarController flrRegistrarController = FLRRegistrarController(0x57798c5b167386fEbc0fC7C7ad5Da41aD1a2a238);

        IPriceOracle.Price memory price = stablePriceOracle.price(
            "a", 0, stablePriceOracle.secondsPerYear());
        console.log("Price for 'a'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = stablePriceOracle.price(
            "ab", 0, stablePriceOracle.secondsPerYear());
        console.log("Price for 'ab'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = stablePriceOracle.price(
            "abc", 0, stablePriceOracle.secondsPerYear());
        console.log("Price for 'abc'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = stablePriceOracle.price(
            "abcd", 0, stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcd'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = stablePriceOracle.price(
            "abcde", 0, stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcde'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = stablePriceOracle.price(
            "abcdef", 0, stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcdef'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        console.log("============");

        price = flrRegistrarController.rentPrice(
            "a", stablePriceOracle.secondsPerYear());
        console.log("Price for 'a'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = flrRegistrarController.rentPrice(
            "ab", stablePriceOracle.secondsPerYear());
        console.log("Price for 'ab'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = flrRegistrarController.rentPrice(
            "abc", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abc'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = flrRegistrarController.rentPrice(
            "abcd", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcd'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = flrRegistrarController.rentPrice(
            "abcde", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcde'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        price = flrRegistrarController.rentPrice(
            "abcdef", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcdef'");
        console.logUint(price.base);
        console.logUint(price.base / (10 ** 18));

        console.log(address(flrRegistrarController.priceOracle()));

        vm.stopBroadcast();
    }
}