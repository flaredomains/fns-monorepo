//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface INameWrapperUpgrade {
    function wrapFromUpgrade(
        bytes calldata name,
        address wrappedOwner,
        uint32 fuses,
        uint64 expiry,
        bytes calldata extraData
    ) external;
}
