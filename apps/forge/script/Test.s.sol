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

import "fns-test/utils/ENSNamehash.sol";

contract TestScript is Script {
    ENSRegistry public ensRegistry = ENSRegistry(0x8E60eEeB7634930bba7a9d74f01Af9c9e78c9063);
    BaseRegistrar public baseRegistrar = BaseRegistrar(0x7113e298973444eCC1c52bDdA92B2Ad5d5399426);
    StaticMetadataService public metadataService = StaticMetadataService(0x9f002F58143895D4990b9643BE920f8706a1f468);
    NameWrapper public nameWrapper = NameWrapper(0x382f565bD2Fa4C9006D84f928744929B83b42d55);
    ReverseRegistrar public reverseRegistrar = ReverseRegistrar(0x4B295988f67C0a7E0ed2c3FD2A210c6147632b7e);
    DummyOracle public dummyOracle = DummyOracle(0x54c2cB6eEe2b4B0EEBd0AC750d8399C3626bBdDE);
    StablePriceOracle public stablePriceOracle = StablePriceOracle(0x6a464936FF34A47bd0a7A62191Da75E0ebD65E3c);
    FLRRegistrarController public flrRegistrarController = FLRRegistrarController(0x5b4E0C64f0e5924727A5608374cCFDFDB4D318B6);
    PublicResolver public publicResolver = PublicResolver(0x68470b26610348472dE725E307b10D61EF6368b8);

    address owner = 0x09Ec74F54dc4b316D8cd6DFBeB91263fB20E19d2; // public key of metamask wallet
    bytes32 constant rootNode = 0x0;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        console.log(baseRegistrar.ownerOf(uint256(keccak256('deployer'))));

        vm.stopBroadcast();
    }
}


