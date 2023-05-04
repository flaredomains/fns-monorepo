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

contract Template is Script {
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

    constructor() {
        console.log("constructor()");
    }

    function setUp() public {
        console.log("setUp()");
    }

    // Entrypoint to deploy script
    function run() external {
        uint256 deployerPrivKey = ANVIL_DEPLOYER_PRIVATE_KEY;
        address deployerAddress = ANVIL_DEPLOYER_ADDRESS;
        vm.startBroadcast(deployerPrivKey);

        // Begin script specifics
        console.log("run()");

        // console.logBytes32(FNSNamehash.namehash('reverse'));
        // console.logBytes32(FNSNamehash.namehash('addr.reverse'));

        // FNSRegistry fnsRegistry = new FNSRegistry();
        // bytes32 reverseNode = fnsRegistry.setSubnodeOwner(0x0, keccak256('reverse'), deployerAddress);
        // bytes32 addrReverseNode = fnsRegistry.setSubnodeOwner(reverseNode, keccak256('addr'), deployerAddress);
        // console.log("addrReverseNode");
        // console.logBytes32(addrReverseNode);

        vm.stopBroadcast();
    }
}
