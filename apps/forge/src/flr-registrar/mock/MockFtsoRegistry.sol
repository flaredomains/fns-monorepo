// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IMockFtsoRegistry {
    function getCurrentPriceWithDecimals(string memory _symbol) external view
        returns(uint256 _price, uint256 _timestamp, uint256 _assetPriceUsdDecimals);
}

contract MockFtsoRegistry is IMockFtsoRegistry {
    uint256 public immutable staticPrice;
    uint256 public immutable staticTimestamp;
    uint256 public immutable staticDecimals;

    constructor(uint256 _staticPrice, uint256 _staticTimestamp, uint256 _staticDecimals) {
        staticPrice = _staticPrice;
        staticTimestamp = _staticTimestamp;
        staticDecimals = _staticDecimals;
    }

    function getCurrentPriceWithDecimals(string memory /* _symbol */)
        external
        view
        returns(uint256 _price, uint256 _timestamp, uint256 _assetPriceUsdDecimals)
    {
        return (staticPrice, staticTimestamp, staticDecimals);
    }
}