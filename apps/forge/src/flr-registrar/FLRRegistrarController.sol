// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {BaseRegistrar} from "./BaseRegistrar.sol";
import {StringUtils} from "./StringUtils.sol";
import {IResolver} from "fns/resolvers/IResolver.sol";
import {ReverseRegistrar} from "fns/registry/ReverseRegistrar.sol";
import {IFLRRegistrarController, IPriceOracle} from "./IFLRRegistrarController.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {INameWrapper} from "../wrapper/INameWrapper.sol";
import {ERC20Recoverable} from "fns/utils/ERC20Recoverable.sol";

// TODO: Remove
import "forge-std/console.sol";

error CommitmentTooNew(bytes32 commitment);
error CommitmentTooOld(bytes32 commitment);
error NameNotAvailable(string name);
error DurationTooShort(uint256 duration);
error ResolverRequiredWhenDataSupplied();
error UnexpiredCommitmentExists(bytes32 commitment);
error InsufficientValue();
error Unauthorised(bytes32 node);
error MaxCommitmentAgeTooLow();
error MaxCommitmentAgeTooHigh();

/**
 * @dev A registrar controller for registering and renewing names at fixed cost.
 */
contract FLRRegistrarController is Ownable, IFLRRegistrarController, IERC165, ERC20Recoverable {
    using StringUtils for *;
    using Address for address;

    uint256 public constant MIN_REGISTRATION_DURATION = 28 days;
    bytes32 private constant FLR_NODE = 0xfd9ed02f44147ba87d942b154c98562d831e3a24daea862ee12868ac20f7bcc3;
    uint64 private constant MAX_EXPIRY = type(uint64).max;
    BaseRegistrar immutable base;
    IPriceOracle public priceOracle;
    uint256 public immutable minCommitmentAge;
    uint256 public immutable maxCommitmentAge;
    ReverseRegistrar public immutable reverseRegistrar;
    INameWrapper public immutable nameWrapper;

    mapping(bytes32 => uint256) public commitments;

    event NameRegistered(
        string name, bytes32 indexed label, address indexed owner, uint256 baseCost, uint256 premium, uint256 expires
    );
    event NameRenewed(string name, bytes32 indexed label, uint256 cost, uint256 expires);
    event NewPriceOracle(address indexed oracle);

    constructor(
        BaseRegistrar _base,
        IPriceOracle _priceOracle,
        uint256 _minCommitmentAge,
        uint256 _maxCommitmentAge,
        ReverseRegistrar _reverseRegistrar,
        INameWrapper _nameWrapper
    ) {
        if (_maxCommitmentAge <= _minCommitmentAge) {
            console.log("revert MaxCommitmentAgeTooLow");
            revert MaxCommitmentAgeTooLow();
        }

        if (_maxCommitmentAge > block.timestamp) {
            console.log("revert MaxCommitmentAgeTooHigh");
            revert MaxCommitmentAgeTooHigh();
        }

        base = _base;
        priceOracle = _priceOracle;
        minCommitmentAge = _minCommitmentAge;
        maxCommitmentAge = _maxCommitmentAge;
        reverseRegistrar = _reverseRegistrar;
        nameWrapper = _nameWrapper;
    }

    function setPriceOracle(IPriceOracle _priceOracle) public onlyOwner {
        priceOracle = _priceOracle;
        emit NewPriceOracle(address(priceOracle));
    }

    function rentPrice(string memory name, uint256 duration)
        public
        view
        override
        returns (IPriceOracle.Price memory price)
    {
        bytes32 label = keccak256(bytes(name));
        price = priceOracle.price(name, base.nameExpires(uint256(label)), duration);
    }

    function valid(string memory name) public pure returns (bool) {
        return name.strlen() >= 1;
    }

    function available(string memory name) public view override returns (bool) {
        bytes32 label = keccak256(bytes(name));
        return valid(name) && base.available(uint256(label)) && base.isNotCollision(name);
    }

    function makeCommitment(
        string memory name,
        address owner,
        uint256 duration,
        bytes32 secret,
        address resolver,
        bytes[] calldata data,
        bool reverseRecord,
        uint16 ownerControlledFuses
    ) public pure override returns (bytes32) {
        bytes32 label = keccak256(bytes(name));
        if (data.length > 0 && resolver == address(0)) {
            //console.log("revert ResolverRequiredWhenDataSupplied");
            revert ResolverRequiredWhenDataSupplied();
        }
        return
            keccak256(abi.encode(label, owner, duration, secret, resolver, data, reverseRecord, ownerControlledFuses));
    }

    function commit(bytes32 commitment) public override {
        if (commitments[commitment] + maxCommitmentAge >= block.timestamp) {
            console.log("revert UnexpiredCommitmentExists(commitment)");
            revert UnexpiredCommitmentExists(commitment);
        }
        commitments[commitment] = block.timestamp;
    }

    function register(
        string calldata name,
        address owner,
        uint256 duration,
        bytes32 secret,
        address resolver,
        bytes[] calldata data,
        bool reverseRecord,
        uint16 ownerControlledFuses
    ) public payable override {
        IPriceOracle.Price memory price = rentPrice(name, duration);
        if (msg.value < price.base + price.premium) {
            console.log("revert InsufficientValue");
            revert InsufficientValue();
        }

        _consumeCommitment(
            name,
            duration,
            makeCommitment(name, owner, duration, secret, resolver, data, reverseRecord, ownerControlledFuses)
        );

        uint256 expires = nameWrapper.registerAndWrapETH2LD(name, owner, duration, resolver, ownerControlledFuses);

        if (data.length > 0) {
            _setRecords(resolver, keccak256(bytes(name)), data);
        }

        if (reverseRecord) {
            _setReverseRecord(name, resolver, msg.sender);
        }

        emit NameRegistered(name, keccak256(bytes(name)), owner, price.base, price.premium, expires);

        if (msg.value > (price.base + price.premium)) {
            payable(msg.sender).transfer(msg.value - (price.base + price.premium));
        }
    }

    function renew(string calldata name, uint256 duration) external payable override {
        bytes32 labelhash = keccak256(bytes(name));
        uint256 tokenId = uint256(labelhash);
        IPriceOracle.Price memory price = rentPrice(name, duration);
        if (msg.value < price.base) {
            console.log("revert InsufficientValue");
            revert InsufficientValue();
        }
        uint256 expires = nameWrapper.renew(tokenId, duration);

        if (msg.value > price.base) {
            payable(msg.sender).transfer(msg.value - price.base);
        }

        emit NameRenewed(name, labelhash, msg.value, expires);
    }

    function withdraw() public {
        payable(owner()).transfer(address(this).balance);
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return interfaceID == type(IERC165).interfaceId || interfaceID == type(IFLRRegistrarController).interfaceId;
    }

    /* Internal functions */

    function _consumeCommitment(string memory name, uint256 duration, bytes32 commitment) internal {
        // Require an old enough commitment.
        if (commitments[commitment] + minCommitmentAge > block.timestamp) {
            console.log("revert CommitmentTooNew");
            revert CommitmentTooNew(commitment);
        }

        // If the commitment is too old, or the name is registered, stop
        if (commitments[commitment] + maxCommitmentAge <= block.timestamp) {
            console.log("revert CommitmentTooOld");
            revert CommitmentTooOld(commitment);
        }
        if (!available(name)) {
            console.log("revert NameNotAvailable");
            revert NameNotAvailable(name);
        }

        delete (commitments[commitment]);

        if (duration < MIN_REGISTRATION_DURATION) {
            console.log("revert DurationTooShort");
            revert DurationTooShort(duration);
        }
    }

    function _setRecords(address resolverAddress, bytes32 label, bytes[] calldata data) internal {
        // use hardcoded .flr namehash
        bytes32 nodehash = keccak256(abi.encodePacked(FLR_NODE, label));
        IResolver resolver = IResolver(resolverAddress);
        resolver.multicallWithNodeCheck(nodehash, data);
    }

    function _setReverseRecord(string memory name, address resolver, address owner) internal {
        reverseRegistrar.setNameForAddr(msg.sender, owner, resolver, string.concat(name, ".flr"));
    }
}
