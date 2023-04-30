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

contract Template is Script {
    // Anvil Wallets
    address immutable ANVIL_DEPLOYER_ADDRESS = vm.envAddress("ANVIL_DEPLOYER_ADDRESS");
    uint256 immutable ANVIL_DEPLOYER_PRIVATE_KEY = vm.envUint("ANVIL_DEPLOYER_PRIVATE_KEY");
    address immutable ANVIL_OWNER_ADDRESS = vm.envAddress("ANVIL_OWNER_ADDRESS");
    uint256 immutable ANVIL_OWNER_PRIVATE_KEY = vm.envUint("ANVIL_OWNER_PRIVATE_KEY");

    // Testnet Wallets
    address immutable DEPLOYER_ADDRESS = vm.envAddress("DEPLOYER_ADDRESS");
    uint256 immutable DEPLOYER_PRIVATE_KEY = vm.envUint("DEPLOYER_PRIVATE_KEY");
    address immutable OWNER_ADDRESS = vm.envAddress("OWNER_ADDRESS");
    uint256 immutable OWNER_PRIVATE_KEY = vm.envUint("OWNER_PRIVATE_KEY");

    bytes32 constant rootNode = 0x0;

    // Entrypoint to deploy script
    function run() external {
        uint256 broadcastPrivKey = OWNER_PRIVATE_KEY;
        address broadcastAddress = OWNER_ADDRESS;
        address publicResolver = 0x008bDf16e7981c0C3Cc47F425D04344B569d2A1a;
        address ethRegistrarControllerAddr = 0xf379EB8addFb3c270AFd994F29524932768A6b18;
        string memory name = "simone";

        vm.startBroadcast(broadcastPrivKey);

        // Begin script specifics
        FLRRegistrarController flrRegistrarController = FLRRegistrarController(ethRegistrarControllerAddr);

        // bytes32 commitment = flrRegistrarController.makeCommitment(
        //     name,
        //     broadcastAddress,
        //     31556952,
        //     keccak256(bytes(name)),
        //     publicResolver,
        //     new bytes[](0),
        //     true,
        //     0);
        
        // console.logBytes32(commitment);
        // flrRegistrarController.commit(commitment);
        
        // console.log("Before Warp: block.timestamp = %s", block.timestamp);
        // vm.warp(block.timestamp + 600);
        // console.log("After Warp: block.timestamp = %s", block.timestamp);

        IPriceOracle.Price memory price = flrRegistrarController.rentPrice(name, 31556952);
        uint256 totalPrice = price.base + price.premium;

        console.log("Price of name:%s => %s", name, totalPrice);

        // flrRegistrarController.register{ value: totalPrice }(
        //     name,
        //     broadcastAddress,
        //     31556952,
        //     keccak256(bytes(name)),
        //     publicResolver,
        //     new bytes[](0),
        //     true,
        //     0);

        vm.stopBroadcast();
    }
}