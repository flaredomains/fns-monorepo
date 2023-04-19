pragma solidity >=0.8.4;

import "./IMintedDomainNames.sol";

contract MintedDomainNames is IMintedDomainNames {
    mapping(address => IMintedDomainNames.Data[]) mintedDomainNames;
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
    function getLength(address owner) external view returns (uint) {
        return mintedDomainNames[owner].length;
    }

    /**
     * @dev Get all user minted domain names
     * @param owner The address to return the list of minted ids of
     * @return the list of domain names minted by the provided address
     */
    function getAll(address owner) external view returns (IMintedDomainNames.Data[] memory) {
        return mintedDomainNames[owner];
    }

    /**
     * @dev Add a user minted domain name, gated to the baseRegistrar contract
     * @param owner The address to add the id to
     * @param id the id of the registered domain name
     * @param expiry the expiry timestamp of the registered domain name
     * @param label the lable of the registered domain name
     */
    function add(
        address owner, uint256 id, uint256 expiry, string calldata label) external {
        require(msg.sender == baseRegistrar);
        mintedDomainNames[owner].push(IMintedDomainNames.Data(id, expiry, label));
    }
}