pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/chain-state/MintedDomainNames.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";
import "fns/flr-registrar/mock/MockStablePriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/FNSNamehash.sol";

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
        address publicResolverAddr = 0xB0e7D1Cc039e8678148Bd713Df0d1A6f84131B72;
        address flrRegistrarControllerAddr = 0xd0b66Bcc2a02cfA55D4b86f4547a3aE94d785C2d;
        address reverseRegistrarAddr = 0xCD4CC38FAc6332887141d4880078eD001fC6E2A9;
        string memory name = "dad";

        vm.startBroadcast(broadcastPrivKey);

        // Begin script specifics
        FLRRegistrarController flrRegistrarController = FLRRegistrarController(flrRegistrarControllerAddr);
        PublicResolver publicResolver = PublicResolver(publicResolverAddr);
        ReverseRegistrar reverseRegistrar = ReverseRegistrar(reverseRegistrarAddr);

        // bytes32 commitment = flrRegistrarController.makeCommitment(
        //     name,
        //     broadcastAddress,
        //     31556952,
        //     keccak256(bytes(name)),
        //     publicResolverAddr,
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

        flrRegistrarController.register{ value: totalPrice }(
            name,
            broadcastAddress,
            31556952,
            keccak256(bytes(name)),
            publicResolverAddr,
            new bytes[](0),
            true,
            0);
        
        string memory reverseName = publicResolver.name(reverseRegistrar.node(broadcastAddress));
        console.log("NAME SET FOR: %s", broadcastAddress);
        console.logString(reverseName);

        vm.stopBroadcast();
    }
}