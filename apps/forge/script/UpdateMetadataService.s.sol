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

        NameWrapper nameWrapper = NameWrapper(0xabACC3D71E3E073724d286aE6AFbeaECf7dF8128);

        console.log("nameWrapper owner=%s", nameWrapper.owner());

        StaticMetadataService staticMetadataService = new StaticMetadataService(
            "https://fns.infura-ipfs.io/ipfs/QmQGh7tUEm3wy7o26baAejh8hZ8DpDHwfDxqzz2yJHffVg"
        );

        console.log("StaticMetadataService Deployed to: %s", address(staticMetadataService));

        nameWrapper.setMetadataService(staticMetadataService);

        console.log("URI Now: %s", staticMetadataService.uri(0));

        vm.stopBroadcast();
    }
}
