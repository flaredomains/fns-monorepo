// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IMetadataService} from "./IMetadataService.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BaseURIMetadataService is IMetadataService, Ownable {
    string public baseURI;

    event BaseURIUpdated(string newBaseURI);

    function setBaseURI(string calldata newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function uri(uint256 tokenId) public view returns (string memory) {
        return string.concat(baseURI, "/metadata/", Strings.toString(tokenId), ".json");
    }
}
