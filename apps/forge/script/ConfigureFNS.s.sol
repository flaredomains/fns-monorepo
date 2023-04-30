pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/ENSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/ethregistrar/BaseRegistrar.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/ethregistrar/FLRRegistrarController.sol";
import "fns/ethregistrar/StablePriceOracle.sol";
import "fns/ethregistrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/ENSNamehash.sol";

contract ConfigureFNS is Script {
    bytes32 constant rootNode = 0x0;
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2;
    // address owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    ENSRegistry public ensRegistry;// = ENSRegistry(0x01Ea6d29d8DB586AA2884A3eeb47F4301f8Ac5D4);
    BaseRegistrar public baseRegistrar;// = BaseRegistrar(0x73e263e83741f797Deb8aB8C8742fe6c815cbABf);
    NoNameCollisions public noNameCollisions;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ensRegistry = new ENSRegistry();
        noNameCollisions = new NoNameCollisions(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);
        baseRegistrar = new BaseRegistrar(ensRegistry, ENSNamehash.namehash('flr'), noNameCollisions);

        baseRegistrar.addController(owner);
        ensRegistry.setSubnodeOwner(rootNode, keccak256('flr'), address(baseRegistrar));
        baseRegistrar.register('deployer', owner, 86400);
        require(ensRegistry.owner(ENSNamehash.namehash('deployer.flr')) == owner, "Owner not expected");

        StaticMetadataService metadataService = new StaticMetadataService("https://ens.domains/");
        NameWrapper nameWrapper = new NameWrapper(ensRegistry, baseRegistrar, metadataService);
        ReverseRegistrar reverseRegistrar = new ReverseRegistrar(ensRegistry);
        DummyOracle dummyOracle = new DummyOracle(100000000);
        StablePriceOracle stablePriceOracle = new StablePriceOracle(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
            [uint256(0), 0, 300, 100, 5]);
        FLRRegistrarController flrRegistrarController = new FLRRegistrarController(
            baseRegistrar,
            stablePriceOracle,
            600,
            86400,
            reverseRegistrar,
            nameWrapper);
        PublicResolver publicResolver = new PublicResolver(
            ensRegistry, nameWrapper, address(flrRegistrarController), address(reverseRegistrar));
        
        baseRegistrar.setResolver(address(publicResolver));
        baseRegistrar.addController(address(nameWrapper));
        nameWrapper.setController(address(flrRegistrarController), true);
        reverseRegistrar.setController(address(flrRegistrarController), true);

        ensRegistry.setSubnodeOwner(rootNode, keccak256('reverse'), owner);
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
        console.log("flrRegistrarController: %s", address(flrRegistrarController));
        console.log("publicResolver: %s", address(publicResolver));
    }
}