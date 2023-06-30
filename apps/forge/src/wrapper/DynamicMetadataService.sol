// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IMetadataService.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DynamicMetadataService is IMetadataService, Ownable {
    mapping (uint256 => string) public uriPaths;

    function setUri(uint256 tokenId, string calldata uriPath) public onlyOwner {
        // Can only set a tokenIds uriPath once, which prevents any wallet from changing existing NFT metadata
        if(bytes(uriPaths[tokenId]).length == 0) {
            uriPaths[tokenId] = uriPath;
        }
    }

    function uri(uint256 tokenId) public view returns (string memory) {
        return uriPaths[tokenId];
    }
}
