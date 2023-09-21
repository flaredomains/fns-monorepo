import React, { useState } from 'react';
import Image from 'next/image';
import Avatar from '../../public/Avatar.svg';
import Send from '../../public/Send_white.png';
import WalletConnect from '../WalletConnect';
// import Link from "next/link";
import { Link } from 'react-router-dom';
import AccountLine from './AccountLine';
import ReverseRecord from './ReverseRecord';

import { useAccount, useContractRead } from 'wagmi';

import MintedDomainNames from '../../src/pages/abi/MintedDomainNames.json';
import SendModal from './SendModal';

const OwnedDomains = ({
  date,
  domain,
  isSubdomain,
}: {
  date: Date;
  domain: string;
  isSubdomain: boolean;
}) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let [isModalOpen, setIsModalOpen] = useState(false);
  // let [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  return (
    <>
      <div className='grid grid-cols-6  gap-4 w-full sm:items-center justify-between md:px-6 py-5'>
        <div className='col-span-3 inline-flex flex-row items-center'>
          {/* Avatar */}
          <Image className='h-8 w-8 mr-2' src={Avatar} alt='Avatar' />

          {/* Domain */}
          <Link to={`../details/${domain}.flr`}>
            <p
              className={
                'text-white font-semibold text-base break-all cursor-pointer hover:underline hover:underline-offset-2'
              }
            >
              {domain}.flr
            </p>
          </Link>
        </div>
        {/* Send */}
        <div className='flex col-span-1 items-center justify-center'>
          <button
            className='flex h-6 w-6 justify-center items-center hover:brightness-150 hover:bg-gray-100 hover:bg-opacity-20 rounded-full'
            onClick={() => setIsModalOpen(true)}
          >
            <Image className='h-5 w-5' src={Send} alt='Avatar' />
          </button>
          <SendModal
            domain={domain}
            isModalOpen={isModalOpen}
            setIsModalOpen={() => setIsModalOpen(false)}
          />
        </div>
        {/* Date exp */}
        <div className='flex col-span-2 w-full items-center justify-center bg-gray-700 rounded-lg px-3 md:shrink-0'>
          <p className='text-gray-300 text-xs font-medium py-1'>
            {isSubdomain ? 'No Expiry' : `Expires ${month}/${day}/${year}`}
          </p>
        </div>
      </div>
    </>
  );
};

type Domain = {
  label: string;
  expire: number;
  isSubdomain: boolean;
};

export default function MyAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [addressDomain, setAddressDomain] = useState<Array<Domain>>([]);

  const { address, isConnected } = useAccount();

  const { data } = useContractRead({
    address: MintedDomainNames.address as `0x${string}`,
    abi: MintedDomainNames.abi,
    functionName: 'getAll',
    args: [address],
    enabled: isConnected,
    onSuccess(data: any) {
      console.log('Success getAll', data[0]);
      // console.log('Get array of domains', data)

      // Ensure we only use the length returned for still-owned domains (after a transfer)
      if (data) {
        const arrDomains = data[0].slice(0, data[0].length);
        const ownedDomain = arrDomains.map((item: any, index: any) => {
          return {
            label: item.label,
            expire: Number(item.expiry),
            isSubdomain: /[a-zA-Z0-9]+\.{1}[a-zA-Z0-9]+/.test(item.label),
          };
        });
        setAddressDomain(ownedDomain);
      }
    },
    onError(error) {
      console.error('Error getAll', error);
    },
  });

  console.log('addressDomain', addressDomain);

  return (
    <div
      onClick={() => {
        isOpen && setIsOpen(false);
      }}
      className='flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full'
    >
      <div className='flex-col bg-gray-800 px-8 py-5 w-full rounded-md lg:w-3/4 lg:mr-2'>
        <AccountLine />

        {isConnected && <ReverseRecord addressDomain={addressDomain} />}

        <div className='flex-col py-4 mb-4 mt-10'>
          <p className='text-white font-semibold text-lg mb-2'>Owned Domains</p>
          <p className='text-gray-400 font-medium text-sm'>
            Manage Your Account Here
          </p>
        </div>

        <div className='flex-col bg-gray-800'>
          {isConnected &&
            addressDomain.map((item, index) => (
              <OwnedDomains
                key={index}
                date={new Date(item.expire ? item.expire * 1000 : '')}
                domain={item.label}
                isSubdomain={item.isSubdomain}
              />
            ))}
        </div>
      </div>

      {/* Wallet connect */}
      <WalletConnect />
    </div>
  );
}
