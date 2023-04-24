//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

import "fns/registry/IENS.sol";
import "./ETHRegistrarController.sol";
import "./IETHRegistrarController.sol";
import "fns/resolvers/IResolver.sol";
import "./IBulkRenewal.sol";
import "./IPriceOracle.sol";

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BulkRenewal is IBulkRenewal, IERC165, ReentrancyGuard {
    bytes32 private constant FLR_NAMEHASH =
        0xfd9ed02f44147ba87d942b154c98562d831e3a24daea862ee12868ac20f7bcc3;

    IENS public immutable ens;

    constructor(IENS _ens) {
        ens = _ens;
    }

    function getController() internal view returns (ETHRegistrarController) {
        IResolver r = IResolver(ens.resolver(FLR_NAMEHASH));
        return
            ETHRegistrarController(
                r.interfaceImplementer(
                    FLR_NAMEHASH,
                    type(IETHRegistrarController).interfaceId
                )
            );
    }

    function rentPrice(
        string[] calldata names,
        uint256 duration
    ) external view override returns (uint256 total) {
        ETHRegistrarController controller = getController();
        uint256 length = names.length;
        for (uint256 i = 0; i < length; ) {
            IPriceOracle.Price memory price = controller.rentPrice(
                names[i],
                duration
            );
            unchecked {
                ++i;
                total += (price.base + price.premium);
            }
        }
    }

    function renewAll(
        string[] calldata names,
        uint256 duration
    ) external payable override nonReentrant {
        ETHRegistrarController controller = getController();
        uint256 length = names.length;
        for (uint256 i = 0; i < length; ) {
            IPriceOracle.Price memory price = controller.rentPrice(
                names[i],
                duration
            );
            uint256 totalPrice = price.base + price.premium;
            controller.renew{value: totalPrice}(names[i], duration);
            unchecked {
                ++i;
            }
        }
        // Send any excess funds back
        Address.sendValue(payable(msg.sender), address(this).balance);
    }

    function supportsInterface(
        bytes4 interfaceID
    ) external pure returns (bool) {
        return
            interfaceID == type(IERC165).interfaceId ||
            interfaceID == type(IBulkRenewal).interfaceId;
    }
}
