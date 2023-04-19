pragma solidity >=0.8.4;

import "./IMintedIds.sol";

contract MintedIds is IMintedIds {
    mapping(address => uint256[]) mintedIds;
    address immutable baseRegistrar;

    /**
     * @dev Iniitalize this contract with the address of the baseRegistrar, so only that contract
     *      can append to the mintedIds mapping
     */
    constructor(address _baseRegistrar) {
        baseRegistrar = _baseRegistrar;
    }

    /**
     * @dev Get the length of minted ids for a given address
     * @param owner The address to return the length of minted ids of
     * @return the number of minted ids for the provided address
     */
    function getUserMintedIdsLength(address owner) external view returns (uint) {
        return mintedIds[owner].length;
    }

    /**
     * @dev Get all user minted ids - in this case, the hash of the label string,
     *      converted to uint256
     * @param owner The address to return the list of minted ids of
     * @return the list of ids minted by the provided address
     */
    function getAllUserMintedIds(address owner) external view returns (uint256[] memory) {
        return mintedIds[owner];
    }

    /**
     * @dev Add a user minted id, gated to the baseRegistrar contract
     * @param owner The address to add the id to
     * @param id the id to append to the minted list of the address
     */
    function addUserMintedId(address owner, uint256 id) external {
        require(msg.sender == baseRegistrar);
        mintedIds[owner].push(id);
    }
}