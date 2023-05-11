import React, { useEffect, useState } from 'react'
import Info from '../../public/Info.svg'
import Plus from '../../public/Plus.svg'
import Image from 'next/image'
import { Web3Button } from '@web3modal/react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi'
import { BigNumber, providers } from 'ethers'

import FLRRegistrarController from '@/pages/abi/FLRRegistrarController.json'
import PublicResolver from '@/pages/abi/PublicResolver.json'
import { MIN_COMMITMENT_AGE_SECS, MAX_COMMITMENT_AGE_SECS } from '@/constants/FLRRegistrarController'

import web3 from 'web3-utils'

const ETHERS_PROVIDER = new providers.JsonRpcProvider('https://flare-api.flare.network/ext/C/rpc');

enum RegisterState {
  Uncommitted,  // this is the default begin state (count => 0)
  Committable,  // reflects if commit will succeed or not (if there's a valid commitment already or not)
  Committing,   // committing transaction in progress
  Waiting,      // committing transaction complete, waiting timer in progress (count => 1)
  Unregistered, // timer complete, pending register transaction (count => 2)
  Registering,  // registering transaction in progress
  Registered    // registration complete (count => 3)
}

const ActionButton = ({ onClickFn, label } : { onClickFn: any, label: string }) => {
  return (
    <button
      onClick={() => onClickFn()}
      className="flex justify-center items-center px-6 py-3 bg-[#F97316] h-12 rounded-lg text-white px-auto hover:scale-105 transform transition duration-300 ease-out"
    >
      <p className="text-base font-semibold mr-2">{label}</p>
      <Image className="h-4 w-4" src={Plus} alt="FNS" />
    </button>
  )
}

const SpinnerButton = ({ label } : { label: string}) => {
  return (
    <>
      <div className="flex justify-center items-center px-6 py-3 bg-[#F97316] h-12 rounded-lg">
        <svg
          aria-hidden="true"
          className={`mr-2 w-4 h-4 text-[#ffffff] dark:text-gray-500 animate-spin fill-[#ffffff]`}
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentFill"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#F97316"
          />
        </svg>
        <p className="pl-2 text-white text-base font-semibold text-center">
          {label}
        </p>
      </div>
    </>
  )
}

