// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "../../lib/forge-std/src/Test.sol";
import "../../src/registry/ReverseRegistrar.sol";
import "../../src/registry/ENSRegistry.sol";

contract TestReverseRegistrar is Test {
    ENSRegistry public ensRegistry;
    ReverseRegistrar public reverseRegistrar;

    function setUp() public {
        ensRegistry = new ENSRegistry();
        reverseRegistrar = new ReverseRegistrar(ensRegistry);
    }
}