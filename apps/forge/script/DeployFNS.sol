pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "fns/registry/ENSRegistry.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/ethregistrar/BaseRegistrar.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";
import "fns/ethregistrar/ETHRegistrarController.sol";

import "fns-test/utils/ENSNamehash.sol";

contract DeployFNS is Script {
    // Entrypoint to deploy script
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ENSRegistry ensRegistry = new ENSRegistry();
        BaseRegistrar baseRegistrar = new BaseRegistrar(ensRegistry, ENSNamehash.namehash('eth'));

        // TODO: Determine IMetadataService for NameWrapper
        NameWrapper nameWrapper = new NameWrapper(ensRegistry, baseRegistrar, null);

        // TODO: Set the default resolver
        ReverseRegistrar reverseRegistrar = new ReverseRegistrar(ensRegistry);

        PublicResolver publicResolver = new PublicResolver(ensRegistry, );

        address pubResolverAddr = deployPublicResolver();
        address reverseRegistrarAddr = deployReverseRegistrar();
        address nameWrapperAddr = deployNameWrapper();
        address ethRegControllerAddr = deployETHRegistrarController();

        vm.stopBroadcast();
    }

    function deployPublicResolver() private returns(address) {}
    function deployReverseRegistrar() private returns(address){}
    // TODO: Figure out price oracle to use
    // function deployPriceOracle() private {}
    function deployNameWrapper() private returns(address){}
    function deployETHRegistrarController() private returns(address){}
}