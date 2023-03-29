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

contract DeployFNS is Script {
    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    bytes32 constant rootNode = 0x0;

    // Entrypoint to deploy script
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // The root owner will be the msg.sender, which should be the private key owner
        ENSRegistry ensRegistry = new ENSRegistry();

        // This is Ownable, and owned by the msg.sender (private key)
        BaseRegistrar baseRegistrar = new BaseRegistrar(ensRegistry, ENSNamehash.namehash('flr'));

        // Make BaseRegistrar the owner of the base 'flr' node
        baseRegistrar.addController(owner);
        ensRegistry.setSubnodeOwner(rootNode, keccak256('flr'), address(baseRegistrar));
        baseRegistrar.register(uint256(keccak256('deployer')), owner, 86400);
        require(ensRegistry.owner(ENSNamehash.namehash('deployer.flr')) == owner, "Owner not expected");

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

        baseRegistrar.setResolver(address(publicResolver));
        baseRegistrar.addController(address(nameWrapper));
        nameWrapper.setController(address(ethRegistrarController), true);
        reverseRegistrar.setController(address(ethRegistrarController), true);

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
        console.log("ethRegistrarController: %s", address(ethRegistrarController));
        console.log("publicResolver: %s", address(publicResolver));
    }
}