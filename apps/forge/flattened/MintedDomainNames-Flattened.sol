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

interface IFNS {
    // Logged when the owner of a node assigns a new owner to a subnode.
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address owner);

    // Logged when the owner of a node transfers ownership to a new account.
    event Transfer(bytes32 indexed node, address owner);

    // Logged when the resolver for a node changes.
    event NewResolver(bytes32 indexed node, address resolver);

    // Logged when the TTL of a node changes
    event NewTTL(bytes32 indexed node, uint64 ttl);

    // Logged when an operator is added or removed.
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    function setRecord(bytes32 node, address owner, address resolver, uint64 ttl) external;
    function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl) external;
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external returns (bytes32);
    function setResolver(bytes32 node, address resolver) external;
    function setOwner(bytes32 node, address owner) external;
    function setTTL(bytes32 node, uint64 ttl) external;
    function setApprovalForAll(address operator, bool approved) external;
    function owner(bytes32 node) external view returns (address);
    function resolver(bytes32 node) external view returns (address);
    function ttl(bytes32 node) external view returns (uint64);
    function recordExists(bytes32 node) external view returns (bool);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC721/IERC721.sol)

// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
     * understand this adds an external call which potentially creates a reentrancy vulnerability.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

interface IBaseRegistrar is IERC721 {
    event NewNoNameCollisions(address indexed noNameCollisions);
    event ControllerAdded(address indexed controller);
    event ControllerRemoved(address indexed controller);
    event ResolverSet(address indexed resolver);
    event NameRegistered(string indexed name, uint256 indexed id, address indexed owner, uint256 expires);
    event NameRenewed(uint256 indexed id, uint256 expires);

    // Authorises a controller, who can register and renew domains.
    function addController(address controller) external;

    // Revoke controller permission for an address.
    function removeController(address controller) external;

    // Set the resolver for the TLD this registrar manages.
    function setResolver(address resolver) external;

    // Returns the expiration timestamp of the specified label hash.
    function nameExpires(uint256 id) external view returns (uint256);

    // Returns true iff the specified name is available for registration.
    function available(uint256 id) external view returns (bool);

    // Returns true iff the specified name is not a collision in another registry
    function isNotCollision(string calldata name) external view returns (bool);

    /**
     * @dev Register a name.
     */
    function register(string calldata label, address owner, uint256 duration) external returns (uint256);

    function renew(uint256 id, uint256 duration) external returns (uint256);

    /**
     * @dev Reclaim ownership of a name in IFNS, if you own it in the registrar.
     */
    function reclaim(uint256 id, address owner) external;
}

// OpenZeppelin Contracts (last updated v4.7.0) (token/ERC1155/IERC1155.sol)

/**
 * @dev Required interface of an ERC1155 compliant contract, as defined in the
 * https://eips.ethereum.org/EIPS/eip-1155[EIP].
 *
 * _Available since v3.1._
 */
interface IERC1155 is IERC165 {
    /**
     * @dev Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`.
     */
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);

    /**
     * @dev Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all
     * transfers.
     */
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    /**
     * @dev Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to
     * `approved`.
     */
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    /**
     * @dev Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI.
     *
     * If an {URI} event was emitted for `id`, the standard
     * https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value
     * returned by {IERC1155MetadataURI-uri}.
     */
    event URI(string value, uint256 indexed id);

    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) external view returns (uint256);

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.
     *
     * Requirements:
     *
     * - `accounts` and `ids` must have the same length.
     */
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
        external
        view
        returns (uint256[] memory);

    /**
     * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,
     *
     * Emits an {ApprovalForAll} event.
     *
     * Requirements:
     *
     * - `operator` cannot be the caller.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns true if `operator` is approved to transfer ``account``'s tokens.
     *
     * See {setApprovalForAll}.
     */
    function isApprovedForAll(address account, address operator) external view returns (bool);

    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - If the caller is not `from`, it must have been approved to spend ``from``'s tokens via {setApprovalForAll}.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;
}

interface IMetadataService {
    function uri(uint256) external view returns (string memory);
}

interface INameWrapperUpgrade {
    function wrapFromUpgrade(
        bytes calldata name,
        address wrappedOwner,
        uint32 fuses,
        uint64 expiry,
        address approved,
        bytes calldata extraData
    ) external;
}

interface ISubdomainTracker {
    struct Data {
        uint256 id;
        address owner;
        string label;
    }

    function getAll(uint256 id) external view returns (Data[] memory, uint256 length);
    function add(uint256 parentId, uint256 subdomainId, address owner, string calldata subdomainLabel) external;
}

uint32 constant CANNOT_UNWRAP = 1;
uint32 constant CANNOT_BURN_FUSES = 2;
uint32 constant CANNOT_TRANSFER = 4;
uint32 constant CANNOT_SET_RESOLVER = 8;
uint32 constant CANNOT_SET_TTL = 16;
uint32 constant CANNOT_CREATE_SUBDOMAIN = 32;
uint32 constant CANNOT_APPROVE = 64;
//uint16 reserved for parent controlled fuses from bit 17 to bit 32
uint32 constant PARENT_CANNOT_CONTROL = 1 << 16;
uint32 constant IS_DOT_FLR = 1 << 17;
uint32 constant CAN_EXTEND_EXPIRY = 1 << 18;
uint32 constant CAN_DO_EVERYTHING = 0;
uint32 constant PARENT_CONTROLLED_FUSES = 0xFFFF0000;
// all fuses apart from IS_DOT_FLR
uint32 constant USER_SETTABLE_FUSES = 0xFFFDFFFF;

