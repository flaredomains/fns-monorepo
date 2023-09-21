import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import styles from '../../src/styles/Main.module.css';
import { isAddress } from 'web3-validator';

import { useDebounce } from 'use-debounce';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import { parseEther, namehash } from 'viem';
import NameWrapper from '../../src/pages/abi/NameWrapper.json';

const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000';

function Modals({
  domain,
  isModalOpen,
  setIsModalOpen,
}: {
  domain: any;
  isModalOpen: any;
  setIsModalOpen: any;
}) {
  function closeModal() {
    setIsModalOpen(false);
  }

  const [receiver, setReceiver] = React.useState('');
  const [to, setTo] = React.useState('');
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState('');
  const [controlledAmount, setControlledAmount] = React.useState('0');
  const [debouncedAmount] = useDebounce(controlledAmount, 500);

  const [hash, setHash] = useState<string>('');
  const [inputUsable, setInputUsable] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>();

  const domainPattern = /^[a-zA-Z0-9-_$]+\.flr$/;
  const ethAddressPattern = /^(0x)?[0-9a-fA-F]{40}$/;

  const handleReceiverInput = (e: {
    target: { value: React.SetStateAction<string | undefined> };
  }) => {
    const inputValue = e.target.value as string;
    setReceiver(inputValue);
    // Check if the input value matches the desired pattern: at least one letter followed by ".flr"
    const isFlrInput = domainPattern.test(inputValue);

    // Check if the input value matches the ETH address pattern
    const isEthAddress = ethAddressPattern.test(inputValue);

    setInputUsable(isFlrInput || isEthAddress);

    if (isFlrInput) {
      setHash(namehash(inputValue));
      setInputUsable(isFlrInput);
    }

    if (isEthAddress) {
      if (isAddress(inputValue)) {
        setTo(inputValue);
        setIsValid(true);
        setInputUsable(isEthAddress);
      }
    }
  };

  useContractRead({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'ownerOf',
    enabled: inputUsable,
    args: [hash],
    onSuccess(data: string) {
      console.log('Success ownerOf', data);
      setIsValid(data !== ZERO_ADDRESS);
      if (data !== ZERO_ADDRESS) {
        setTo(data);
      }
    },
    onError(error) {
      console.log('Error ownerOf', error);
    },
  });

  const { config: configsetTransferOwnership } = usePrepareContractWrite({
    address: NameWrapper.address as `0x${string}`,
    abi: NameWrapper.abi,
    functionName: 'transferOwnership',
    enabled: inputUsable,
    args: [to as `0x${string}`],
    onSuccess(data) {
      console.log('Success prepare transferOwnership', data);
    },
    onError(error) {
      console.log('Error prepare transferOwnership', error);
    },
  });

  const { data: transferData, write: setTransferOwnership } = useContractWrite({
    ...configsetTransferOwnership,
    async onSuccess(data) {
      console.log('Success  setTransferOwnership', data);
    },
    onError(error) {
      console.log('Error  setTransferOwnership', error);
    },
  });

  return (
    <>
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[1px] transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-slate-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                  <div>
                    <div className='mt-6 text-center sm:mt-5'>
                      <Dialog.Title
                        as='h3'
                        className='font-bold leading-6 text-slate-50 text-xl text-center'
                      >
                        {`Enter a valid ETH address or a domain name.`}
                      </Dialog.Title>

                      <div
                        className={`flex items-center mx-auto w-3/4 py-2 px-4 my-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500 ${
                          styles.autofill
                        } ${
                          isValid === true
                            ? 'border-green-500'
                            : isValid === false && 'border-red-500'
                        }`}
                      >
                        <input
                          type='text'
                          name='receiver-name'
                          onChange={handleReceiverInput}
                          onInput={(event) => {
                            const inputElement =
                              event.target as HTMLInputElement;
                            inputElement.value === ''
                              ? (inputElement.setCustomValidity(''),
                                setIsValid(undefined))
                              : !domainPattern.test(inputElement.value)
                              ? (inputElement.setCustomValidity(
                                  'Should be a name with .flr at the end or flare wallet address.'
                                ),
                                setIsValid(false))
                              : inputElement.setCustomValidity('');
                          }}
                          className='w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal'
                          placeholder='Address or domain name.'
                          spellCheck='false'
                          required
                          value={receiver}
                        />
                      </div>
                      <div className='flex w-full justify-center text-slate-400 '>
                        {isValid === true ? (
                          <p className='flex mb-4 w-full break-all'>
                            Address: {to}
                          </p>
                        ) : (
                          isValid === false && (
                            <p className='flex mb-4'>
                              The input is not a valid domain name or
                              doesn&apos;t exist
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-center items-center w-full'>
                    <button
                      onClick={() => setTransferOwnership?.()}
                      disabled={!isValid}
                      className='flex w-48 mx-auto justify-center items-center px-6 py-3 bg-[#F97316] h-12 rounded-lg text-white px-auto hover:scale-105 transform transition duration-300 ease-out disabled:border-gray-500 disabled:bg-gray-500 disabled:hover:scale-100 disabled:cursor-not-allowed'
                    >
                      <p className='text-base font-semibold mr-1'>
                        Send Tokens
                      </p>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Modals;
