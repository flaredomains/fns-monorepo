pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "@punkdomains/interfaces/IBasePunkTLD.sol";

contract Template is Script {
    // Anvil Wallets
    // address immutable ANVIL_DEPLOYER_ADDRESS = vm.envAddress("ANVIL_DEPLOYER_ADDRESS");
    // uint256 immutable ANVIL_DEPLOYER_PRIVATE_KEY = vm.envUint("ANVIL_DEPLOYER_PRIVATE_KEY");
    // address immutable ANVIL_OWNER_ADDRESS = vm.envAddress("ANVIL_OWNER_ADDRESS");
    // uint256 immutable ANVIL_OWNER_PRIVATE_KEY = vm.envUint("ANVIL_OWNER_PRIVATE_KEY");

    // // Testnet Wallets
    // address immutable DEPLOYER_ADDRESS = vm.envAddress("DEPLOYER_ADDRESS");
    // uint256 immutable DEPLOYER_PRIVATE_KEY = vm.envUint("DEPLOYER_PRIVATE_KEY");
    // address immutable OWNER_ADDRESS = vm.envAddress("OWNER_ADDRESS");
    // uint256 immutable OWNER_PRIVATE_KEY = vm.envUint("OWNER_PRIVATE_KEY");

    string[] giftDomains = [
        "xrpmonk",
        "web3iam",
        "uttam",
        "tinamtn",
        "timrowley",
        "thanasimos",
        "solidifi",
        "_solidifi", // alt for collision
        "scooterbrah",
        "santiago",
        "rulexrp",
        "robxrp",
        "raredata",
        "pheonixoge",
        "neb",
        "mrfreshtime",
        "maxluck",
        "max-luck", // alt for collision
        "legalguardian",
        "joshua",
        "johnsmith",
        "jenna",
        "girlintheverse",
        "flarescan",
        "flarepedia",
        "flare-pedia", // alt for collision
        "flarebuilder",
        "erik",
        "delx",
        "_delx",  // alt for collision
        "danrocky",
        "charlieshrem",
        "blazeswap",
        "bank",
        "_bank",  // alt for collision
        "ash",
        "_ash", // alt for collision
        "annieways",
        "annie-ways",  // alt for collision
        "digitalasset",
        "digitalperspectives",
        "digperspectives"
    ];

    constructor() {
        console.log("constructor()");
    }

    function setUp() public {
        console.log("setUp()");
    }

    // Entrypoint to deploy script
    function run() external {
        // uint256 deployerPrivKey = ANVIL_DEPLOYER_PRIVATE_KEY;
        // address deployerAddress = ANVIL_DEPLOYER_ADDRESS;
        // vm.startBroadcast(deployerPrivKey);

        // Begin script specifics
        console.log("run()");
        IBasePunkTLD collisionRegistry = IBasePunkTLD(0xBDACF94dDCAB51c39c2dD50BffEe60Bb8021949a);

        for(uint i = 0; i < giftDomains.length; ++i) {
            //console.log("[%s.flr] Checking Availability", giftDomains[i]);
            address owner = collisionRegistry.getDomainHolder(giftDomains[i]);
            if(owner == address(0)) {
                console.log("%s.flr\ttrue", giftDomains[i]);
            } else {
                console.log("%s.flr\tfalse\t%s", giftDomains[i], owner);
            }
        }

        // vm.stopBroadcast();
    }
}
