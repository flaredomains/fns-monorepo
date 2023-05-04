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
import "fns/no-collisions/mocks/MockPunkTLD.sol";

import "fns-test/utils/FNSNamehash.sol";

contract Go is Script {
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
        uint256 deployerPrivKey = DEPLOYER_PRIVATE_KEY;
        address deployerAddress = DEPLOYER_ADDRESS;

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
        fnsRegistry.setSubnodeOwner(rootNode, keccak256("flr"), address(baseRegistrar));
        baseRegistrar.register("deployer", deployerAddress, 365 days);
        require(fnsRegistry.owner(FNSNamehash.namehash("deployer.flr")) == deployerAddress, "Owner not expected");

        // TODO: Update this to our own website
        StaticMetadataService metadataService = new StaticMetadataService("https://fns.domains/");
        NameWrapper nameWrapper = new NameWrapper(fnsRegistry, baseRegistrar, metadataService);

        // Deploy the mintedIds data struct contract, then update the reference within Base Registrar
        MintedDomainNames mintedDomainNames = new MintedDomainNames(nameWrapper);
        nameWrapper.updateMintedDomainNamesContract(mintedDomainNames);

        ReverseRegistrar reverseRegistrar = new ReverseRegistrar(fnsRegistry);

        // TODO: Update this to Regular StablePriceOracle for mainnet deployment
        MockStablePriceOracle stablePriceOracle = new MockStablePriceOracle(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019,
            [uint256(5), 4, 3, 2, 1]);
        FLRRegistrarController flrRegistrarController = new FLRRegistrarController(
            baseRegistrar,
            stablePriceOracle,
            60,
            86400,
            reverseRegistrar,
            nameWrapper);

        PublicResolver publicResolver = new PublicResolver(
            fnsRegistry, nameWrapper, address(flrRegistrarController), address(reverseRegistrar));

        // Set the resolver
        baseRegistrar.setResolver(address(publicResolver));
        reverseRegistrar.setDefaultResolver(address(publicResolver));

        baseRegistrar.addController(address(nameWrapper));
        nameWrapper.setController(address(flrRegistrarController), true);
        reverseRegistrar.setController(address(flrRegistrarController), true);

        // TODO: Should this be set to the deployer address or the reverseRegistrar contract?
        fnsRegistry.setSubnodeOwner(rootNode, keccak256("reverse"), deployerAddress);
        fnsRegistry.setSubnodeOwner(FNSNamehash.namehash("reverse"), keccak256("addr"), address(reverseRegistrar));
        fnsRegistry.setSubnodeOwner(rootNode, keccak256("reverse"), address(reverseRegistrar));

        console.log("1. fnsRegistry: %s", address(fnsRegistry));
        console.log("2. noNameCollisions: %s", address(noNameCollisions));
        console.log("3. baseRegistrar: %s", address(baseRegistrar));
        console.log("4. mintedDomainNames: %s", address(mintedDomainNames));
        console.log("5. metadataService: %s", address(metadataService));
        console.log("6. nameWrapper: %s", address(nameWrapper));
        console.log("7. reverseRegistrar: %s", address(reverseRegistrar));
        console.log("8. stablePriceOracle: %s", address(stablePriceOracle));
        console.log("9. flrRegistrarController: %s", address(flrRegistrarController));
        console.log("10. publicResolver: %s", address(publicResolver));

        vm.stopBroadcast();
    }
}

// == Logs ==
//   fnsRegistry:               0xC3a40851BFB8Fd1dFa779C1fB0301C87Da5eB2Ed
//   noNameCollisions:          0xf3E5AaC256A8329fBEC9090F58CF009d779263E7
//   baseRegistrar:             0x66c2bC48d877D0CB3658de837697556649ba57E5
//   mintedDomainNames:         0xDCf74710CF33c149E9eFC9CB7AFda62865f6204a
//   metadataService:           0x067D1959a6A151DDB85B49F09cce0421f29687Ff
//   nameWrapper:               0x7412BfB1803691A29Ae3cf5a0890bD002feB4EFD
//   reverseRegistrar:          0x18c666B4Beeaa3B8493581C6e4E2BaB1Ad4EfBEf
//   stablePriceOracle:         0xeFE07Ff30Cf48c6c3279059B0798388dB44d4aDc
//   flrRegistrarController:    0x462bf6E5C9398cD5d4770CB22208D26e988ecF61
//   publicResolver:            0x6ff8772C8BdC2fFeaD7A7271E99F0b93642533F0
