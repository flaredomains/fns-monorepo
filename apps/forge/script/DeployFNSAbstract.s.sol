pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/chain-state/MintedDomainNames.sol";
import "fns/chain-state/SubdomainTracker.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/wrapper/StaticMetadataService.sol";
import "fns/flr-registrar/FLRRegistrarController.sol";
// import "fns/flr-registrar/mock/MockStablePriceOracle.sol";
import "fns/flr-registrar/StablePriceOracle.sol";
import "fns/flr-registrar/DummyOracle.sol";
import "fns/no-collisions/NoNameCollisions.sol";
import "fns/no-collisions/mocks/MockPunkTLD.sol";

import "fns-test/utils/FNSNamehash.sol";

bytes32 constant ROOT_NODE = 0x0;

abstract contract DeployFNSAbstract is Script {
    string constant METADATA_SERVICE_URI = "https://fns.infura-ipfs.io/ipfs/QmSmtZszSZPfHokzKzcvaWxBbrnduiVCho6fDkaVjFPM4x";
    string constant TICKER = "C2FLR";

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

    address deployerAddress;
    uint256 deployerPrivKey;

    PublicResolver publicResolver;
    FLRRegistrarController flrRegistrarController;
    MintedDomainNames mintedDomainNames;
    SubdomainTracker subdomainTracker;
    NameWrapper nameWrapper;
    ReverseRegistrar reverseRegistrar;

    // Entrypoint to deploy script
    function setUp() external {
        // deployerPrivKey = ANVIL_DEPLOYER_PRIVATE_KEY;
        // deployerAddress = ANVIL_DEPLOYER_ADDRESS;
        deployerPrivKey = DEPLOYER_PRIVATE_KEY;
        deployerAddress = DEPLOYER_ADDRESS;
        vm.startBroadcast(deployerPrivKey);

        // Begin script specifics
        // The root owner will be the msg.sender, which should be the private key owner
        FNSRegistry fnsRegistry = new FNSRegistry();

        // TODO: Swap to this on testnet
        // NOTE: mockPunkTLD doesn't verify for some reason due to injection protection, so hardcode false
        //       in NoNameCollisions
        // MockPunkTLD mockPunkTLD = new MockPunkTLD();
        // NoNameCollisions noNameCollisions = new NoNameCollisions(address(mockPunkTLD));
        // TODO: Swap to this on actual deployment
        NoNameCollisions noNameCollisions = new NoNameCollisions(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);

        // This is Ownable, and owned by the msg.sender (private key)
        BaseRegistrar baseRegistrar = new BaseRegistrar(fnsRegistry, FNSNamehash.namehash('flr'), noNameCollisions);

        // Make BaseRegistrar the owner of the base 'flr' node
        baseRegistrar.addController(deployerAddress);
        fnsRegistry.setSubnodeOwner(ROOT_NODE, keccak256("flr"), address(baseRegistrar));

        // TODO: Should we auto-mint a domain name for the deployer address?
        baseRegistrar.register("fns-deployer", deployerAddress, 36500 days);
        require(fnsRegistry.owner(FNSNamehash.namehash("fns-deployer.flr")) == deployerAddress, "Owner not expected");

        StaticMetadataService metadataService = new StaticMetadataService(METADATA_SERVICE_URI);

        nameWrapper = new NameWrapper(fnsRegistry, baseRegistrar, metadataService);
        mintedDomainNames = new MintedDomainNames(nameWrapper);
        subdomainTracker = new SubdomainTracker(nameWrapper);
        nameWrapper.updateMintedDomainNamesContract(mintedDomainNames);
        nameWrapper.updateSubdomainTrackerContract(subdomainTracker);

        reverseRegistrar = new ReverseRegistrar(fnsRegistry);
        // TODO: Transfer this to timelock at a later date (owned by Timelock on ENSv2 Deployment)
        bytes32 reverseNode = fnsRegistry.setSubnodeOwner(ROOT_NODE, keccak256("reverse"), deployerAddress);
        // Ensure owner of 'addr.reverse' is the ReverseRegistrar Contract
        fnsRegistry.setSubnodeOwner(reverseNode, keccak256("addr"), address(reverseRegistrar));
        // Automatically claim the '<deployerAddr>.addr.reverse' node at deployment time
        reverseRegistrar.claim(deployerAddress);

        // TODO: Update this to Regular StablePriceOracle for mainnet deployment
        // MockStablePriceOracle stablePriceOracle = new MockStablePriceOracle(
        //     0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
        //     // [uint256(500), 350, 300, 100, 5]);
        //     [uint256(5), 4, 3, 2, 1]);
        StablePriceOracle stablePriceOracle = new StablePriceOracle(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
            // [uint256(500), 350, 300, 100, 5]);
            [uint256(5), 4, 3, 2, 1]
        );

        flrRegistrarController = new FLRRegistrarController(
            baseRegistrar,
            stablePriceOracle,
            60,
            86400,
            reverseRegistrar,
            nameWrapper);

        publicResolver = new PublicResolver(
            fnsRegistry, nameWrapper, address(flrRegistrarController), address(reverseRegistrar));

        // Set the resolver
        baseRegistrar.setResolver(address(publicResolver));
        reverseRegistrar.setDefaultResolver(address(publicResolver));

        baseRegistrar.addController(address(nameWrapper));
        nameWrapper.setController(address(flrRegistrarController), true);
        reverseRegistrar.setController(address(flrRegistrarController), true);

        console.log("1. fnsRegistry: %s", address(fnsRegistry));
        console.log("2. noNameCollisions: %s", address(noNameCollisions));
        console.log("3. baseRegistrar: %s", address(baseRegistrar));
        console.log("4. mintedDomainNames: %s", address(mintedDomainNames));
        console.log("5. subdomainTracker: %s", address(subdomainTracker));
        console.log("6. metadataService: %s", address(metadataService));
        console.log("7. nameWrapper: %s", address(nameWrapper));
        console.log("8. reverseRegistrar: %s", address(reverseRegistrar));
        console.log("9. stablePriceOracle: %s", address(stablePriceOracle));
        console.log("10. flrRegistrarController: %s", address(flrRegistrarController));
        console.log("11. publicResolver: %s", address(publicResolver));

        vm.stopBroadcast();
    }
}
