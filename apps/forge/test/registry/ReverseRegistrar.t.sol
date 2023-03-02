// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/registry/ReverseRegistrar.sol";
import "fns/registry/ENSRegistry.sol";

contract TestReverseRegistrar is Test {
    ENSRegistry public ensRegistry;
    ReverseRegistrar public reverseRegistrar;


    function setUp() public {
        ensRegistry = new ENSRegistry();
        reverseRegistrar = new ReverseRegistrar(ensRegistry);

        bytes32 hash = keccak256('addr.reverse');
        console.logBytes32(hash);
    }


}