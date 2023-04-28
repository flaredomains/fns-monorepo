pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/registry/ENSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/resolvers/profiles/NameResolver.sol";
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

contract TestReverseRegistrar is Script {
    // address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    address owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    bytes32 constant rootNode = 0x0;

    // Entrypoint to deploy script
    function run() external {
        // uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80);

        // The root owner will be the msg.sender, which should be the private key owner
        ENSRegistry ensRegistry = new ENSRegistry();
        NoNameCollisions noNameCollisions = new NoNameCollisions(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);

        // This is Ownable, and owned by the msg.sender (private key)
        BaseRegistrar baseRegistrar = new BaseRegistrar(ensRegistry, ENSNamehash.namehash('flr'), noNameCollisions);

        // Deploy the mintedIds data struct contract, then update the reference within Base Registrar
        MintedDomainNames mintedDomainNames = new MintedDomainNames(address(baseRegistrar));
        baseRegistrar.updateMintedDomainNamesContract(mintedDomainNames);

        // Make BaseRegistrar the owner of the base 'flr' node
        baseRegistrar.addController(owner);
        ensRegistry.setSubnodeOwner(rootNode, keccak256('flr'), address(baseRegistrar));
        baseRegistrar.register('deployer', owner, 365 days);
        require(ensRegistry.owner(ENSNamehash.namehash('deployer.flr')) == owner, "Owner not expected");

        // TODO: Update this to our own website
        StaticMetadataService metadataService = new StaticMetadataService("https://ens.domains/");
        NameWrapper nameWrapper = new NameWrapper(ensRegistry, baseRegistrar, metadataService);

        ReverseRegistrar reverseRegistrar = new ReverseRegistrar(ensRegistry);

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
        NameResolver nameResolver = NameResolver(address(publicResolver));

        // Set the resolver
        baseRegistrar.setResolver(address(publicResolver));
        reverseRegistrar.setDefaultResolver(address(publicResolver));

        baseRegistrar.addController(address(nameWrapper));
        nameWrapper.setController(address(ethRegistrarController), true);
        reverseRegistrar.setController(address(ethRegistrarController), true);

        ensRegistry.setSubnodeOwner(rootNode, keccak256('reverse'), owner);
        ensRegistry.setSubnodeOwner(
            ENSNamehash.namehash('reverse'), keccak256('addr'), address(reverseRegistrar));

        baseRegistrar.register('hooray', owner, 365 days);
        //reverseRegistrar.claim(owner);
        bytes32 nodeHash = reverseRegistrar.setName('hooray');

        console.logBytes32(nodeHash);
        console.log(nameResolver.name(nodeHash));

        vm.stopBroadcast();

        // console.log("ensRegistry: %s", address(ensRegistry));
        // console.log("baseRegistrar: %s", address(baseRegistrar));
        // console.log("mintedDomainNames: %s", address(mintedDomainNames));
        // console.log("metadataService: %s", address(metadataService));
        // console.log("nameWrapper: %s", address(nameWrapper));
        // console.log("reverseRegistrar: %s", address(reverseRegistrar));
        // console.log("stablePriceOracle: %s", address(stablePriceOracle));
        // console.log("ethRegistrarController: %s", address(ethRegistrarController));
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