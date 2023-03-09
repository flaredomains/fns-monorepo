// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/ethregistrar/BaseRegistrar.sol";

contract TestBaseRegistrar is Test {
    BaseRegistrar public registrar;
}