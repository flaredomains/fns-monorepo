pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/wrapper/DynamicMetadataService.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";
import "fns/flr-registrar/StablePriceOracle.sol";
import "fns/flr-registrar/IPriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/FNSNamehash.sol";

contract UpdatePriceOracle is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("FLARE_DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NameWrapper nameWrapper = NameWrapper(0xA0A9b5B27D8dd064D0109501c1BFd61da17f2052);

        console.log("nameWrapper owner=%s", nameWrapper.owner());

        DynamicMetadataService dynamicMetadataService = new DynamicMetadataService(
            "https://arweave.net/OyKs3RptCvwmEg2I6bIBMeYIpuvZIzGUwjBOhn2WedQ");

        console.log("DynamicMetadataService Deployed to: %s", address(dynamicMetadataService));

        nameWrapper.setMetadataService(dynamicMetadataService);

        console.log("URI Now: %s", dynamicMetadataService.uri(0));

        vm.stopBroadcast();
    }
}
