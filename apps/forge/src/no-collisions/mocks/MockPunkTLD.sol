// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@punkdomains/lib/strings.sol";

contract MockPunkTLD {
    using strings for string;

    struct Domain {
        string name; // domain name that goes before the TLD name; example: "tempetechie" in "tempetechie.web3"
        uint256 tokenId;
        address holder;
        string data; // stringified JSON object, example: {"description": "Some text", "twitter": "@techie1239", "friends": ["0x123..."], "url": "https://punk.domains"}
    }

    mapping(string => Domain) public domains;

    function getDomainHolder(string calldata _domainName) external view returns (address) {
        return domains[strings.lower(_domainName)].holder;
    }
}
