// // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;
// pragma abicoder v2;

// import "forge-std/Test.sol";
// import "forge-std/console.sol";
// import "fns/resolvers/PublicResolver.sol";
// import "fns/registry/FNSRegistry.sol";
// import "fns/resolvers/mocks/DummyNameWrapper.sol";
// import "fns/wrapper/INameWrapper.sol";

// import "fns-test/utils/ENSNamehash.sol";
// import "fns-test/utils/HardhatAddresses.sol";

// contract TestPublicResolver is Test {
//     FNSRegistry public ens;
//     DummyNameWrapper public nameWrapper;
//     PublicResolver public resolver;

//     address immutable dummyTrustedETHController = address9;
//     address constant ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;

//     function setUp() public {
//         ens = new FNSRegistry();
//         nameWrapper = new DummyNameWrapper();
//         resolver = new PublicResolver(ens, INameWrapper(address(nameWrapper)), dummyTrustedETHController, ZERO_ADDRESS);

//         ens.setSubnodeOwner(0x0, keccak256('eth'), address(this));
//     }

//     // fallback function
//     function testFail_forbidsCallsToFallbackWithValue0() public {}
//     function testFail_forbidsCallsToFallbackWithValue1() public {}

//     // supportsInterface
//     function test_supportsKnownInterfaces() public{}
//     function test_doesNotSupportRandomInterface() public {}

//     // recordVersion
//     function test_recordVersion_permitsClearingRecords() public {}

//     // Addr
//     function test_addr_permitsSettingAddressByOwner() public {}
//     function test_addr_canOverwritePreviouslySetAddress() public {}
//     function test_addr_canOverwriteToSameAddress() public {}
//     function test_addr_forbidsSettingNewAddressByNonOwners() public {}
//     function test_addr_forbidsWritingSameAddressByNonOwners() public {}
//     function test_addr_forbidsOverwritingExistingAddressByNonOwners() public {}
//     function test_addr_returnsZeroWhenFetchingNonexistentAddresses() public {}
//     function test_addr_permitsSettingAndRetrievingAddressesForOtherCoinTypes() public {}
//     function test_addr_returnsETHAddressForCoinType60() public {}
//     function test_addr_settingCoinType60UpdatesETHAddress() public {}
//     function test_addr_forbidsCallsToFallbackFunctionWith1Value() public {}
//     function test_addr_resetsRecordOnVersionChange() public {}

//     // Addr
//     // function test_permitsSettingAddressByOwner() public {}
//     // function test_canOverwritePreviouslySetAddress() public {}
//     // function test_canOverwriteSameAddress() public {}
//     // function testFail_forbidsSettingNewAdressByNonOwners() public {}
//     // function testFail_forbidsWritingSameAddressByNonOwners() public {}
//     // function testFail_forbidsOverwritingExistingAddressByNonOwners() public {}
//     // function test_returnsZeroWhenFetchingNonexistentAddresses() public {}
//     // function test_permitsSettingAndRetrievingAddressesForOtherCoinTypes() public {}
//     // function test_returnsETHAddressForCoinType60() public {}
//     // function test_settingCoinType60UpdatesETHAddress() public {}
//     // function test_resetsRecordOnVersionChange() public {}

//     // Name
//     function test_name_permitsSettingNameByOwner() public {}
//     function test_name_canOverwritePreviouslySetNames() public {}
//     function testFail_name_forbidsSettingsNameByNonOwner() public {}
//     function test_name_returnsEmptyWhenFetchingNonexistentName() public {}
//     function test_name_resetsRecordOnVersionChange() public {}

//     // Pubkey
//     function test_pubKey_returnsEmptyWhenFetchingNonexistentValues() public {}
//     function test_pubKey_permitsSettingPublicKeyByOwner() public {}
//     function test_pubKey_canOverwritePreviouslySetValue() public {}
//     function test_pubKey_canOverwriteSameValue() public {}
//     function testFail_pubKey_forbidsSettingValueByNonOwners() public {}
//     function testFail_pubKey_forbidsWritingSameValueByNonOwners() public {}
//     function testFail_pubKey_forbidsOverwritingExistingValueByNonOwners() public {}
//     function test_pubKey_resetsRecordOnVersionChange() public {}

//     // ABI
//     function test_abi_returnsContentTypeOf0WhenNothingIsAvailable() public {}
//     function test_abi_returnsABIAfterItHasBeenSet() public {}
//     function test_abi_returnsFirstValidABI() public {}
//     function test_abi_allowsDeltingABIs() public {}
//     function testFail_abi_rejectsInvalidContentTypes() public {}
//     function testFail_abi_forbidsSettingValueByNonOwners() public {}
//     function test_abi_resetsOnVersionChange() public {}

