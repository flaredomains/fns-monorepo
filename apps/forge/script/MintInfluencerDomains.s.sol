pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "fns/flr-registrar/BaseRegistrar.sol";
import "fns/wrapper/NameWrapper.sol";

contract MintInfluencerDomains is Script {
    address immutable FLARE_DEPLOYER_ADDRESS = vm.envAddress("FLARE_DEPLOYER_ADDRESS");
    uint256 immutable FLARE_DEPLOYER_PRIVATE_KEY = vm.envUint("FLARE_DEPLOYER_PRIVATE_KEY");

    // string[] giftDomains1 = [
    //     // Influencer Domains
    //     "johndenton",
    //     "jeremyhogan",
    //     "xpunks",
    //     "flarenaming",
    //     "xrpmonk",
    //     "web3iam",
    //     "uttam",
    //     "tinamtn",
    //     "timrowley",
    //     "thanasimos"
    // ];

    // string[] giftDomains2 = [
    //     "solidifi",
    //     // "_solidifi", // alt for collision
    //     "scooterbrah",
    //     "santiago",
    //     "rulexrp",
    //     "robxrp",
    //     "raredata",
    //     "pheonixoge",
    //     "neb",
    //     "mrfreshtime",
    //     "maxluck"
    // ];

    // string[] giftDomains3 = [
    //     // "max-luck", // alt for collision
    //     "legalguardian",
    //     "joshua",
    //     "johnsmith",
    //     "jenna",
    //     "girlintheverse",
    //     "flarescan",
    //     "flarepedia",
    //     // "flare-pedia", // alt for collision
    //     "flarebuilder",
    //     "erik",
    //     "delx"
    // ];

    string[] giftDomains4 = [
        // "_delx", // alt for collision
        "danrocky",
        "charlieshrem",
        "blazeswap",
        "bank",
        // "_bank", // alt for collision
        "ash",
        // "_ash", // alt for collision
        "annieways",
        // "annie-ways", // alt for collision
        "digitalasset",
        "digitalperspectives",
        "digperspectives"
    ];

    // Parent's run() runs first
    function run() external {
        vm.startBroadcast(FLARE_DEPLOYER_PRIVATE_KEY);
        mintGiftDomains();
        vm.stopBroadcast();
    }

    function mintGiftDomains() private {
        BaseRegistrar baseRegistrar = BaseRegistrar(0x570F7b5F751B50b5B2DFF35d553cE05cB27697a7);
        NameWrapper nameWrapper = NameWrapper(0xA0A9b5B27D8dd064D0109501c1BFd61da17f2052);

        baseRegistrar.setApprovalForAll(address(nameWrapper), true);

        for (uint256 i = 0; i < giftDomains4.length; ++i) {
            console.log("[%s.flr] Attempting Mint...", giftDomains4[i]);
            if (baseRegistrar.isNotCollision(giftDomains4[i])) {
                baseRegistrar.register(giftDomains4[i], FLARE_DEPLOYER_ADDRESS, 365 days);
                nameWrapper.wrapETH2LD(
                    giftDomains4[i],
                    FLARE_DEPLOYER_ADDRESS,
                    0,
                    0xdB37c3279c36516f0F90d069D8F18eCdD9D7D4D1
                );
                console.log("\t[%s.flr] minted!\n", giftDomains4[i]);
            } else {
                console.log("\t[%s.flr] collision - failed to mint\n", giftDomains4[i]);
            }
        }
    }
}
