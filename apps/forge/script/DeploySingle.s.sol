pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/governance/TimelockController.sol";

contract DeploySingle is Script {
    // Parent's run() runs first
    function run() external {
        vm.startBroadcast(vm.envUint("OWNER_PRIVATE_KEY"));

        // Proposer should be the multisig or some EOAs
        address[] memory proposers = new address[](3);
        proposers[0] = 0x69D37F5bbA0e66c48555a0A104f70F66A58cB521;
        proposers[1] = 0xBfbf256B6a4f830c762c7f9bcEca9018fBB70104;
        proposers[2] = 0x04B133Ef7561d795A52110670E54d673eD7EB17F;

        // Executor should be just the multisig
        address[] memory executors = new address[](1);
        executors[0] = 0x69D37F5bbA0e66c48555a0A104f70F66A58cB521;

        TimelockController tlc = new TimelockController(
            60,
            proposers,
            executors
        );

        console.log("Timelock Deployed to: ", address(tlc));

        vm.stopBroadcast();
    }
}
