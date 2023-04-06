//SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./IAggregator.sol";
import "@openzeppelin/access/Ownable.sol";

contract SimpleFLRPriceOracle is IAggregator, Ownable {
    uint256 value;

    constructor(uint256 _value) {
        set(_value);
    }

    function set(uint256 _value) public onlyOwner {
        value = _value;
    }

    function latestAnswer() public view returns (uint256) {
        return value;
    }
}
