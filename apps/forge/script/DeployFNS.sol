pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/ENSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/ethregistrar/BaseRegistrar.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/ethregistrar/ETHRegistrarController.sol";
import "fns/ethregistrar/StablePriceOracle.sol";
import "fns/ethregistrar/DummyOracle.sol";

import "fns-test/utils/ENSNamehash.sol";

bytes32 constant ZERO_HASH = 0x0000000000000000000000000000000000000000000000000000000000000000;

contract DeployFNS is Script {
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2;

    // Entrypoint to deploy script
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ENSRegistry ensRegistry = new ENSRegistry();
        BaseRegistrar baseRegistrar = new BaseRegistrar(ensRegistry, ENSNamehash.namehash('eth'));

        // TODO: Update this to our own website
        StaticMetadataService metadataService = new StaticMetadataService("https://ens.domains/");
        NameWrapper nameWrapper = new NameWrapper(ensRegistry, baseRegistrar, metadataService);

        // TODO: Set the default resolver
        ReverseRegistrar reverseRegistrar = new ReverseRegistrar(ensRegistry);

        // TODO: Update to real oracle
        DummyOracle dummyOracle = new DummyOracle(100000000);

        // TODO: Update pricing on 1 & 2 character names as well
        StablePriceOracle stablePriceOracle = new StablePriceOracle(
            dummyOracle, [uint256(0), 0, 300, 100, 5]);
        ETHRegistrarController ethRegistrarController = new ETHRegistrarController(
            baseRegistrar,
            stablePriceOracle,
            600,
            86400,
            reverseRegistrar,
            nameWrapper);

        // TODO: Is this setup enough? Shouldn't it be the subnode of 'eth'?
        // setupRegistrar(ensRegistry, ethRegistrarController);
        // setupReverseRegistrar(ensRegistry, ethRegistrarController, reverseRegistrar, account0);

        PublicResolver publicResolver = new PublicResolver(
            ensRegistry, nameWrapper, address(ethRegistrarController), address(reverseRegistrar));

        // TODO: Who do we want the subnode owner to be? Should it all bet he same EOA?
        // setupResolver(ensRegistry, publicResolver, account0);

        // Configuration
        nameWrapper.setController(address(ethRegistrarController), true);
        baseRegistrar.addController(address(nameWrapper));
        reverseRegistrar.setController(address(ethRegistrarController), true);

        ensRegistry.setSubnodeOwner(ZERO_HASH, keccak256('reverse'), owner);
        ensRegistry.setSubnodeOwner(
            ENSNamehash.namehash('reverse'), keccak256('addr'), address(reverseRegistrar));

        vm.stopBroadcast();

        console.log("ensRegistry: %s", address(ensRegistry));
        console.log("baseRegistrar: %s", address(baseRegistrar));
        console.log("metadataService: %s", address(metadataService));
        console.log("nameWrapper: %s", address(nameWrapper));
        console.log("reverseRegistrar: %s", address(reverseRegistrar));
        console.log("dummyOracle: %s", address(dummyOracle));
        console.log("stablePriceOracle: %s", address(stablePriceOracle));
        console.log("ethRegistrarController: %s", address(ethRegistrarController));
        console.log("publicResolver: %s", address(publicResolver));
        console.log("ensRegistry: %s", address(ensRegistry));
    }
}