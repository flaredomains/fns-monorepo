pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/wrapper/DynamicMetadataService.sol";

contract DeployFNS is Script {
    // Parent's run() runs first
    function run() external {
        vm.startBroadcast(vm.envUint("FLARE_DEPLOYER_PRIVATE_KEY"));

        DynamicMetadataService dynamicMetadataService = new DynamicMetadataService();

        console.log("1. DynamicMetadataService: %s", address(dynamicMetadataService));

        vm.stopBroadcast();
    }
}
