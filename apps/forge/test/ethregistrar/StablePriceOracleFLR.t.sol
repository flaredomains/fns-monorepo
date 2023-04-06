// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/ethregistrar/StablePriceOracleFLR.sol";

import "fns-test/utils/HardhatAddresses.sol";

address constant ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
// Set Timestamp to something reasonable (3/9/23 @ 1:25pm) so that BaseRegistrar time
// keeping works correctly. Forge defaults this to 1
uint256 constant TIME_STAMP = 1678393495;

uint256 constant SECS_PER_YEAR = 31556952;

contract TestStablePriceOracleFLR is Test {
    StablePriceOracleFLR public stablePriceOracleFLR;

    function setUp() public {
        stablePriceOracleFLR = new StablePriceOracleFLR(
            [
                uint256((700 * 1e18) / SECS_PER_YEAR),        // 1-letter name price (attoUSD)
                (350 * 1e18) / SECS_PER_YEAR,                 // 2-letter name price (attoUSD)
                (100 * 1e18) / SECS_PER_YEAR,                 // 3-letter name price (attoUSD)
                (50 * 1e18) / SECS_PER_YEAR,                  // 4-letter name price (attoUSD)
                (25 * 1e18) / SECS_PER_YEAR                   // 5-letter name price (attoUSD)
            ]
        );
    }

    function testFail_invalidConstructorArguments() public {
        StablePriceOracleFLR fail_stablePriceOracleFLR = new StablePriceOracleFLR(
            [
                // The smallest valid value is $2/year 
                uint256((2 * 1e18) / SECS_PER_YEAR),        // 1-letter name price (attoUSD)
                350,                 // 2-letter name price (attoUSD)
                100,                 // 3-letter name price (attoUSD)
                50,                  // 4-letter name price (attoUSD)
                25                   // 5-letter name price (attoUSD)
            ]
        );
    }
}