//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
interface IAggregator {
    function latestAnswer() external view returns (int256);
}
