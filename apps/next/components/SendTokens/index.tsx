import React, { useState } from 'react';
import SendOrange from '../../public/Send_orange.png';
import SendWhite from '../../public/Send_white.png';
import Image from 'next/image';
import styles from '../../src/styles/Main.module.css';

import WalletConnect from '../WalletConnect';
import FlareLogo from '../../public/FlareLogo.png';
import { useDebounce } from 'use-debounce';
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
  useAccount,
  useBalance,
  useContractRead,
} from 'wagmi';
import { BigNumber, utils } from 'ethers';
import NameWrapper from '../../src/pages/abi/NameWrapper.json';

const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000';

const GetBalance = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });
  const truncatedFormatted = data?.formatted
    ? data.formatted.split('.')[0] +
      '.' +
      data.formatted.split('.')[1].slice(0, 4)
    : '';

  if (isLoading)
    return (
      <div className='flex w-full justify-center mb-6 text-slate-400'>
        Fetching balance…
      </div>
    );
  if (isError)
    return (
      <div className='flex w-full justify-center mb-6 text-slate-400'>
        Error fetching balance
      </div>
    );
  return (
    <div className='flex w-full justify-center mb-6 text-slate-400'>
      Your Balance: {truncatedFormatted}... {data?.symbol}
    </div>
  );
};

function SendTokens() {
  const [isOpen, setIsOpen] = useState(false);
  const [to, setTo] = React.useState('');
  const [finalTo, setFinalTo] = React.useState('0');
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState('0');
  const [finalAmount, setFinalAmount] = React.useState('0');
  const [debouncedAmount] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { address, isConnected } = useAccount();
  const [hash, setHash] = useState<string>('');
  const [inputUsable, setInputUsable] = useState<boolean>(false);

  const [isValid, setIsValid] = useState<boolean>();
  const pattern = /^[a-zA-Z0-9-_$]+\.flr$/;

  useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'ownerOf',
    enabled: inputUsable,
    args: [hash],
    onSuccess(data: string) {
      setIsValid(data !== ZERO_ADDRESS);
      if (data !== ZERO_ADDRESS) {
        setTo(data);
      }
    },
    onError(error) {
      console.log('Error ownerOf', error);
    },
  });

  const handleReceiverInput = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    const inputValue = e.target.value as string;

    // Check if the input value matches the desired pattern: at least one letter followed by ".flr"
    const isFlrInput = pattern.test(inputValue);

    if (isFlrInput) {
      setHash(utils.namehash(inputValue));
    }

    setInputUsable(isFlrInput);
  };

  const handleAmountInput = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    setAmount(e.target.value as string);
  };
  return (
    <div
      onClick={() => {
        isOpen && setIsOpen(false);
      }}
      className='flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full'
    >
      <div className='flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2'>
        <div className='flex items-center py-5 border-b border-gray-700'>
          <div className='flex-col items-center w-full lg:flex lg:flex-row lg:w-1/2'>
            <Image
              className='h-11 w-11 mr-6 mb-4 lg:mb-0'
              src={SendOrange}
              alt='Account'
            />
            <div className='flex-col mr-7'>
              <p className='text-gray-400 font-normal text-sm'>
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : 'Not Connected'}
              </p>
              <p className='text-white font-bold text-3xl py-2'>Send Tokens</p>
              <p className='text-gray-400 font-normal text-sm'>
                Send Tokens to a Flare domain
              </p>
            </div>
          </div>
        </div>

        {isConnected ? (
          <div className='flex flex-col items-center py-4 mb-4 mt-10'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFinalTo(to);
                setFinalAmount(amount);
                sendTransaction?.();
              }}
              className='flex flex-col w-full justify-center'
            >
              <div
                className={`flex items-center mx-auto w-3/4 py-2 px-4 mb-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500 ${styles.autofill}`}
              >
                <Image
                  className='z-10 h-6 w-6 mr-2'
                  src={FlareLogo}
                  alt='Search'
                />
                <input
                  type='text'
                  name='receiver-name'
                  onChange={handleReceiverInput}
                  onInput={(event) => {
                    const inputElement = event.target as HTMLInputElement;
                    inputElement.value === ''
                      ? inputElement.setCustomValidity('')
                      : !pattern.test(inputElement.value)
                      ? (inputElement.setCustomValidity(
                          'Should be a name with .flr at the end or flare wallet address.'
                        ),
                        setIsValid(false))
                      : inputElement.setCustomValidity('');
                  }}
                  className='w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal'
                  placeholder="Enter the receiver's domain name"
                  spellCheck='false'
                  required
                />
                {isValid === true ? (
                  <div>
                    <Image
                      className='h-4 w-4'
                      src='./Like.svg'
                      width={20}
                      height={20}
                      alt='Like'
                    />
                  </div>
                ) : (
                  isValid === false && (
                    <div>
                      <Image
                        className='h-4 w-4'
                        src='./Dislike.svg'
                        width={20}
                        height={20}
                        alt='Like'
                      />
                    </div>
                  )
                )}
              </div>
              <div className='flex w-full justify-center text-slate-400 '>
                {isValid === false && (
                  <p className='mb-4'>
                    The input is not a valid domain name or doesn&apos;t exist
                  </p>
                )}
              </div>
              <div
                className={`flex items-center mx-auto w-1/2 py-2 px-4 h-12 mb-2 rounded-md bg-gray-700 border-2 border-gray-500 ${styles.autofill}`}
              >
                <input
                  type='text'
                  name='token-value'
                  onChange={handleAmountInput}
                  onInput={(event) => {
                    const inputElement = event.target as HTMLInputElement;
                    inputElement.setCustomValidity('');
                  }}
                  className='w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal'
                  placeholder='0.0'
                  spellCheck='false'
                  required
                />
              </div>
              <GetBalance />
              <button
                disabled={
                  (!isValid && parseFloat(amount) === 0) ||
                  amount === '' ||
                  isLoading ||
                  !sendTransaction
                }
                className='flex w-48 mx-auto justify-center items-center px-6 py-3 bg-[#F97316] h-12 rounded-lg text-white px-auto hover:scale-105 transform transition duration-300 ease-out disabled:border-gray-500 disabled:bg-gray-500 disabled:hover:scale-100 disabled:cursor-not-allowed'
              >
                <p className='text-base font-semibold mr-1'>
                  {isLoading ? 'Sending...' : 'Send Tokens'}
                </p>
                <Image className='h-6 w-6' src={SendWhite} alt='Send' />
              </button>
            </form>
            {isSuccess && (
              <div className='flex flex-col w-full justify-center items-center mt-8 text-white'>
                Successfully sent {finalAmount} Flare to {finalTo}
                <div>
                  <a
                    href={`https://etherscan.io/tx/${data?.hash}`}
                    className='flex mt-2 py-1 px-4 rounded-full bg-[#F97316] hover:scale-105 transform transition duration-300 ease-out'
                  >
                    Etherscan
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='flex-col py-4 mb-4 mt-10'>
            <p className='text-white font-semibold text-lg mb-2'>
              Wallet Not Connected
            </p>
            <p className='text-gray-400 font-medium text-sm'>
              Connect your wallet to send tokens
            </p>
          </div>
        )}
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}

export default SendTokens;
