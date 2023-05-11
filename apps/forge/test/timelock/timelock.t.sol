// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import { TimelockController } from "../../src/timelock/TimelockController.sol";
import { StablePriceOracle } from "../../src/flr-registrar/StablePriceOracle.sol";
import { BaseRegistrar } from "../../src/flr-registrar/BaseRegistrar.sol";
import { NoNameCollisions } from "../../src/no-collisions/NoNameCollisions.sol";

// TODO: Import stablePriceOracle, BaseRegistrar, NoNameCollisions,

/// @dev Testing a solution in regards to Certik's Centralization Flag:
///      https://skynet.certik.com/projects/flrns-domains

contract TestTimelock is Test {

    function setUp() public {
        //
    }

    
}
