//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

import "./IPriceOracle.sol";
import "./StringUtils.sol";
import "./IAggregator.sol";
import "@openzeppelin/access/Ownable.sol";
import "@openzeppelin/utils/introspection/IERC165.sol";
import "@flare/userInterfaces/IFlareContractRegistry.sol";

// StablePriceOracle sets a price in USD, based on an oracle.
contract StablePriceOracle is IPriceOracle {
    using StringUtils for *;

    // This address is used to JIT (Just-In-Time) lookup the address of the FtsoRegistry,
    // which gives us a price oracle for FLR. This is the documented standard way to perform
    // a price oracle lookup. See: https://docs.flare.network/dev/reference/contracts/
    IFlareContractRegistry public constant flareContractRegistry = IFlareContractRegistry(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019);
    address public ftsoRegistry;

    // Rent in base price units by length
    uint256 public immutable price1Letter;
    uint256 public immutable price2Letter;
    uint256 public immutable price3Letter;
    uint256 public immutable price4Letter;
    uint256 public immutable price5Letter;

    // Oracle address that prices 1 FLR in USD
    IAggregator public immutable flrUSDOracle;

    event RentPriceChanged(uint256[] prices);

    constructor(IAggregator _usdOracle, uint256[5] memory _rentPrices) {
        flrUSDOracle = _usdOracle;
        price1Letter = _rentPrices[0];
        price2Letter = _rentPrices[1];
        price3Letter = _rentPrices[2];
        price4Letter = _rentPrices[3];
        price5Letter = _rentPrices[4];
        ftsoRegistry = flareContractRegistry.getContractAddressByName("FtsoRegistry");
    }

    function price(
        string calldata name,
        uint256 expires,
        uint256 duration
    ) external view override returns (IPriceOracle.Price memory) {
        uint256 len = name.strlen();
        uint256 basePrice;

        if (len >= 5) {
            basePrice = price5Letter * duration;
        } else if (len == 4) {
            basePrice = price4Letter * duration;
        } else if (len == 3) {
            basePrice = price3Letter * duration;
        } else if (len == 2) {
            basePrice = price2Letter * duration;
        } else {
            basePrice = price1Letter * duration;
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

    function attoUSDToWei(uint256 amount) internal view returns (uint256) {
        uint256 flrPrice = uint256(flrUSDOracle.latestAnswer());
        return (amount * 1e8) / flrPrice;
    }

    function weiToAttoUSD(uint256 amount) internal view returns (uint256) {
        uint256 flrPrice = uint256(flrUSDOracle.latestAnswer());
        return (amount * flrPrice) / 1e8;
    }

    function supportsInterface(
        bytes4 interfaceID
    ) public view virtual returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(IPriceOracle).interfaceId;
    }
}
