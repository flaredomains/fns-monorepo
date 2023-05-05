pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "./DeployFNSAbstract.s.sol";

contract DeployFNS is Script, DeployFNSAbstract {
    string[] giftDomains = [
        // Influencer Domains
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
        "_delx", // alt for collision
        "danrocky",
        "charlieshrem",
        "blazeswap",
        "bank",
        "_bank", // alt for collision
        "ash",
        "_ash", // alt for collision
        "annieways",
        "annie-ways", // alt for collision
        "digitalasset",
        "digitalperspectives",
        "digperspectives"
    ];

    // Parent's run() runs first
    function run() external {
        vm.startBroadcast(deployerPrivKey);
        mintGiftDomains();
        vm.stopBroadcast();
    }

    function mintGiftDomains() private {
        baseRegistrar.setApprovalForAll(address(nameWrapper), true);

        for (uint256 i = 0; i < giftDomains.length; ++i) {
            console.log("[%s.flr] Attempting Mint...", giftDomains[i]);
            if (baseRegistrar.isNotCollision(giftDomains[i])) {
                baseRegistrar.register(giftDomains[i], deployerAddress, 365 days);
                nameWrapper.wrapETH2LD(giftDomains[i], deployerAddress, 0, address(publicResolver));
                console.log("\t[%s.flr] minted!", giftDomains[i]);
            } else {
                console.log("\t[%s.flr] collision - failed to mint", giftDomains[i]);
            }
        }
    }
}
