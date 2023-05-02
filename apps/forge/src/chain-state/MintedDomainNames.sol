pragma solidity >=0.8.4;

import "./IMintedDomainNames.sol";
import "fns/wrapper/INameWrapper.sol";

// TODO: Remove
import "forge-std/console.sol";

contract MintedDomainNames is IMintedDomainNames {
    mapping(uint256 => string) tokenIdToName;
    mapping(address => IMintedDomainNames.Data[]) mintedDomainNames;
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
     * @return data length - a data array with still-owned tokens
     */
    function getAll(address owner) external view returns (IMintedDomainNames.Data[] memory data, uint256 length) {
        data = new IMintedDomainNames.Data[](mintedDomainNames[owner].length);

        // Filter all records based on the current owner. This handles transfers without increasing gas costs on
        // FNS users
        for(uint i = 0; i < mintedDomainNames[owner].length; ++i) {
            if(nameWrapper.ownerOf(mintedDomainNames[owner][i].id) == owner) {
                data[length] = mintedDomainNames[owner][i];
                ++length;
            }
        }
    }

    /**
     * @dev Add a user minted domain name, gated to the NameWrapper contract
     * @param owner The address to add the id to
     * @param id the id of the registered domain name
     * @param expiry the expiry timestamp of the registered domain name
     * @param label the lable of the registered domain name
     */
    function add(
        address owner, uint256 id, uint32 fuses, uint64 expiry, string calldata label) external isNameWrapper {
        (, uint256 idFromLabel) = nameWrapper.getFLRTokenId(label);
        require(id == idFromLabel, "MintedDomainNames: id & label mismatch");

        // TODO: Remove this
        console.log("MintedDomainNames::add(owner:%s, id:%s, expiry:%s, label:...)", owner, id, expiry);
        console.logString(label);

        // We're safe to add label here because id will always match label. At worst, we will overwrite
        tokenIdToName[id] = label;

        mintedDomainNames[owner].push(IMintedDomainNames.Data(id, fuses, expiry, label));
    }

    /**
     * @dev Add a user minted domain name, from transfer origin, meaning we already know the label
     * @param owner The address to add the id to
     * @param id the id of the registered domain name
     * @param expiry the expiry timestamp of the registered domain name
     */
    function addFromTransfer(address oldOwner, address owner, uint256 id, uint32 fuses, uint64 expiry) external isNameWrapper {
        // TODO: Remove this
        console.log("addFromTransfer");
        console.logString(tokenIdToName[id]);

        mintedDomainNames[owner].push(IMintedDomainNames.Data(id, fuses, expiry, tokenIdToName[id]));
    }
}