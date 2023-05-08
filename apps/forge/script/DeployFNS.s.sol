pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import "./DeployFNSAbstract.s.sol";

contract DeployFNS is Script, DeployFNSAbstract {
    // Parent's run() runs first
    function run() external {}
}
