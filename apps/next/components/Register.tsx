import React, { useState } from 'react'
import Info from '../public/Info.svg'
import Plus from '../public/Plus.svg'
import Minus from '../public/Minus.svg'
import Like from '../public/Like.svg'
import Dislike from '../public/Dislike.svg'
import WalletConnect from './WalletConnect'
import Image from 'next/image'
import Domain_Select from './Domain_Select'

function Register({
  available,
  isConnect,
  result,
}: {
  available: any
  isConnect: any
  result: String
}) {
  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className='flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full'>
        {/* Domain Result */}
        <div className='flex-col w-full lg:w-3/4 lg:mr-2'>
          {/* Domain Container */}
          <Domain_Select />

          {available ? (
            <>
              <div className='flex-col bg-gray-800 px-8 pt-12'>
                {/* Alert */}
                <div className='flex w-full bg-[#F97316] py-3 px-5 rounded-lg'>
                  <Image className='h-4 w-4 mr-2' src={Like} alt='FNS' />
                  <div className='flex-col'>
                    <p className='text-white font-semibold text-sm'>
                      This name is available!
                    </p>
                    <p className='text-white font-normal text-sm mt-2'>
                      Please complete the form below to secure this domain for
                      yourself.
                    </p>
                  </div>
                </div>

                {/* Increment Selector */}
                <div className='flex flex-col justify-between items-center mt-9 lg:flex-row'>
                  {/* Registration Period */}
                  <div className='flex items-center'>
                    {/* - */}
                    <div className='bg-[#F97316] h-6 w-6 rounded-full text-white text-center mr-5 flex items-center justify-center'>
                      <Image className='h-3 w-3' src={Minus} alt='FNS' />
                    </div>
                    {/* Text */}
                    <div className='flex-col'>
                      <p className='text-white font-semibold text-3xl lg:text-xl xl:text-3xl'>
                        1 year
                      </p>
                      <p className='text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm'>
                        Registration Period
                      </p>
                    </div>
                    {/* + */}
                    <div className='bg-[#F97316] h-6 w-6 rounded-full text-white text-center ml-5 flex items-center justify-center lg:ml-1'>
                      <Image className='h-3 w-3' src={Plus} alt='FNS' />
                    </div>
                  </div>

                  {/* Registration price to pay */}
                  <div className='flex-col mt-6 lg:mt-0'>
                    <p className='text-white font-semibold text-3xl lg:text-xl xl:text-3xl'>
                      0.003 ETH
                    </p>
                    <p className='text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm'>
                      Registration price to pay{' '}
                    </p>
                  </div>

                  {/* Note */}
                  <div className='flex justify-center items-center mt-6 bg-[#334155] h-12 text-[#9cacc0] rounded-lg px-5 w-3/4 lg:w-1/3 lg:mt-0'>
                    <Image className='h-5 w-5 mr-2' src={Info} alt='FNS' />
                    <p className='text-xs font-medium'>
                      Increase period to avoid paying gas every year
                    </p>
                  </div>
                </div>

                {/* Final price block */}
                <div className='flex flex-col items-center mt-9 h-96 w-full bg-[#334155] rounded-t-lg lg:flex-row lg:rounded-l-lg lg:h-32'>
                  <div className='bg-[#334155] flex flex-col items-center w-full lg:w-2/3 lg:flex-row'>
                    {/* Estimated Total Price */}
                    <div className='px-12 py-8 bg-[#334155] lg:py-0'>
                      <p className='text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm'>
                        Estimated Total Price
                      </p>
                      <p className='text-white font-semibold text-2xl lg:text-lg xl:text-2xl'>
                        0.003 ETH
                      </p>
                    </div>
                    {/* + */}
                    <div className='text-white text-xl'>+</div>
                    {/* Gas Fee (at most) */}
                    <div className='px-12 py-8 bg-[#334155] lg:py-0'>
                      <p className='text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm'>
                        Gas Fee (at most)
                      </p>
                      <p className='text-white font-semibold text-2xl lg:text-lg xl:text-2xl'>
                        0.011 ETH
                      </p>
                    </div>
                  </div>

                  {/* Final Price */}
                  <div className='flex flex-col text-center items-center w-full bg-[#F97316] h-32 py-6 rounded-b-lg lg:rounded-bl-none lg:rounded-r-lg lg:w-1/3'>
                    <div className='px-20 bg-[#F97316] flex flex-col justify-center items-center text-center lg:px-10'>
                      <p className='text-[#FED7AA] text-xs'>At most</p>
                      <p className='text-white font-semibold text-2xl lg:text-lg xl:text-2xl'>
                        0.014 ETH
                      </p>
                      <p className='text-[#FED7AA] text-xs'>
                        Calculated to{' '}
                        <span className='font-semibold text-white'>
                          $21.65 USD
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps title mobile hidden */}
                <div className='hidden items-center mt-12 lg:flex'>
                  <div className='bg-[#F97316] h-8 w-8 rounded-full mr-4' />
                  <p className='text-white font-semibold text-lg'>
                    Registering requires 3 steps
                  </p>
                </div>

                {/* Steps */}
                <div className='flex flex-col mt-10 w-full lg:flex-row'>
                  {/* 1 */}
                  <div className='w-full flex-col justify-center items-center lg:w-1/3'>
                    {/* Line and number */}
                    <div className='flex justify-center items-center w-full'>
                      {/* First half line */}
                      <div className='w-1/2 h-1 bg-[#F97316]' />
                      {/* Number */}
                      <div className='flex justify-center items-center bg-[#F97316] border-2 border-[#F97316] h-9 w-9 rounded-full p-3 text-center'>
                        <p className='text-white'>1</p>
                      </div>
                      {/* Second half line */}
                      <div className='w-1/2 h-1 bg-[#F97316]' />
                    </div>
                    <p className='text-white font-medium mt-2 text-center'>
                      Request to Register
                    </p>
                    <p className='text-[#94A3B8] text-[0.625rem] mx-2 mt-4 text-center'>
                      Your wallet will open and you will be asked to confirm the
                      first of two transactions required for registration. If
                      the second transaction is not processed within 7 days of
                      the first, you will need to start again from step 1.
                    </p>
                  </div>
                  {/* 2 */}
                  <div className='w-full flex-col justify-center items-center mt-4 lg:mt-0 lg:w-1/3'>
                    {/* Line and number */}
                    <div className='flex justify-center items-center w-full'>
                      {/* First half line */}
                      <div className='w-1/2 h-1 bg-[#F97316]' />
                      {/* Number */}
                      <div className='flex justify-center items-center bg-[#0F172A] border-2 border-[#F97316] h-9 w-9 rounded-full p-3 text-center'>
                        <p className='text-white'>2</p>
                      </div>
                      {/* Second half line */}
                      <div className='w-1/2 h-1 bg-[#334155]' />
                    </div>
                    <p className='text-white font-medium mt-2 text-center'>
                      Wait for 1 minute
                    </p>
                    <p className='text-[#94A3B8] text-[0.625rem] mx-2 mt-4 text-center'>
                      The waiting period is required to ensure another person
                      hasn’t tried to register the same name and protect you
                      after your request.
                    </p>
                  </div>
                  {/* 3 */}
                  <div className='w-full flex-col justify-center items-center mt-4 lg:mt-0 lg:w-1/3'>
                    {/* Line and number */}
                    <div className='flex justify-center items-center w-full'>
                      {/* First half line */}
                      <div className='w-1/2 h-1 bg-[#334155]' />
                      {/* Number */}
                      <div className='flex justify-center items-center bg-[#0F172A] border-2 border-[#E2E8F0] h-9 w-9 rounded-full p-3 text-center'>
                        <p className='text-white'>3</p>
                      </div>
                      {/* Second half line */}
                      <div className='w-1/2 h-1 bg-[#334155]' />
                    </div>
                    <p className='text-white font-medium mt-2 text-center'>
                      Complete Registration
                    </p>
                    <p className='text-[#94A3B8] text-[0.625rem] mx-2 font-normal mt-4 text-center'>
                      Click &apos;register&apos; and your wallet will re-open.
                      Only after the 2nd transaction is confirmed you&apos;ll
                      know if you got the name.
                    </p>
                  </div>
                </div>

                {/* Connect Wallet -- Hidden Mobile */}
                <div className='hidden mt-10 items-center w-full pb-12 lg:flex'>
                  {/* Info icon + Message */}
                  <div className='w-2/3 flex items-center bg-[#334155] h-12 rounded-lg text-[#9cacc0] px-5 mr-4'>
                    <Image className='h-4 w-4 mr-2' src={Info} alt='FNS' />
                    <p className='text-xs font-medium'>
                      No wallet connected. Please connect to continue.
                    </p>
                  </div>
                  {/* Connect + */}
                  <div className='w-1/3 flex justify-center items-center bg-[#F97316] h-12 rounded-lg text-white px-auto'>
                    <p className='text-base font-semibold mr-2'>Connect</p>
                    <Image className='h-4 w-4' src={Plus} alt='FNS' />
                  </div>
                </div>

                {/* Request to Register -- Hidden Desktop */}
                <div className='mt-10 flex items-center w-full pb-12 lg:hidden'>
                  <div className='w-full flex justify-center items-center bg-[#F97316] h-12 rounded-lg text-white px-auto'>
                    <p className='text-base font-semibold mr-2'>
                      Request to Register
                    </p>
                    <Image className='h-4 w-4' src={Plus} alt='FNS' />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='flex-col bg-gray-800 px-8 py-12'>
                {/* Alert */}
                <div className='flex w-full bg-[#F97316] py-3 px-5 rounded-lg'>
                  <Image
                    className='h-4 w-4 mr-2 mt-1'
                    src={Dislike}
                    alt='FNS'
                  />
                  <div className='flex-col'>
                    <p className='text-white font-semibold text-sm'>
                      This name is already registered.
                    </p>
                    <p className='text-white font-normal text-sm mt-2'>
                      Please check the Details tab to see when this domain will
                      free up.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Wallet connect */}
        <WalletConnect isConnect={isConnect} />
      </div>
    </>
  )
}

export default Register