interface INameWrapper is IERC1155 {
    event NewMintedDomainNames(address indexed mintedDomainNames);
    event NewSubdomainTracker(address indexed subdomainTracker);
    event NewMetadataService(address indexed metadataService);
    event NewNameWrapperUpgrade(address indexed nameWrapperUpgrade);

    event NameWrapped(bytes32 indexed node, bytes name, address owner, uint32 fuses, uint64 expiry);
    event NameUnwrapped(bytes32 indexed node, address owner);

    event FusesSet(bytes32 indexed node, uint32 fuses);
    event ExpiryExtended(bytes32 indexed node, uint64 expiry);

    function fns() external view returns (IFNS);

    function registrar() external view returns (IBaseRegistrar);

    function metadataService() external view returns (IMetadataService);

    function names(bytes32) external view returns (bytes memory);

    function name() external view returns (string memory);

    function upgradeContract() external view returns (INameWrapperUpgrade);

    function updateMintedDomainNamesContract(IMintedDomainNames) external;

    function updateSubdomainTrackerContract(ISubdomainTracker) external;

    function supportsInterface(bytes4 interfaceID) external view returns (bool);

    function wrap(bytes calldata name, address wrappedOwner, address resolver) external;

    function wrapETH2LD(string calldata label, address wrappedOwner, uint16 ownerControlledFuses, address resolver)
        external
        returns (uint64 expires);

    function registerAndWrapETH2LD(
        string calldata label,
        address wrappedOwner,
        uint256 duration,
        address resolver,
        uint16 ownerControlledFuses
    ) external returns (uint256 registrarExpiry);

    function renew(uint256 labelHash, uint256 duration) external returns (uint256 expires);

    function unwrap(bytes32 node, bytes32 label, address owner) external;

    function unwrapETH2LD(bytes32 label, address newRegistrant, address newController) external;

    function upgrade(bytes calldata name, bytes calldata extraData) external;

    function setFuses(bytes32 node, uint16 ownerControlledFuses) external returns (uint32 newFuses);

    function setChildFuses(bytes32 parentNode, bytes32 labelhash, uint32 fuses, uint64 expiry) external;

    function setSubnodeRecord(
        bytes32 node,
        string calldata label,
        address owner,
        address resolver,
        uint64 ttl,
        uint32 fuses,
        uint64 expiry
    ) external returns (bytes32);

    function setRecord(bytes32 node, address owner, address resolver, uint64 ttl) external;

    function setSubnodeOwner(bytes32 node, string calldata label, address newOwner, uint32 fuses, uint64 expiry)
        external
        returns (bytes32);

    function extendExpiry(bytes32 node, bytes32 labelhash, uint64 expiry) external returns (uint64);

    function canModifyName(bytes32 node, address addr) external view returns (bool);

    function setResolver(bytes32 node, address resolver) external;

    function setTTL(bytes32 node, uint64 ttl) external;

    function ownerOf(uint256 id) external view returns (address owner);

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId) external view returns (address);

    function getData(uint256 id) external view returns (address, uint32, uint64);

    function setMetadataService(IMetadataService _metadataService) external;

    function uri(uint256 tokenId) external view returns (string memory);

    function setUpgradeContract(INameWrapperUpgrade _upgradeAddress) external;

    function allFusesBurned(bytes32 node, uint32 fuseMask) external view returns (bool);

    function isWrapped(bytes32) external view returns (bool);

    function isWrapped(bytes32, bytes32) external view returns (bool);
}

contract MintedDomainNames is IMintedDomainNames {
    mapping(uint256 => string) public tokenIdToName;
    mapping(address => IMintedDomainNames.Data[]) public mintedDomainNames;
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
    function getLength(address owner) external view returns (uint256) {
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
        for (uint256 i = 0; i < mintedDomainNames[owner].length; ++i) {
            if (nameWrapper.ownerOf(mintedDomainNames[owner][i].id) == owner) {
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
    function add(address owner, uint256 id, uint32 fuses, uint64 expiry, string calldata label)
        external
        isNameWrapper
    {
        // We're safe to add label here because id will always match label. At worst, we will overwrite
        tokenIdToName[id] = label;

        mintedDomainNames[owner].push(IMintedDomainNames.Data(id, fuses, expiry, label));
    }

    /**
     * @dev Add a user minted subdomain, gated to the NameWrapper contract
     * @param owner The address to add the id to
     * @param id the id of the registered subdomain
     * @param expiry the expiry timestamp of the registered subdomain
     * @param parentNodeTokenId the tokenID of the parent node to the subdomain
     * @param label the lable of the registered subdomain
     */
    function addSubdomain(
        address owner,
        uint256 id,
        uint32 fuses,
        uint64 expiry,
        uint256 parentNodeTokenId,
        string calldata label
    ) external isNameWrapper {
        string memory fullNameWithoutTLD = string.concat(label, ".", tokenIdToName[parentNodeTokenId]);
        // We're safe to add label here because id will always match label. At worst, we will overwrite
        tokenIdToName[id] = fullNameWithoutTLD;

        mintedDomainNames[owner].push(IMintedDomainNames.Data(id, fuses, expiry, fullNameWithoutTLD));
    }

    /**
     * @dev Add a user minted domain name, from transfer origin, meaning we already know the label
     * @param owner The address to add the id to
     * @param id the id of the registered domain name
     * @param expiry the expiry timestamp of the registered domain name
     */
    function addFromTransfer(address, /*oldOwner*/ address owner, uint256 id, uint32 fuses, uint64 expiry)
        external
        isNameWrapper
    {
        mintedDomainNames[owner].push(IMintedDomainNames.Data(id, fuses, expiry, tokenIdToName[id]));
    }
}
