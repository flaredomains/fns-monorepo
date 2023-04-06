// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/ethregistrar/StablePriceOracle.sol";
import "fns/ethregistrar/mock/MockFtsoRegistry.sol";
import "fns/ethregistrar/mock/MockFlareContractRegistry.sol";

import "fns-test/utils/HardhatAddresses.sol";

address constant ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
// Set Timestamp to something reasonable (3/9/23 @ 1:25pm) so that BaseRegistrar time
// keeping works correctly. Forge defaults this to 1
uint256 constant TIME_STAMP = 1678393495;

uint256 constant SECS_PER_YEAR = 31556952;

contract TestStablePriceOracle is Test {
    StablePriceOracle public stablePriceOracle;
    MockFtsoRegistry public mockFtsoRegistry;
    MockFlareContractRegistry public mockFlareContractRegistry;

    // Price: $0.05 as uint256 with 5 decimal places
    uint256 public constant staticPricePerFLR = 5000;
    uint256 public constant staticDecimalsFLRPrice = 5;

    uint256 public constant oneLetterAnnualPriceUSD = 1000;
    uint256 public constant twoLetterAnnualPriceUSD = 500;
    uint256 public constant threeLetterAnnualPriceUSD = 250;
    uint256 public constant fourLetterAnnualPriceUSD = 125;
    uint256 public constant fiveLetterAnnualPriceUSD = 50;

    event RentPriceChanged(uint256[5] prices);

    function setUp() public {
        mockFtsoRegistry = new MockFtsoRegistry(staticPricePerFLR, block.timestamp, staticDecimalsFLRPrice);
        mockFlareContractRegistry = new MockFlareContractRegistry(address(mockFtsoRegistry));

        stablePriceOracle = new StablePriceOracle(
            address(mockFlareContractRegistry),
            [
                oneLetterAnnualPriceUSD,
                twoLetterAnnualPriceUSD,
                threeLetterAnnualPriceUSD,
                fourLetterAnnualPriceUSD,
                fiveLetterAnnualPriceUSD
            ]
        );
    }

    function testFail_invalidConstructorArguments() public {
        StablePriceOracle fail_stablePriceOracle = new StablePriceOracle(
            address(mockFlareContractRegistry),
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
        stablePriceOracle.setPrices(
            [
                uint256(2000),  // 1-letter name price (attoUSD)
                500,            // 2-letter name price (attoUSD)
                250,            // 3-letter name price (attoUSD)
                125,            // 4-letter name price (attoUSD)
                75              // 5-letter name price (attoUSD)
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

        stablePriceOracle.setPrices(annualRentPricesUSD);
    }

    function test_1LetterPriceIsCorrect() public {
        uint256 oneLetterPriceAttoUSDAnnual = oneLetterAnnualPriceUSD * 1e18;
        uint256 oneLetterPriceAttoUSDPerSec = oneLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 5;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (oneLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ^ staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("a", 0, numSecondsToPrice).base, expectedPrice);
    }

    function test_2LetterPriceIsCorrect() public {
        uint256 twoLetterPriceAttoUSDAnnual = twoLetterAnnualPriceUSD * 1e18;
        uint256 twoLetterPriceAttoUSDPerSec = twoLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 5;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (twoLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ^ staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("yo", 0, numSecondsToPrice).base, expectedPrice);
    }

    function test_3LetterPriceIsCorrect() public {
        uint256 threeLetterPriceAttoUSDAnnual = threeLetterAnnualPriceUSD * 1e18;
        uint256 threeLetterPriceAttoUSDPerSec = threeLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 5;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (threeLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ^ staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("wee", 0, numSecondsToPrice).base, expectedPrice);
    }


    function test_4LetterPriceIsCorrect() public {
        uint256 fourLetterPriceAttoUSDAnnual = fourLetterAnnualPriceUSD * 1e18;
        uint256 fourLetterPriceAttoUSDPerSec = fourLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 5;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (fourLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ^ staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("four", 0, numSecondsToPrice).base, expectedPrice);
    }


    function test_5LetterPriceIsCorrect() public {
        uint256 fiveLetterPriceAttoUSDAnnual = fiveLetterAnnualPriceUSD * 1e18;
        uint256 fiveLetterPriceAttoUSDPerSec = fiveLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 5;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (fiveLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ^ staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("ricky", 0, numSecondsToPrice).base, expectedPrice);
    }


    function test_GT5LetterPriceIsCorrect() public {
        uint256 fiveLetterPriceAttoUSDAnnual = fiveLetterAnnualPriceUSD * 1e18;
        uint256 fiveLetterPriceAttoUSDPerSec = fiveLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 5;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (fiveLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ^ staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("amuchlongernamethanfiveletters", 0, numSecondsToPrice).base, expectedPrice);
    }
}