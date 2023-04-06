//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

import "./IPriceOracle.sol";
import "./StringUtils.sol";
// import "./IAggregator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@flare/userInterfaces/IFlareContractRegistry.sol";
import "@flare/userInterfaces/IFtsoRegistry.sol";

// StablePriceOracle sets a price in USD, based on an oracle.
contract StablePriceOracle is IPriceOracle, Ownable {
    using StringUtils for *;

    // This address is used to JIT (Just-In-Time) lookup the address of the FtsoRegistry,
    // which gives us a price oracle for FLR. This is the documented standard way to perform
    // a price oracle lookup. See: https://docs.flare.network/dev/reference/contracts/
    IFlareContractRegistry public immutable flareContractRegistry; // = IFlareContractRegistry(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019);

    // Number of Seconds in a Gregorian Calendar Year
    uint256 public constant secondsPerYear = 31556952;

    // Rent in base prices in attodollars (1e-18). This is done for easy math against wei
    // This means that these prices are USD multiplied by 1e18 on the input
    uint256 public price1LetterAttoUSDPerSec;
    uint256 public price2LetterAttoUSDPerSec;
    uint256 public price3LetterAttoUSDPerSec;
    uint256 public price4LetterAttoUSDPerSec;
    uint256 public price5LetterAttoUSDPerSec;

    // Oracle address
    // IAggregator public immutable usdOracle;

    event RentPriceChanged(uint256[5] prices);

    constructor(address _flareContractRegistry, uint256[5] memory _annualRentPricesUSD) {
        flareContractRegistry = IFlareContractRegistry(_flareContractRegistry);
        setPrices(_annualRentPricesUSD);
    }

    // Input prices are expected to be normal USD pricing in integer format:
    function setPrices(uint256[5] memory _annualRentPricesUSD) public onlyOwner {
        require(_annualRentPricesUSD[0] > 0, "Input 1 Letter Price is too small");
        require(_annualRentPricesUSD[1] > 0, "Input 2 Letter Price is too small");
        require(_annualRentPricesUSD[2] > 0, "Input 3 Letter Price is too small");
        require(_annualRentPricesUSD[3] > 0, "Input 4 Letter Price is too small");
        require(_annualRentPricesUSD[4] > 0, "Input 5+ Letter Price is too small");

        price1LetterAttoUSDPerSec = (_annualRentPricesUSD[0] * 1e18) / secondsPerYear;
        price2LetterAttoUSDPerSec = (_annualRentPricesUSD[1] * 1e18) / secondsPerYear;
        price3LetterAttoUSDPerSec = (_annualRentPricesUSD[2] * 1e18) / secondsPerYear;
        price4LetterAttoUSDPerSec = (_annualRentPricesUSD[3] * 1e18) / secondsPerYear;
        price5LetterAttoUSDPerSec = (_annualRentPricesUSD[4] * 1e18) / secondsPerYear;

        emit RentPriceChanged(_annualRentPricesUSD);
    }

    function price(
        string calldata name,
        uint256 expires,
        uint256 duration
    ) external view override returns (IPriceOracle.Price memory) {
        uint256 len = name.strlen();
        uint256 basePrice;

        if (len >= 5) {
            basePrice = price5LetterAttoUSDPerSec * duration;
        } else if (len == 4) {
            basePrice = price4LetterAttoUSDPerSec * duration;
        } else if (len == 3) {
            basePrice = price3LetterAttoUSDPerSec * duration;
        } else if (len == 2) {
            basePrice = price2LetterAttoUSDPerSec * duration;
        } else {
            basePrice = price1LetterAttoUSDPerSec * duration;
        }

        return
            IPriceOracle.Price({
                base: attoUSDToWei(basePrice),
                premium: attoUSDToWei(_premium(name, expires, duration))
            });
    }

    /**
     * @dev Returns the pricing premium in wei.
     */
    function premium(
        string calldata name,
        uint256 expires,
        uint256 duration
    ) external view returns (uint256) {
        return attoUSDToWei(_premium(name, expires, duration));
    }

    /**
     * @dev Returns the pricing premium in internal base units.
     */
    function _premium(
        string memory name,
        uint256 expires,
        uint256 duration
    ) internal view virtual returns (uint256) {
        return 0;
    }

    function getLatestPriceDataFromOracle() internal view returns (uint256 flrPriceUSD, uint256 timestamp, uint256 decimals) {
       // First, grab the FtsoRegistry contract address
        IFtsoRegistry ftsoRegistry = IFtsoRegistry(flareContractRegistry.getContractAddressByName("FtsoRegistry"));
        // Now, grab the pricing data from the on-chain Oracle Contract
        (flrPriceUSD, timestamp, decimals) = ftsoRegistry.getCurrentPriceWithDecimals("FLR"); 
    }

    function attoUSDToWei(uint256 amount) internal view returns (uint256) {
        (uint256 flrPriceUSD, /* unused */, uint256 decimals) = getLatestPriceDataFromOracle();
        return (amount * (1 * (10^decimals))) / flrPriceUSD;
    }

    function weiToAttoUSD(uint256 amount) internal view returns (uint256) {
        (uint256 flrPriceUSD, /* unused */, uint256 decimals) = getLatestPriceDataFromOracle();
        return (amount * flrPriceUSD) / (1 * (10^decimals));
    }

    function supportsInterface(
        bytes4 interfaceID
    ) public view virtual returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(IPriceOracle).interfaceId;
    }
}
