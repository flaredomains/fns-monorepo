pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Strings.sol";
import "fns-test/utils/fns_strings.sol";

/*
 * @dev Solidity implementation of the FNS namehash algorithm.
 *
 * Warning! Does not normalize or validate names before hashing.
 */
library FNSNamehash {
  using fns_strings for *;

  function namehash(bytes memory domain) internal pure returns (bytes32) {
    return namehash(domain, 0);
  }

  function namehash(bytes memory domain, uint i) internal pure returns (bytes32) {
    if (domain.length <= i)
      return 0x0000000000000000000000000000000000000000000000000000000000000000;

    uint len = LabelLength(domain, i);

    return keccak256(abi.encodePacked(namehash(domain, i+len+1), keccak(domain, i, len)));
  }

  function LabelLength(bytes memory domain, uint i) private pure returns (uint) {
    uint len;
    while (i+len != domain.length && domain[i+len] != 0x2e) {
      len++;
    }
    return len;
  }

  function keccak(bytes memory data, uint offset, uint len) private pure returns (bytes32 ret) {
    require(offset + len <= data.length);
    assembly {
      ret := keccak256(add(add(data, 32), offset), len)
    }
  }

  // Custom function to get the expected reverseNode hash for any address
  function getReverseNode(address addr) internal pure returns (bytes32 reverseNode) {
    string memory addrStr = Strings.toHexString(addr);
    string memory addrStrNoHexPrefix = addrStr.toSlice().beyond("0x".toSlice()).toString();
    string memory addrReverseStr = addrStrNoHexPrefix.toSlice().concat(".addr.reverse".toSlice());
    reverseNode = namehash(bytes(addrReverseStr));
  }
}