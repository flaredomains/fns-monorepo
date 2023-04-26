pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/ENSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/ethregistrar/BaseRegistrar.sol";
import "fns/ethregistrar/MintedDomainNames.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/ethregistrar/ETHRegistrarController.sol";
import "fns/ethregistrar/mock/MockStablePriceOracle.sol";
import "fns/ethregistrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";

import "fns-test/utils/ENSNamehash.sol";

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
            ENSRegistry ensRegistry = new ENSRegistry();
            NoNameCollisions noNameCollisions = new NoNameCollisions(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);

            // This is Ownable, and owned by the msg.sender (private key)
            baseRegistrar = new BaseRegistrar(ensRegistry, ENSNamehash.namehash('flr'), noNameCollisions);

            // Deploy the mintedIds data struct contract, then update the reference within Base Registrar
            MintedDomainNames mintedDomainNames = new MintedDomainNames(address(baseRegistrar));
            baseRegistrar.updateMintedDomainNamesContract(mintedDomainNames);

            // Make BaseRegistrar the owner of the base 'flr' node
            baseRegistrar.addController(ANVIL_DEPLOYER);
            ensRegistry.setSubnodeOwner(rootNode, keccak256('flr'), address(baseRegistrar));
            baseRegistrar.register('deployer', ANVIL_DEPLOYER, 365 days);
            require(ensRegistry.owner(ENSNamehash.namehash('deployer.flr')) == ANVIL_DEPLOYER, "Owner not expected");

            // TODO: Update this to our own website
            StaticMetadataService metadataService = new StaticMetadataService("https://ens.domains/");
            NameWrapper nameWrapper = new NameWrapper(ensRegistry, baseRegistrar, metadataService);

            reverseRegistrar = new ReverseRegistrar(ensRegistry);

            MockStablePriceOracle stablePriceOracle = new MockStablePriceOracle(
                0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
                [uint256(5), 4, 3, 2, 1]);
            ETHRegistrarController ethRegistrarController = new ETHRegistrarController(
                baseRegistrar,
                stablePriceOracle,
                600,
                86400,
                reverseRegistrar,
                nameWrapper);

            PublicResolver publicResolver = new PublicResolver(
                ensRegistry, nameWrapper, address(ethRegistrarController), address(reverseRegistrar));
            nameResolver = NameResolver(address(publicResolver));

            // Set the resolver
            baseRegistrar.setResolver(address(publicResolver));
            reverseRegistrar.setDefaultResolver(address(publicResolver));

            baseRegistrar.addController(address(nameWrapper));
            nameWrapper.setController(address(ethRegistrarController), true);
            reverseRegistrar.setController(address(ethRegistrarController), true);

            // TODO: Should this be set to the deployer address or the reverseRegistrar contract?
            ensRegistry.setSubnodeOwner(rootNode, keccak256('reverse'), ANVIL_DEPLOYER);
            ensRegistry.setSubnodeOwner(
                ENSNamehash.namehash('reverse'), keccak256('addr'), address(reverseRegistrar));
            ensRegistry.setSubnodeOwner(rootNode, keccak256('reverse'), address(reverseRegistrar));
        }

        // Test Deployer ReverseRegistrar
        baseRegistrar.register('reverseDeployer', ANVIL_DEPLOYER, 365 days);
        bytes32 nodeHash = reverseRegistrar.setName('reverseDeployer');
        console.log(nameResolver.name(nodeHash));

        baseRegistrar.register('reverseOwner', ANVIL_OWNER, 365 days);
        vm.stopBroadcast();

        // vm.startBroadcast(ANVIL_OWNER_PRIVATE_KEY);
        vm.startBroadcast(0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6);
        // Test Owner ReverseRegistrar
        nodeHash = reverseRegistrar.setName('reverseOwner2');
        console.log(nameResolver.name(nodeHash));
        vm.stopBroadcast();
    }
}