// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMetadataService {
    function uri(uint256) external view returns (string memory);
}
