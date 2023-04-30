pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/flr-registrar/MintedDomainNames.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";
import "fns/flr-registrar/mock/MockStablePriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/ENSNamehash.sol";

contract DeployFNS is Script {
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    bytes32 constant rootNode = 0x0;

    // Entrypoint to deploy script
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        BaseRegistrar baseRegistrar = BaseRegistrar(0x5EaaB25F9646EcC3409871ae8805Af7CB40827fe);
        FLRRegistrarController flrRegistrarController = FLRRegistrarController(0x9e3dd48683455a66808bcF289BB76454b548009E);
        MintedDomainNames mintedDomainNames = MintedDomainNames(0xdE073A8EaDBAA39E164Ee29C18cBeBb6bEc6205a);
        MockStablePriceOracle stablePriceOracle = MockStablePriceOracle(0x9CBb680Ed793483f87aCa2D2B2bD2aE29ada4789);

        // Register some names to simone
        address simoneAddr = 0x8D37cb3624e1CB8480DceCC7884330a0449Dd9f0;
        baseRegistrar.register('simone', simoneAddr, 365 days);
        baseRegistrar.register('simone2', simoneAddr, 365 days);
        baseRegistrar.register('asdfasdf', simoneAddr, 365 days);
        baseRegistrar.register('elevate', simoneAddr, 365 days);
        baseRegistrar.register('italy', simoneAddr, 365 days);
        baseRegistrar.register('mtetna', simoneAddr, 365 days);
        baseRegistrar.register('trains', simoneAddr, 365 days);

        (IMintedDomainNames.Data[] memory domainNames, uint256 length) = mintedDomainNames.getAll(simoneAddr);

        IPriceOracle.Price memory price = flrRegistrarController.rentPrice(
            "a", stablePriceOracle.secondsPerYear());
        console.log("Price for 'a'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice(
            "ab", stablePriceOracle.secondsPerYear());
        console.log("Price for 'ab'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice(
            "abc", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abc'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice(
            "abcd", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcd'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice(
            "abcde", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcde'");
        console.logUint(price.base);
        console.logUint(price.premium);

        price = flrRegistrarController.rentPrice(
            "abcdef", stablePriceOracle.secondsPerYear());
        console.log("Price for 'abcdef'");
        console.logUint(price.base);
        console.logUint(price.premium);

        vm.stopBroadcast();

        for(uint i = 0; i < domainNames.length; ++i) {
            console.log(
                "domainNames: id => %s, expiry => %d, label => %s",
                domainNames[i].id,
                domainNames[i].expiry,
                domainNames[i].label);
        }
    }
}