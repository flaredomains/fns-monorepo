// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IMetadataService} from "./IMetadataService.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DynamicMetadataService is IMetadataService, Ownable {
    event TokenUriSet(uint256 indexed tokenId, string uriPath);
    event FallbackUriSet(string uriPath);

    uint256 public numUniqueTokenUriSet;
    mapping (uint256 => string) public uriPaths;
    string public uriFallbackPath;

    constructor(string memory _uriFallbackPath) {
        uriFallbackPath = _uriFallbackPath;
    }

    function setUri(uint256 tokenId, string calldata uriPath) public onlyOwner {
        require(bytes(uriPath).length > 0, "Can not set uri to empty string");

        // Increment the unique counter if this tokenId has not been set before
        // This helps in the event that the automatic NFT asset service misses any tokens
        if(bytes(uriPaths[tokenId]).length == 0) {
            numUniqueTokenUriSet++;
        }

        uriPaths[tokenId] = uriPath;
        emit TokenUriSet(tokenId, uriPath);
    }

    function setFallbackUri(string calldata _uriFallbackPath) public onlyOwner {
        uriFallbackPath = _uriFallbackPath;
        emit FallbackUriSet(_uriFallbackPath);
    }

    function uri(uint256 tokenId) public view returns (string memory) {
        string memory uriPath = uriPaths[tokenId];

        if(bytes(uriPath).length > 0) {
            return uriPath;
        }

        return uriFallbackPath;
    }
}
