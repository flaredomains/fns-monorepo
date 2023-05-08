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

contract UpdateNoCollisions is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("FLARE_DEPLOYER_PRIVATE_KEY");
        uint256 deployerAddress = vm.envUint("FLARE_DEPLOYER_ADDRESS");
        vm.startBroadcast(deployerPrivateKey);

        BaseRegistrar baseRegistrar = BaseRegistrar(0x570F7b5F751B50b5B2DFF35d553cE05cB27697a7);
        console.log("BaseRegistrar owner=%s", baseRegistrar.owner());

        NoNameCollisions noNameCollisions = new NoNameCollisions(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);

        console.log("Checking Collision that should happen");
        require(noNameCollisions.isNameCollision("bank") == true, "Name Collision Should Occur");

        baseRegistrar.updateNoNameCollisionContract(noNameCollisions);
        require(baseRegistrar.isNotCollision("bank") == false, "Name Collision Should Occur");

        vm.stopBroadcast();
    }
}
