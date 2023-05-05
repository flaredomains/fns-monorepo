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

contract Go is Script {
    bytes32 constant rootNode = 0x0;

    uint256 immutable ANVIL_DEPLOYER_PRIVATE_KEY = vm.envUint("ANVIL_DEPLOYER_PRIVATE_KEY");
    uint256 immutable ANVIL_OWNER_PRIVATE_KEY = vm.envUint("ANVIL_OWNER_PRIVATE_KEY");
    uint256 immutable DEPLOYER_PRIVATE_KEY = vm.envUint("DEPLOYER_PRIVATE_KEY");
    uint256 immutable OWNER_PRIVATE_KEY = vm.envUint("OWNER_PRIVATE_KEY");

    address immutable ANVIL_DEPLOYER = vm.envAddress("ANVIL_DEPLOYER_ADDRESS");
    address immutable ANVIL_OWNER = vm.envAddress("ANVIL_OWNER_ADDRESS");
    address immutable DEPLOYER = vm.envAddress("DEPLOYER_ADDRESS");
    address immutable OWNER = vm.envAddress("OWNER_ADDRESS");

    // Entrypoint to deploy script
    function run() external {
        BaseRegistrar baseRegistrar;
        ReverseRegistrar reverseRegistrar;
        NameResolver nameResolver;

        vm.startBroadcast(ANVIL_DEPLOYER_PRIVATE_KEY);

        {
            // Begin script specifics
            // The root owner will be the msg.sender, which should be the private key owner
            FNSRegistry fnsRegistry = new FNSRegistry();
            NoNameCollisions noNameCollisions = new NoNameCollisions(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);

            // This is Ownable, and owned by the msg.sender (private key)
            baseRegistrar = new BaseRegistrar(fnsRegistry, FNSNamehash.namehash('flr'), noNameCollisions);

            // Make BaseRegistrar the owner of the base 'flr' node
            baseRegistrar.addController(ANVIL_DEPLOYER);
            fnsRegistry.setSubnodeOwner(rootNode, keccak256("flr"), address(baseRegistrar));
            baseRegistrar.register("deployer", ANVIL_DEPLOYER, 365 days);
            require(fnsRegistry.owner(FNSNamehash.namehash("deployer.flr")) == ANVIL_DEPLOYER, "Owner not expected");

            // TODO: Update this to our own website
            StaticMetadataService metadataService = new StaticMetadataService("https://fns.domains/");
            NameWrapper nameWrapper = new NameWrapper(fnsRegistry, baseRegistrar, metadataService);

            // Deploy the mintedIds data struct contract, then update the reference within Base Registrar
            MintedDomainNames mintedDomainNames = new MintedDomainNames(nameWrapper);
            nameWrapper.updateMintedDomainNamesContract(mintedDomainNames);

            reverseRegistrar = new ReverseRegistrar(fnsRegistry);

            MockStablePriceOracle stablePriceOracle = new MockStablePriceOracle(
                0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
                [uint256(5), 4, 3, 2, 1]);
            FLRRegistrarController flrRegistrarController = new FLRRegistrarController(
                baseRegistrar,
                stablePriceOracle,
                600,
                86400,
                reverseRegistrar,
                nameWrapper);

            PublicResolver publicResolver = new PublicResolver(
                fnsRegistry, nameWrapper, address(flrRegistrarController), address(reverseRegistrar));
            nameResolver = NameResolver(address(publicResolver));

            // Set the resolver
            baseRegistrar.setResolver(address(publicResolver));
            reverseRegistrar.setDefaultResolver(address(publicResolver));

            baseRegistrar.addController(address(nameWrapper));
            nameWrapper.setController(address(flrRegistrarController), true);
            reverseRegistrar.setController(address(flrRegistrarController), true);

            // TODO: Should this be set to the deployer address or the reverseRegistrar contract?
            fnsRegistry.setSubnodeOwner(rootNode, keccak256("reverse"), ANVIL_DEPLOYER);
            fnsRegistry.setSubnodeOwner(FNSNamehash.namehash("reverse"), keccak256("addr"), address(reverseRegistrar));
            fnsRegistry.setSubnodeOwner(rootNode, keccak256("reverse"), address(reverseRegistrar));
        }

        // Test Deployer ReverseRegistrar
        baseRegistrar.register("reverseDeployer", ANVIL_DEPLOYER, 365 days);
        bytes32 nodeHash = reverseRegistrar.setName("reverseDeployer");
        console.log(nameResolver.name(nodeHash));

        baseRegistrar.register("reverseOwner", ANVIL_OWNER, 365 days);
        vm.stopBroadcast();

        // vm.startBroadcast(ANVIL_OWNER_PRIVATE_KEY);
        vm.startBroadcast(0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6);
        // Test Owner ReverseRegistrar
        nodeHash = reverseRegistrar.setName("reverseOwner2");
        console.log(nameResolver.name(nodeHash));
        vm.stopBroadcast();
    }
}
