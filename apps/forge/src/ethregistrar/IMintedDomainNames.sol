pragma solidity >=0.8.4;

interface IMintedDomainNames {
    struct Data {
        uint256 id;
        uint256 expiry;
        string label;
    }
    function getAllUserMintedDomainNames(address owner) external view returns (IMintedDomainNames.Data[] memory);
    function addUserMintedDomainName(address owner, uint256 id, uint256 expiry, string calldata label) external;
}