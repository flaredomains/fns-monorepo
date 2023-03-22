pragma solidity ^0.8.10;

import "forge-std/Script.sol";
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

contract DeployFNS is Script {
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

        PublicResolver publicResolver = new PublicResolver(
            ensRegistry, nameWrapper, address(ethRegistrarController), address(reverseRegistrar));

        vm.stopBroadcast();
    }
}