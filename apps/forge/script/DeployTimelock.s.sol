pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/flr-registrar/StablePriceOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract DeployTimelock is Script {
    address immutable DEPLOYER_ADDRESS = vm.envAddress("DEPLOYER_ADDRESS");
    uint256 immutable DEPLOYER_PRIVATE_KEY = vm.envUint("DEPLOYER_PRIVATE_KEY");
    address deployerAddress;
    uint256 deployerPrivKey;

    // Executor address is the timelock contract
    address immutable MULTISIG_WALLET_ADDRESS = 0x56496E73A153D78a57dCD85173471AE8B155B453;
    address immutable MULTISIG_ADDRESS_1 = 0x1F834C1a259AC590D61fd668fCb5E333E08614CE;
    address immutable MULTISIG_ADDRESS_2 = 0xaD36cb5D0d414ac86ae08C4981D298DD8Ee0Fd5f;

    BaseRegistrar baseRegistrar = BaseRegistrar(0x570F7b5F751B50b5B2DFF35d553cE05cB27697a7);
    FLRRegistrarController flrRegistrarController = FLRRegistrarController(0x63Adf61F7a3C8BC78E32A5B447f3bc5D260Aa182);
    ReverseRegistrar reverseRegistrar = ReverseRegistrar(0xd1535858F7E8b4bee9BcBF39c498207Eb301D35b);
    StablePriceOracle stablePriceOracle = StablePriceOracle(0x1fb8430508D8699973208B7B6E4245d6d7221C3d);
    NoNameCollisions noNameCollisions = NoNameCollisions(0x65748B0eBfFF46f6d1f64468E5746175120c4C14);

    // Entrypoint to deploy script
    function run() external {
        deployerAddress = DEPLOYER_ADDRESS;
        deployerPrivKey = DEPLOYER_PRIVATE_KEY;

        vm.startBroadcast(deployerPrivKey);

        // Proposer addresses are the multisig wallets themselves
        address[] memory proposers = new address[](3);
        proposers[0] = MULTISIG_WALLET_ADDRESS;
        proposers[1] = MULTISIG_ADDRESS_1;
        proposers[2] = MULTISIG_ADDRESS_2;

        // Executor address is the timelock contract
        address[] memory executors = new address[](1);
        executors[0] = MULTISIG_WALLET_ADDRESS;

        TimelockController timelockController = new TimelockController(
            10,
            proposers,
            executors);

        // Give Ownership of All Contracts to TimelockController
        baseRegistrar.transferOwnership(address(timelockController));
        flrRegistrarController.transferOwnership(address(timelockController));
        reverseRegistrar.transferOwnership(address(timelockController));
        stablePriceOracle.transferOwnership(address(timelockController));
        noNameCollisions.transferOwnership(address(timelockController));

        console.log("timelockController: %s", address(timelockController));

        vm.stopBroadcast();
    }
}