const ReqToRegister = ({
  result,
  regPeriod,
  price,
  count,
  setCount,
}: {
  result: string
  regPeriod: number
  price: string
  count: number
  setCount: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [registerState, setRegisterState] = useState<RegisterState>(RegisterState.Uncommitted)
  const { address } = useAccount()

  useEffect(() => {
    setRegisterState(RegisterState.Uncommitted)
  }, [result])

  useEffect(() => {
    switch(registerState) {
      case RegisterState.Uncommitted: {
        setCount(0)
        break
      }
      case RegisterState.Waiting: {
        setCount(1)
        break
      }
      case RegisterState.Unregistered: {
        setCount(2)
        break
      }
      case RegisterState.Registered: {
        setCount(3)
        break
      }
    }
  }, [registerState, setCount])

  const { data: commitmentHash, isFetched: isMakeCommitmentReady } =
    useContractRead({
      address: FLRRegistrarController.address as `0x${string}`,
      abi: FLRRegistrarController.abi,
      functionName: 'makeCommitment',
      enabled: registerState === RegisterState.Uncommitted,
      args: [
        result as string,
        address as `0x${string}`,
        BigNumber.from(regPeriod).mul(31556952),
        web3.sha3(address as `0x${string}`),
        PublicResolver.address as `0x${string}`,
        [],
        false,
        0,
      ],
      onSuccess(data: any) {
        //console.log('Success makeCommitment', data)
      },
      onError(error) {
        console.error('Error makeCommitment', error)
      },
    })

  // Check if there's a pending commitment by the current wallet
  useContractRead({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'commitments',
    args: [commitmentHash],
    enabled: isMakeCommitmentReady,
    async onSuccess(data: any) {
      // console.log('Pending Commits Checked!', data)
      // console.log('Pending Commits Boolean Eval', data.isZero());

      // If this read returns 0, that means there is no equivalent pending commit
      // If this read returns 1, we need to wait any remaining time for the 1 minute timeout,
      // then set the state to register
      if(!data.isZero()) {
        try {
          const currentBlock = await ETHERS_PROVIDER.getBlockNumber()
          const blockTimestamp = (await ETHERS_PROVIDER.getBlock(currentBlock)).timestamp
          const secondsSinceCommit = BigNumber.from(blockTimestamp).sub(data).toNumber()
          // console.log("blockTimestamp", blockTimestamp)
          // console.log("commitmentTimestamp", data.toNumber())
          // console.log("secondsSinceCommit", secondsSinceCommit)

          // Ensure a small time buffer to account for UI easing function & updates
          if(secondsSinceCommit < (MIN_COMMITMENT_AGE_SECS - 2))  {
            setRegisterState(RegisterState.Waiting)
            wait(secondsSinceCommit)
          }
          // Ensure a reasonable time buffer so the user has time to make the txn
          else if (secondsSinceCommit < (MAX_COMMITMENT_AGE_SECS - 5)) {
            setRegisterState(RegisterState.Unregistered)
          }
          // Otherwise, secondsSinceCommit >= MAX_COMMITMENT_AGE_SECS, and can be re-committed
          else {
            setRegisterState(RegisterState.Committable)
          }
        } catch (error) {
          console.error("Error fetching block timestamp")
        }

        // TODO: Finish implementation of remaining timer, when data is between
        //       MIN and MAX_COMMITMENT_AGE_SECS
      }
      // If the data is zero, that means no matching commitment was found, which means we can
      // move to committable state, which prepares the write hook for commit
      else {
        setRegisterState(RegisterState.Committable)
      }
    },
    onError(error) {
      console.error('Error read commitments', error)
    },
  })

  const { config: configCommit } = usePrepareContractWrite({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'commit',
    args: [commitmentHash],
    enabled: isMakeCommitmentReady && registerState === RegisterState.Committable,
    onSuccess(data) {
      // console.log('Success prepare configCommit', data)
    },
    onError(error) {
      console.error('Error prepare configCommit', error)
    },
  })

  // Approve
  const { writeAsync: commit } = useContractWrite({
    ...configCommit,
    onSuccess(data) {
      // console.log('Success commit', data)
      setRegisterState(RegisterState.Committing)
    },
    onError(error) {
      console.error('Error commit', error)
    },
  })

  async function commitFunc() {
    await commit?.()
      .then(async (tx) => {
        const receipt = await tx.wait()
        if (receipt.status == 1) {
          // console.log('Commit transaction succeeded!', receipt.logs)
          setRegisterState(RegisterState.Waiting)
          wait(60) // Wait the full minute duration
          return
        }
        console.error('Commit transaction reverted!', receipt.logs)
      })
      .catch(() => {
        console.error('User rejected approval!')
      })
  }

  function wait(seconds: number) {
    setTimeout(() => {
      setRegisterState(RegisterState.Unregistered)
    }, seconds * 1000)
  }

  // Prepare Register
  const { config: configRegister } = usePrepareContractWrite({
    address: FLRRegistrarController.address as `0x${string}`,
    abi: FLRRegistrarController.abi,
    functionName: 'register',
    enabled: registerState === RegisterState.Unregistered, //registerReady,
    args: [
      result as string,
      address as `0x${string}`,
      BigNumber.from(regPeriod).mul(31556952),
      web3.sha3(address as `0x${string}`),
      PublicResolver.address as `0x${string}`,
      [],
      false,
      0,
    ],
    overrides: {
      from: address as `0x${string}`,
      value: BigNumber.from(price).add(BigNumber.from(price).div(100)),
      gasLimit: BigNumber.from(1000000),
    },
    onSuccess(data) {
      //console.log('Success prepare register', data)
    },
    onError(error) {
      console.error('Error prepare register', error)
    },
  })

  // Register
  const { writeAsync: register } = useContractWrite({
    ...configRegister,
    onSuccess(data) {
      //console.log('Success register', data)
      setRegisterState(RegisterState.Registering)
    },
    onError(error) {
      console.error('Error register', error)
    },
  })

  async function registerFunc() {
    await register?.()
      .then(async (tx) => {
        const receipt = await tx.wait()
        if (receipt.status == 1) {
          //console.log('Register transaction succeeded!', receipt.logs)
          setRegisterState(RegisterState.Registered)
          return
        }
        console.error('Register transaction reverted!', receipt.logs)
      })
      .catch(() => {
        console.error('User rejected approval!')
      })
  }

  return (
    <>
      <div className="mt-10 flex justify-center items-center w-full">
        { registerState === RegisterState.Committable ? (
          <ActionButton onClickFn={commitFunc} label={"Commit"}/>
        ) : registerState === RegisterState.Committing ? (
          <SpinnerButton label={"Committing"}/>
        ) : registerState === RegisterState.Waiting ? (
          <SpinnerButton label={"Waiting"}/>
        ) : registerState === RegisterState.Unregistered ? (
          <ActionButton onClickFn={registerFunc} label={"Register"}/>
        ) : registerState === RegisterState.Registering ? (
          <SpinnerButton label={"Registering"}/>
        ) : /* Registered returns empty fragment because we don't need a button */ (
          <></>
        )}
      </div>
    </>
  )
}

const WalletConnectBottom = () => {
  return (
    <>
      <div className="w-2/3 flex items-center bg-[#334155] h-12 rounded-lg text-[#9cacc0] px-5 mr-4">
        <Image className="h-4 w-4 mr-2" src={Info} alt="FNS" />
        <p className="text-xs font-medium">
          No wallet connected. Please connect to continue.
        </p>
      </div>
      <div
        className={`w-1/3 flex justify-center items-center h-12 rounded-lg text-white px-auto`}
      >
        <Web3Button icon="hide" label="Connect Wallet" balance="hide" />
      </div>
    </>
  )
}

export default function Bottom({
  result,
  regPeriod,
  price,
  count,
  setCount,
}: {
  result: string
  regPeriod: number
  price: string
  count: number
  setCount: React.Dispatch<React.SetStateAction<number>>
}) {
  const { address, isConnected } = useAccount() as any

  return (
    <>
      {/* Connect Wallet -- Hidden Mobile */}
      <div className="mt-10 flex items-center w-full">
        {isConnected ? (
          <>
            <ReqToRegister
              result={result}
              regPeriod={regPeriod}
              price={price}
              count={count}
              setCount={setCount}
            />
          </>
        ) : (
          <>
            <WalletConnectBottom />
          </>
        )}
      </div>
    </>
  )
}
