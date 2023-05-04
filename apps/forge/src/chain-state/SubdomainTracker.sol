pragma solidity ^0.8.18;

import "./ISubdomainTracker.sol";
import "./MintedDomainNames.sol";
import "fns/wrapper/INameWrapper.sol";

// TODO: Remove
import "forge-std/console.sol";

contract SubdomainTracker is ISubdomainTracker {
    mapping(uint256 => ISubdomainTracker.Data[]) public subdomains;
    INameWrapper immutable nameWrapper;

    /**
     * @dev Iniitalize this contract with the address of the baseRegistrar, so only that contract
     *      can append to the mintedIds mapping
     */
    constructor(INameWrapper _nameWrapper) {
        nameWrapper = _nameWrapper;
    }

    /**
     * @dev Ensure the only caller possible is the nameWrapper contract
     */
    modifier isNameWrapper() {
        require(msg.sender == address(nameWrapper));
        _;
    }

    /**
     * @dev Get all subdomains, given a parent tokenId from NameWrapper
     * @param parentTokenId The tokenId to return the list of minted ids of
     * @return data length - a data array with still-owned subdomain tokens
     */
    function getAll(uint256 parentTokenId) external view returns (ISubdomainTracker.Data[] memory data, uint256 length) {
        data = new ISubdomainTracker.Data[](subdomains[parentTokenId].length);

        // Filter all records based on having an owner (still valid, not burnt)
        // Ensure owner returned is always up to date, in case of transfers
        for(uint i = 0; i < subdomains[parentTokenId].length; ++i) {
            if(nameWrapper.ownerOf(subdomains[parentTokenId][i].id) != address(0)) {
                data[length] = subdomains[parentTokenId][i];
                data[length].owner = nameWrapper.ownerOf(subdomains[parentTokenId][i].id);
                ++length;
            }
        }
    }

    /**
     * @dev Add a minted subdomain, gated to the NameWrapper contract
     * @param parentTokenId The tokenId of the parent domain: "test.flr"
     * @param subdomainId The tokenId of the subdomain: "hi.test.flr"
     * @param subdomainOwner The owner of the subdomain
     * @param subdomainLabel The label of the subdomain: "hi.test"
     */
    function add(uint256 parentTokenId, uint256 subdomainId, address subdomainOwner, string calldata subdomainLabel) external isNameWrapper {
        // (, uint256 idFromLabel) = nameWrapper.getFLRTokenId(fullLabelWithoutTLD);
        // require(subdomainId == idFromLabel, "SubdomainTracker: id & label mismatch");

        // TODO: Remove this
        // console.log(
        //     "SubdomainTracker::add(parentTokenId:%s, subdomainId:%s, subdomainOwner:%s, subdomainLabel:...)",
        //     parentTokenId, subdomainId, subdomainOwner);
        // console.logString(subdomainLabel);

        subdomains[parentTokenId].push(
            ISubdomainTracker.Data(subdomainId, subdomainOwner, subdomainLabel));
    }
}