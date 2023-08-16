import React, { useState, useEffect } from "react";
import DomainSelect from "../DomainSelect";
import WalletConnect from "../WalletConnect";
import SubdomainContent from "./SubdomainContent";

import { useRouter } from "next/router";

import NameWrapper from "../../src/pages/abi/NameWrapper.json";
import SubdomainTracker from "../../src/pages/abi/SubdomainTracker.json";

import web3 from "web3-utils";
const namehash = require("eth-ens-namehash");

import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";

export default function Subdomains({ result }: { result: string }) {
  // State variable that changed inside useEffect that check result and unlock Wagmi READ/WRITE function
  const [filterResult, setFilterResult] = useState<string>("");
  const [tokenId, setTokenId] = useState<BigNumber>();
  const [hashHex, setHashHex] = useState<string>("");
  const [preparedHash, setPreparedHash] = useState<boolean>(false);

  // State variable that changed inside Wagmi hooks
  const [arrSubdomains, setArrSubdomains] = useState<Array<string>>([]);

  const [tokenPrepared, setTokenPrepared] = useState(false);

  // Use to check that checkOwnerDomain={address === owner} -- prop of SubdomainContent component
  const { address } = useAccount();

  // Used for useEffect for avoid re-render
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const result = router.query.result as string;
    // Check if ethereum address
    if (/^0x[a-fA-F0-9]{40}$/.test(result)) {
      console.log("Ethereum address");
      setFilterResult(result);
    } else if (result) {
      if (result !== "") {
        setTokenId(BigNumber.from(namehash.hash(result)));
      }

      const resultFiltered = result.endsWith(".flr")
        ? result.slice(0, -4)
        : result;
      const hash = web3.sha3(resultFiltered) as string;
      setFilterResult(resultFiltered);
      setHashHex(hash);
      setPreparedHash(true);
    }
  }, [router.isReady, router.query]);

  // Read all subdomains under a given domain name
  const { refetch: refGetAll } = useContractRead({
    address: SubdomainTracker.address as `0x${string}`,
    abi: SubdomainTracker.abi,
    functionName: "getAll",
    enabled: tokenId !== undefined,
    args: [tokenId],
    onSuccess(data: any) {
      const subdomains = data.data.map((x: any) => ({
        domain: `${x.label}.${result}`,
        owner: x.owner,
        tokenId: x.id,
      }));
      setArrSubdomains(subdomains);
    },
    onError(error) {
      console.error("SubdomainTracker::getAll Error", error);
    },
  });

  // Get registrant address (owner)
  const { data: owner } = useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: "ownerOf",
    enabled: tokenPrepared,
    args: [tokenId],
    onSuccess(data) {},
    onError(error) {
      console.error("Error ownerOfLabel", error);
    },
  }) as any;

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <DomainSelect result={result} />

          {/* Change with Wagmi Array subdomains */}
          <SubdomainContent
            arrSubdomains={arrSubdomains}
            checkOwnerDomain={owner === address}
            filterResult={filterResult}
            refetchFn={refGetAll}
          />
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  );
}
