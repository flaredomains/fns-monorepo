// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@flare/userInterfaces/IFlareContractRegistry.sol";

interface IMockFlareContractRegistry {
    /**
     * @notice Returns contract address for the given name - might be address(0)
     * @param _name             name of the contract
     */
    function getContractAddressByName(string calldata _name) external view returns (address);
}

contract MockFlareContractRegistry is IMockFlareContractRegistry {
    address immutable mockFtsoRegistry;

    constructor(address _mockFtsoRegistry) {
        mockFtsoRegistry = _mockFtsoRegistry;
    }

    function getContractAddressByName(string calldata /* _name */ ) external view returns (address) {
        return mockFtsoRegistry;
    }
}
