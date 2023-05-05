pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "./DeployFNSAbstract.s.sol";

contract DeployFNS is Script, DeployFNSAbstract {
    string[] giftDomains = [
        "xrpmonk",
        "web3iam",
        "uttam",
        "tinamtn",
        "timrowley",
        "thanasimos",
        "solidifi",
        "scooterbrah",
        "santiago",
        "rulexrp",
        "robxrp",
        "raredata",
        "pheonixoge",
        "neb",
        "mrfreshtime",
        "maxluck",
        "legalguardian",
        "joshua",
        "johnsmith",
        "jenna",
        "girlintheverse",
        "flarescan",
        "flarepedia",
        "flarebuilder",
        "erik",
        "delx",
        "danrocky",
        "charlieshrem",
        "blazeswap",
        "bank",
        "ash",
        "annieways",
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

        for(uint i = 0; i < giftDomains.length; ++i) {
            console.log("MINTING: %s.flr", giftDomains[i]);
            baseRegistrar.register(giftDomains[i], deployerAddress, 365 days);
            nameWrapper.wrapETH2LD(giftDomains[i], deployerAddress, 0, address(publicResolver));
        }
    }
}
