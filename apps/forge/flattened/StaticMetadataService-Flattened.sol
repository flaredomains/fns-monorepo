// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetadataService {
    function uri(uint256) external view returns (string memory);
}

contract StaticMetadataService is IMetadataService {
    string private _uri;

    constructor(string memory _metaDataUri) {
        _uri = _metaDataUri;
    }

    function uri(uint256) public view returns (string memory) {
        return _uri;
    }
}
