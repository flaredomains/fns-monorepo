//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

import "./IPriceOracle.sol";
import "./StringUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@flare/userInterfaces/IFlareContractRegistry.sol";
import "@flare/userInterfaces/IFtsoRegistry.sol";

// StablePriceOracleFLR sets a price in USD, and converts that price to FLR based on the standard on-chain oracle
contract StablePriceOracleFLR is IPriceOracle, Ownable {
    using StringUtils for *;

    // This address is used to JIT (Just-In-Time) lookup the address of the FtsoRegistry,
    // which gives us a price oracle for FLR. This is the documented standard way to perform
    // a price oracle lookup. See: https://docs.flare.network/dev/reference/contracts/
    IFlareContractRegistry public constant flareContractRegistry = IFlareContractRegistry(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019);
    // IFtsoRegistry public ftsoRegistry;

    // Number of Seconds in a Gregorian Calendar Year
    uint256 public constant secondsPerYear = 31556952;

    // Rent in base prices in attodollars (1e-18). This is done for easy math against wei
    // This means that these prices are USD multiplied by 1e18 on the input
    uint256 public price1LetterAttoUSDPerSec;
    uint256 public price2LetterAttoUSDPerSec;
    uint256 public price3LetterAttoUSDPerSec;
    uint256 public price4LetterAttoUSDPerSec;
    uint256 public price5LetterAttoUSDPerSec;

    event RentPriceChanged(uint256[5] prices);

    constructor(uint256[5] memory _rentPricesAttoUSDPerSec) {
        setPrices(_rentPricesAttoUSDPerSec);
    }

    // Input prices are expected to be normal USD pricing multiplied by 1e18:
    function setPrices(uint256[5] memory _rentPricesAttoUSDPerSec) public onlyOwner {
        require((_rentPricesAttoUSDPerSec[0] * secondsPerYear) / 1e18 > 0, "Input 1 Letter Price is too small");
        require((_rentPricesAttoUSDPerSec[1] * secondsPerYear) / 1e18 > 0, "Input 2 Letter Price is too small");
        require((_rentPricesAttoUSDPerSec[2] * secondsPerYear) / 1e18 > 0, "Input 3 Letter Price is too small");
        require((_rentPricesAttoUSDPerSec[3] * secondsPerYear) / 1e18 > 0, "Input 4 Letter Price is too small");
        require((_rentPricesAttoUSDPerSec[4] * secondsPerYear) / 1e18 > 0, "Input 5+ Letter Price is too small");

        price1LetterAttoUSDPerSec = _rentPricesAttoUSDPerSec[0];
        price2LetterAttoUSDPerSec = _rentPricesAttoUSDPerSec[1];
        price3LetterAttoUSDPerSec = _rentPricesAttoUSDPerSec[2];
        price4LetterAttoUSDPerSec = _rentPricesAttoUSDPerSec[3];
        price5LetterAttoUSDPerSec = _rentPricesAttoUSDPerSec[4];

        emit RentPriceChanged(_rentPricesAttoUSDPerSec);
    }

    function price(
        string calldata name,
        uint256 expires,
        uint256 durationSeconds
    ) external view override returns (IPriceOracle.Price memory) {
        // First, grab the FtsoRegistry contract address
        IFtsoRegistry ftsoRegistry = IFtsoRegistry(flareContractRegistry.getContractAddressByName("FtsoRegistry"));
        
        // Now, grab the pricing data from the on-chain Oracle Contract
        (uint256 flrPriceUSD, uint256 timestamp, uint256 decimals) = 
            ftsoRegistry.getCurrentPriceWithDecimals("FLR");
        
        uint256 len = name.strlen();
        uint256 basePrice;

        if (len >= 5) {
            basePrice = price5LetterAttoUSDPerSec * durationSeconds;
        } else if (len == 4) {
            basePrice = price4LetterAttoUSDPerSec * durationSeconds;
        } else if (len == 3) {
            basePrice = price3LetterAttoUSDPerSec * durationSeconds;
        } else if (len == 2) {
            basePrice = price2LetterAttoUSDPerSec * durationSeconds;
        } else {
            basePrice = price1LetterAttoUSDPerSec * durationSeconds;
        }

        // Because our price was originally in attodaollars like wei (1e18), we simply need to multiply by the number
        // of decimals returned by the oracle, then divide by that price (as a uint256)
        return IPriceOracle.Price({price: (basePrice * (1 * (10^decimals))) / flrPriceUSD, oracleTimestamp: timestamp});
    }

    function supportsInterface(
        bytes4 interfaceID
    ) public view virtual returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(IPriceOracle).interfaceId;
    }
}
