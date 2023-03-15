// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/resolvers/PublicResolver.sol";
import "fns/registry/ENSRegistry.sol";
import "fns/wrapper/NameWrapper.sol";

import "fns-test/utils/ENSNamehash.sol";
import "fns-test/utils/HardhatAddresses.sol";

address constant ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;

contract TestPublicResolver is Test {

}