import { Domain } from 'domain';
import React, { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import SendOrange from '../../public/Send_orange.png';
import SendWhite from '../../public/Send_white.png';
import Image from 'next/image';
import styles from '../../src/styles/Main.module.css';

import WalletConnect from '../WalletConnect';
import FlareLogo from '../../public/FlareLogo.png';

import { BigNumber, utils } from 'ethers';
import NameWrapper from '../../src/pages/abi/NameWrapper.json';

const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000';

function SendTokens() {
  const [isOpen, setIsOpen] = useState(false);
  const [addressDomain, setAddressDomain] = useState<Array<Domain>>([]);

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
    },
    onError(error) {
      console.log('Error ownerOf', error);
    },
  });

  const handleInput = (e: {
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
            <form className='flex flex-col w-full justify-center gap-4'>
              <div
                className={`flex items-center mx-auto w-3/4 py-2 px-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500 ${styles.autofill}`}
              >
                <Image
                  className='z-10 h-6 w-6 mr-2'
                  src={FlareLogo}
                  alt='Search'
                />
                <input
                  type='text'
                  name='receiver-name'
                  onChange={handleInput}
                  onInput={(event) => {
                    const inputElement = event.target as HTMLInputElement;
                    inputElement.value === ''
                      ? inputElement.setCustomValidity('')
                      : !pattern.test(inputElement.value)
                      ? inputElement.setCustomValidity(
                          'Should be a name with .flr at the end or flare wallet address.'
                        )
                      : inputElement.setCustomValidity('');
                  }}
                  className='w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal'
                  placeholder="Enter the receiver's domain name"
                  spellCheck='false'
                  required
                />
              </div>
              <div
                className={`flex items-center mx-auto w-1/2 py-2 px-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500 ${styles.autofill}`}
              >
                <input
                  type='text'
                  name='token-value'
                  onChange={(e) => {
                    console.log(e.target.value.toLowerCase());
                  }}
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
              <button className='flex w-48 mx-auto justify-center items-center px-6 py-3 bg-[#F97316] h-12 rounded-lg text-white px-auto hover:scale-105 transform transition duration-300 ease-out'>
                <p className='text-base font-semibold mr-1'>Send Token</p>
                <Image className='h-6 w-6' src={SendWhite} alt='Send' />
              </button>
            </form>
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