//     // Text
//     function test_text_permitsSettingTextByOwner() public {}
//     function test_text_canOverwritePreviouslySetText() public {}
//     function test_text_canOverwriteToSameText() public {}
//     function testFail_text_forbidsSettingNewTextByNonOwners() public {}
//     function testFail_text_forbidsWritingSameTextByNonOwners() public {}
//     function test_text_resetsRecordOnVersionChange() public {}

//     // Contenthash
//     function test_contenthash_permitsSettingContenthashByOwner() public {}
//     function test_contenthash_canOverwritePreviouslySetContenthash() public {}
//     function test_contenthash_canOverwriteToSameContenthash() public {}
//     function testFail_contenthash_forbidsSettingContenthashByNonOwners() public {}
//     function testFail_contenthash_forbidsWritingSameContenthashBynonOwners() public {}
//     function test_contenthash_returnsEmptyWhenFetchingNonexistentContenthash() public {}
//     function test_contenthash_resetsRecordOnVersionChange() public {}

//     // DNS
//     function test_dns_permitsSettingNameByOwner() public {}
//     function test_dns_shouldUpdateExistingRecords() public {}
//     function test_dns_shouldKeepTrackOfEntries() public {}
//     function test_dns_shouldHandleSingleRecordUpdates() public {}
//     function testFail_dns_forbidsSettingDNSRecordsByNonOwners() public {}
//     function test_dns_permitsSettingZonehashByOwner() public {}
//     function test_dns_canOverwritePreviouslySetZonehash() public {}
//     function test_dns_canOverwriteToSameZonehash() public {}
//     function testFail_dns_forbdsSettingZonehashByNonOwners() public {}
//     function testFail_dns_forbidsWritingSameZonehashByNonOwners() public {}
//     function test_dns_returnsEmptyWhenFetchingNonexistentZonehash() public {}
//     function test_dns_emitsTheCorrectEvent() public {}
//     function test_dns_resetsDNSRecordsOnVersionChange() public {}
//     function test_dns_resetsZonehashOnVersionChange() public {}

//     // implementsInterface
//     function test_implementsInterface_permitsSettingInterfaceByOwner() public {}
//     function test_implementsInterface_canUpdatePreviouslySetInterface() public {}
//     function testFail_implementsInterface_forbidsSettingInterfaceByNonOwner() public {}
//     function test_implementsInterface_returns0WhenFetchingUnsetInterface() public {}
//     function test_implementsInterface_fallsBackToCallingImplementsInterfaceOnAddr() public {}
//     function test_implementsInterface_returns0OnFallbackWhenTargetContractDoesNotImplementInterface() public {}
//     function test_implementsInterface_returns0OnFallbackWhenTargetContractDoesNotSupportImplementsInterface() public {}
//     function test_implementsInterface_returns0OnFallbackWhenTargetIsNotAContract() public {}
//     function test_implementsInterface_resetsRecordOnVersionChange() public {}

//     // Authorisations
//     function test_authorisations_permitsAuthorisationsToBeSet() public {}
//     function test_authorisations_permitsAuthorisedUsersToMakeChanges() public {}
//     function test_authorisations_permitsAuthorisationsToBeCleared() public {}
//     function test_authorisations_permitsNonOwnersToSetAuthorisations() public {}
//     function test_authorisations_checksAuthorisationForCurrentOwner() public {}
//     function test_authorisations_trustedContractCanBypassAuthorisation() public {}
//     function test_authorisations_emitsAnApprovalForAllLog() public {}
//     function testFail_authorisations_revertsIfAttemptingToApproveSelfAsAnOperator() public {}
//     function test_authorisations_permitsNameWrapperOwnerToMakeChangesIfOwnerIsSetToNameWrapperAddress() public {}

//     // Token Approvals
//     function test_tokenApprovals_permitsDelegateToBeApproved() public {}
//     function test_tokenApprovals_permitsDelegatedUsersToMakeChanges() public {}
//     function test_tokenApprovals_permitsDelegationsToBeCleared() public {}
//     function test_tokenApprovals_permitsNonOwnersToSetDelegations() public {}
//     function test_tokenApprovals_checksTheDelegationForTheCurrentOwner() public {}
//     function test_tokenApprovals_emitsApprovedLog() public {}
//     function testFail_tokenApprovals_revertsIfAttemptingToDelegateSelfAsDelegate() public {}

//     // Multicall
//     function test_multicall_allowsSettingMultipleFields() public {}
//     function test_multicall_allowsReadingMultipleFields() public {}

// }