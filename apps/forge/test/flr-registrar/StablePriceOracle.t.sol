// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
pragma abicoder v2;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "fns/flr-registrar/StablePriceOracle.sol";
import "fns/flr-registrar/mock/MockFtsoRegistry.sol";
import "fns/flr-registrar/mock/MockFlareContractRegistry.sol";

import "fns-test/utils/HardhatAddresses.sol";

contract TestStablePriceOracle is Test {
    StablePriceOracle public stablePriceOracle;
    MockFtsoRegistry public mockFtsoRegistry;
    MockFlareContractRegistry public mockFlareContractRegistry;

    // Price: $0.025 as uint256 with 5 decimal places (2500 / 1e5 == 0.025)
    uint256 public constant staticPricePerFLR = 2500;
    uint256 public constant staticDecimalsFLRPrice = 5;

    uint256 public constant oneLetterAnnualPriceUSD = 500;
    uint256 public constant twoLetterAnnualPriceUSD = 350;
    uint256 public constant threeLetterAnnualPriceUSD = 300;
    uint256 public constant fourLetterAnnualPriceUSD = 100;
    uint256 public constant fiveLetterAnnualPriceUSD = 25;
    uint256 public constant sixLetterAnnualPriceUSD = 5;

    event RentPriceChanged(uint256[6] prices);

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
                fiveLetterAnnualPriceUSD,
                sixLetterAnnualPriceUSD
            ]
        );
    }

    function testFail_invalidConstructorArguments() public {
        new StablePriceOracle(
            address(mockFlareContractRegistry),
            [
                // The smallest valid value is $1/year 
                uint256(1), // 1-letter name price (attoUSD)
                1,          // 2-letter name price (attoUSD)
                1,          // 3-letter name price (attoUSD)
                1,          // 4-letter name price (attoUSD)
                1,          // 5-letter name price (attoUSD)
                1           // 6+ letter name price (attoUSD)
            ]
        );
    }

    function testFail_nonOwnerCantCallSetPrices() public {
        vm.prank(address0);
        stablePriceOracle.setPrices(
            [
                uint256(2000),
                500,
                250,
                125,
                75,
                50
            ]
        );
    }

    function test_ownerCanCallSetPricesAndEventEmits() public {
        uint256[6] memory annualRentPricesUSD = [
            uint256(2000),
            500,
            250,
            125,
            75,
            50
        ];

        vm.expectEmit(true, false, false, false);
        emit RentPriceChanged(annualRentPricesUSD);

        stablePriceOracle.setPrices(annualRentPricesUSD);
    }

    function test_1LetterPriceIsCorrect() public {
        uint256 oneLetterPriceAttoUSDAnnual = oneLetterAnnualPriceUSD * 1e18;
        uint256 oneLetterPriceAttoUSDPerSec = oneLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 1;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice =
            (oneLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ** staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("a", 0, numSecondsToPrice).base, expectedPrice);
    }

    function test_2LetterPriceIsCorrect() public {
        uint256 twoLetterPriceAttoUSDAnnual = twoLetterAnnualPriceUSD * 1e18;
        uint256 twoLetterPriceAttoUSDPerSec = twoLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 1;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice =
            (twoLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ** staticDecimalsFLRPrice))) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("yo", 0, numSecondsToPrice).base, expectedPrice);
    }

    function test_3LetterPriceIsCorrect() public {
        uint256 threeLetterPriceAttoUSDAnnual = threeLetterAnnualPriceUSD * 1e18;
        uint256 threeLetterPriceAttoUSDPerSec = threeLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 1;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (
            threeLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ** staticDecimalsFLRPrice))
        ) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("wee", 0, numSecondsToPrice).base, expectedPrice);
    }

    function test_4LetterPriceIsCorrect() public {
        uint256 fourLetterPriceAttoUSDAnnual = fourLetterAnnualPriceUSD * 1e18;
        uint256 fourLetterPriceAttoUSDPerSec = fourLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 1;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (
            fourLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ** staticDecimalsFLRPrice))
        ) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("four", 0, numSecondsToPrice).base, expectedPrice);
    }

    function test_5LetterPriceIsCorrect() public {
        uint256 fiveLetterPriceAttoUSDAnnual = fiveLetterAnnualPriceUSD * 1e18;
        uint256 fiveLetterPriceAttoUSDPerSec = fiveLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 1;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (
            fiveLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ** staticDecimalsFLRPrice))
        ) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("ricky", 0, numSecondsToPrice).base, expectedPrice);
    }

    function test_GTE6LetterPriceIsCorrect() public {
        uint256 sixLetterPriceAttoUSDAnnual = sixLetterAnnualPriceUSD * 1e18;
        uint256 sixLetterPriceAttoUSDPerSec = sixLetterPriceAttoUSDAnnual / stablePriceOracle.secondsPerYear();
        uint256 numYearsToPrice = 1;
        uint256 numSecondsToPrice = numYearsToPrice * stablePriceOracle.secondsPerYear();
        uint256 expectedPrice = (
            sixLetterPriceAttoUSDPerSec * numSecondsToPrice * (1 * (10 ** staticDecimalsFLRPrice))
        ) / staticPricePerFLR;

        assertEq(stablePriceOracle.price("amuchlongernamethansixletters", 0, numSecondsToPrice).base, expectedPrice);
    }
}
