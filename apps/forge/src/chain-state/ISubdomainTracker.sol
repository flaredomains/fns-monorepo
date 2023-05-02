pragma solidity >=0.8.4;

interface ISubdomainTracker {
    struct Data {
        uint256 id;
        address owner;
        string label;
    }
    function getAll(uint256 id) external view returns (Data[] memory, uint256 length);
    function add(uint256 parentId, uint256 subdomainId, address owner, string calldata subdomainLabel) external;
}