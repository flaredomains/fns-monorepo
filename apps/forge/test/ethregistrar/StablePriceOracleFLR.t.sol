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
    event RentPriceChanged(uint256[5] prices);

    function setUp() public {
        stablePriceOracleFLR = new StablePriceOracleFLR(
            [
                uint256(1000),  // 1-letter name price (attoUSD)
                500,            // 2-letter name price (attoUSD)
                250,            // 3-letter name price (attoUSD)
                125,            // 4-letter name price (attoUSD)
                75              // 5-letter name price (attoUSD)
            ]
        );
    }

    function testFail_invalidConstructorArguments() public {
        StablePriceOracleFLR fail_stablePriceOracleFLR = new StablePriceOracleFLR(
            [
                // The smallest valid value is $1/year 
                uint256(1), // 1-letter name price (attoUSD)
                1,          // 2-letter name price (attoUSD)
                0,          // 3-letter name price (attoUSD)
                1,          // 4-letter name price (attoUSD)
                2           // 5-letter name price (attoUSD)
            ]
        );
    }

    function testFail_nonOwnerCantCallSetPrices() public {
        vm.prank(address0);
        stablePriceOracleFLR.setPrices(
            [
                uint256((700 * 1e18) / SECS_PER_YEAR),        // 1-letter name price (attoUSD)
                (350 * 1e18) / SECS_PER_YEAR,                 // 2-letter name price (attoUSD)
                (100 * 1e18) / SECS_PER_YEAR,                 // 3-letter name price (attoUSD)
                (50 * 1e18) / SECS_PER_YEAR,                  // 4-letter name price (attoUSD)
                (25 * 1e18) / SECS_PER_YEAR                   // 5-letter name price (attoUSD)
            ]
        );
    }

    function test_ownerCanCallSetPricesAndEventEmits() public {
        uint256[5] memory annualRentPricesUSD = [
            uint256(2000),  // 1-letter name price (attoUSD)
            500,            // 2-letter name price (attoUSD)
            250,            // 3-letter name price (attoUSD)
            125,            // 4-letter name price (attoUSD)
            75              // 5-letter name price (attoUSD)
        ];

        vm.expectEmit(true, false, false, false);
        emit RentPriceChanged(annualRentPricesUSD);

        stablePriceOracleFLR.setPrices(annualRentPricesUSD);
    }

    function test_1LetterPriceIsCorrect() public {
        uint256 oneLetterPriceUSDAnnual = 1000;
        uint256 oneLetterPriceAttoUSDAnnual = oneLetterPriceUSDAnnual * 1e18;
        uint256 oneLetterPriceAttoUSDPerSec = oneLetterPriceAttoUSDAnnual / stablePriceOracleFLR.secondsPerYear();
        uint256 numYearsToPrice = 5;

        // uint256 expectedPrice = 

        // assertEq(stablePriceOracleFLR.price("a", 0, stablePriceOracleFLR.secondsPerYear() * numYearsToPrice))
    }

    function test_2LetterPriceIsCorrect() public {}

    function test_3LetterPriceIsCorrect() public {}

    function test_4LetterPriceIsCorrect() public {}

    function test_5LetterPriceIsCorrect() public {}

    function test_GT5LetterPriceIsCorrect() public {}
}