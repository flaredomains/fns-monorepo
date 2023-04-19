pragma solidity >=0.8.4;

interface IMintedIds {
    function getAllUserMintedIds(address owner) external view returns (uint256[] memory);
    function addUserMintedId(address owner, uint256 id) external; 
}