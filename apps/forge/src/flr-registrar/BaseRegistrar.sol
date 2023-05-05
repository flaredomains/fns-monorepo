// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./IBaseRegistrar.sol";
import "fns/registry/IFNS.sol";
import "fns/no-collisions/INoNameCollisions.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseRegistrar is ERC721, IBaseRegistrar, Ownable {
    // A map of expiry times
    mapping(uint256 => uint256) public expiries;
    // The IFNS registry
    IFNS public fns;
    // The namehash of the TLD this registrar owns (eg, .flr)
    bytes32 public baseNode;
    // A map of addresses that are authorised to register and renew names.
    mapping(address => bool) public controllers;
    uint256 public constant GRACE_PERIOD = 90 days;
    bytes4 private constant INTERFACE_META_ID = bytes4(keccak256("supportsInterface(bytes4)"));
    bytes4 private constant ERC721_ID = bytes4(
        keccak256("balanceOf(address)") ^ keccak256("ownerOf(uint256)") ^ keccak256("approve(address,uint256)")
            ^ keccak256("getApproved(uint256)") ^ keccak256("setApprovalForAll(address,bool)")
            ^ keccak256("isApprovedForAll(address,address)") ^ keccak256("transferFrom(address,address,uint256)")
            ^ keccak256("safeTransferFrom(address,address,uint256)")
            ^ keccak256("safeTransferFrom(address,address,uint256,bytes)")
    );
    bytes4 private constant RECLAIM_ID = bytes4(keccak256("reclaim(uint256,address)"));

    INoNameCollisions public noNameCollisionsContract;

    /**
     * v2.1.3 version of _isApprovedOrOwner which calls ownerOf(tokenId) and takes grace period into consideration instead of ERC721.ownerOf(tokenId);
     * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.1.3/contracts/token/ERC721/ERC721.sol#L187
     * @dev Returns whether the given spender can transfer a given token ID
     * @param spender address of the spender to query
     * @param tokenId uint256 ID of the token to be transferred
     * @return bool whether the msg.sender is approved for the given token ID,
     *    is an operator of the owner, or is the owner of the token
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    constructor(IFNS _fns, bytes32 _baseNode, INoNameCollisions _noNameCollisionsContract) ERC721("", "") {
        require(address(_fns) != address(0), "BaseRegistrar: ENS Contract Can Not Be Address 0");
        require(_baseNode != 0x0, "BaseRegistrar: BaseNode Can Not Be 0x0");
        require(
            address(_noNameCollisionsContract) != address(0),
            "BaseRegistrar: NoNameCollisions Contract Can Not Be Address 0"
        );

        fns = _fns;
        baseNode = _baseNode;
        noNameCollisionsContract = _noNameCollisionsContract;
    }

    modifier live() {
        require(fns.owner(baseNode) == address(this), "BaseRegistrar: Base Node Not Live");
        _;
    }

    modifier onlyController() {
        require(controllers[msg.sender], "BaseRegistrar: onlyController");
        _;
    }

    /**
     * @dev Allows the owner of the contract to update the Collision Registry, in case it
     *      is ever altered in the future
     * @dev This assumes that the interface remains constant
     * @param newContract the new NoNameCollisions Contract address
     */
    function updateNoNameCollisionContract(INoNameCollisions newContract) public onlyOwner {
        require(address(newContract) != address(0), "BaseRegistrar: Cannot update NoCollisions to Address 0");
        noNameCollisionsContract = newContract;
        emit NewNoNameCollisions(address(newContract));
    }

    /**
     * @dev Gets the owner of the specified token ID. Names become unowned
     *      when their registration expires.
     * @param tokenId uint256 ID of the token to query the owner of
     * @return address currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view override(IERC721, ERC721) returns (address) {
        require(expiries[tokenId] > block.timestamp, "BaseRegistrar: Token Id Expired");
        return super.ownerOf(tokenId);
    }

    // Authorises a controller, who can register and renew domains.
    function addController(address controller) external override onlyOwner {
        controllers[controller] = true;
        emit ControllerAdded(controller);
    }

    // Revoke controller permission for an address.
    function removeController(address controller) external override onlyOwner {
        controllers[controller] = false;
        emit ControllerRemoved(controller);
    }

    // Set the resolver for the TLD this registrar manages.
    function setResolver(address resolver) external override onlyOwner {
        fns.setResolver(baseNode, resolver);
        emit ResolverSet(resolver);
    }

    // Returns the expiration timestamp of the specified id.
    function nameExpires(uint256 id) external view override returns (uint256) {
        return expiries[id];
    }

    // Returns true iff the specified name is available for registration.
    function available(uint256 id) public view override returns (bool) {
        // Not available if it's registered here or in its grace period.
        return expiries[id] + GRACE_PERIOD < block.timestamp;
    }

    /**
     * @dev Returns true iff the specified name is not already minted by the referenced registry
     * @param name the string of the base name for TLD ".flr". ex: 'based' for 'based.flr'
     */
    function isNotCollision(string calldata name) public view returns (bool) {
        return !noNameCollisionsContract.isNameCollision(name);
    }

    /**
     * @dev Register a name.
     * @param label The label for the given TLD. If 'based.flr', label is 'based'
     * @param owner The address that should own the registration.
     * @param duration Duration in seconds for the registration.
     */
    function register(string calldata label, address owner, uint256 duration) external override returns (uint256) {
        return _register(label, owner, duration, true);
    }

    /**
     * @dev Register a name, without modifying the registry.
     * @param label The label for the given TLD. If 'based.flr', label is 'based'
     * @param owner The address that should own the registration.
     * @param duration Duration in seconds for the registration.
     */
    function registerOnly(string calldata label, address owner, uint256 duration) external returns (uint256) {
        return _register(label, owner, duration, false);
    }

    function getLabelId(string calldata label) public pure returns (uint256) {
        return uint256(keccak256(bytes(label)));
    }

    function _register(string calldata label, address owner, uint256 duration, bool updateRegistry)
        internal
        live
        onlyController
        returns (uint256)
    {
        uint256 id = uint256(keccak256(bytes(label)));
        uint256 expiry = block.timestamp + duration;

        require(available(id), "BaseRegistrar: Name is not available");
        require(isNotCollision(label), "BaseRegistrar: FLR Domain Already Exists In Collision Registry");
        require(expiry + GRACE_PERIOD > block.timestamp + GRACE_PERIOD, "BaseRegistrar: Expiry Overflow"); // Prevent future overflow

        expiries[id] = expiry;
        if (_exists(id)) {
            // Name was previously owned, and expired
            _burn(id);
        }
        _mint(owner, id);

        emit NameRegistered(label, id, owner, expiry);

        if (updateRegistry) {
            fns.setSubnodeOwner(baseNode, bytes32(id), owner);
        }

        return expiry;
    }

    function renew(uint256 id, uint256 duration) external override live onlyController returns (uint256) {
        require(expiries[id] + GRACE_PERIOD >= block.timestamp, "BaseRegistrar: Name has expired"); // Name must be registered here or in grace period
        require(expiries[id] + duration + GRACE_PERIOD > duration + GRACE_PERIOD, "BaseRegistrar: Expiry Overflow"); // Prevent future overflow

        expiries[id] += duration;
        emit NameRenewed(id, expiries[id]);
        return expiries[id];
    }

    /**
     * @dev Reclaim ownership of a name in IFNS, if you own it in the registrar.
     */
    function reclaim(uint256 id, address owner) external override live {
        require(_isApprovedOrOwner(msg.sender, id), "BaseRegistrar: Must be owner or approved");
        fns.setSubnodeOwner(baseNode, bytes32(id), owner);
    }

    function supportsInterface(bytes4 interfaceID) public pure override(ERC721, IERC165) returns (bool) {
        return interfaceID == INTERFACE_META_ID || interfaceID == ERC721_ID || interfaceID == RECLAIM_ID;
    }
}
