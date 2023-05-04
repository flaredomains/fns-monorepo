pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/FNSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/resolvers/profiles/NameResolver.sol";
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

contract TestReverseRegistrar is Script {
    // address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    address owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    bytes32 constant rootNode = 0x0;

    // Entrypoint to deploy script
    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80);

        // The root owner will be the msg.sender, which should be the private key owner
        FNSRegistry fnsRegistry = new FNSRegistry();
        NoNameCollisions noNameCollisions = new NoNameCollisions(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);

        // This is Ownable, and owned by the msg.sender (private key)
        BaseRegistrar baseRegistrar = new BaseRegistrar(fnsRegistry, FNSNamehash.namehash('flr'), noNameCollisions);

        // Make BaseRegistrar the owner of the base 'flr' node
        baseRegistrar.addController(owner);
        fnsRegistry.setSubnodeOwner(rootNode, keccak256('flr'), address(baseRegistrar));
        baseRegistrar.register('deployer', owner, 365 days);
        require(fnsRegistry.owner(FNSNamehash.namehash('deployer.flr')) == owner, "Owner not expected");

        // TODO: Update this to our own website
        StaticMetadataService metadataService = new StaticMetadataService("https://fns.domains/");
        NameWrapper nameWrapper = new NameWrapper(fnsRegistry, baseRegistrar, metadataService);

        // Deploy the mintedIds data struct contract, then update the reference within Base Registrar
        MintedDomainNames mintedDomainNames = new MintedDomainNames(nameWrapper);
        nameWrapper.updateMintedDomainNamesContract(mintedDomainNames);

        ReverseRegistrar reverseRegistrar = new ReverseRegistrar(fnsRegistry);

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
        NameResolver nameResolver = NameResolver(address(publicResolver));

        // Set the resolver
        baseRegistrar.setResolver(address(publicResolver));
        reverseRegistrar.setDefaultResolver(address(publicResolver));

        baseRegistrar.addController(address(nameWrapper));
        nameWrapper.setController(address(flrRegistrarController), true);
        reverseRegistrar.setController(address(flrRegistrarController), true);

        fnsRegistry.setSubnodeOwner(rootNode, keccak256('reverse'), owner);
        fnsRegistry.setSubnodeOwner(
            FNSNamehash.namehash('reverse'), keccak256('addr'), address(reverseRegistrar));

        baseRegistrar.register('hooray', owner, 365 days);
        //reverseRegistrar.claim(owner);
        bytes32 nodeHash = reverseRegistrar.setName('hooray');

        console.logBytes32(nodeHash);
        console.log(nameResolver.name(nodeHash));

        vm.stopBroadcast();

        // console.log("fnsRegistry: %s", address(fnsRegistry));
        // console.log("baseRegistrar: %s", address(baseRegistrar));
        // console.log("mintedDomainNames: %s", address(mintedDomainNames));
        // console.log("metadataService: %s", address(metadataService));
        // console.log("nameWrapper: %s", address(nameWrapper));
        // console.log("reverseRegistrar: %s", address(reverseRegistrar));
        // console.log("stablePriceOracle: %s", address(stablePriceOracle));
        // console.log("flrRegistrarController: %s", address(flrRegistrarController));
        // console.log("publicResolver: %s", address(publicResolver));

        // == Logs ==
        // claimForAddr::reverseNode
        // 0x36f4458307cdb864c670ce989072842621dd6b7022b8abacc37f7fab25890b27
        // claimForAddr::labelHash
        // 0x19682d67812181b19d61f09263ab9e723b258d8d7949f68794d8916171bea91d
        // claimForAddr::reverseNode
        // 0x36f4458307cdb864c670ce989072842621dd6b7022b8abacc37f7fab25890b27
        // claimForAddr::labelHash
        // 0x19682d67812181b19d61f09263ab9e723b258d8d7949f68794d8916171bea91d
        // hooray
    }
}