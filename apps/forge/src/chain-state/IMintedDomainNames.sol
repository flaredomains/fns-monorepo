// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMintedDomainNames {
    struct Data {
        uint256 id;
        uint32 fuses;
        uint64 expiry;
        string label;
    }

    function getAll(address owner) external view returns (Data[] memory, uint256 length);
    function add(address owner, uint256 id, uint32 fuses, uint64 expiry, string calldata label) external;
    function addSubdomain(
        address owner,
        uint256 id,
        uint32 fuses,
        uint64 expiry,
        uint256 parentNodeTokenId,
        string calldata label
    ) external;
    function addFromTransfer(address oldOwner, address owner, uint256 id, uint32 fuses, uint64 expiry) external;
}
