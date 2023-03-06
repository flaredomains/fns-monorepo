import React, { useState } from 'react'
import Logo from '../../../public/Logo.svg'
import Search from '../../../public/Search.svg'
import Flare from '../../../public/Flare.png'
import Account from '../../../public/Account.png'
import FAQ from '../../../public/FAQ.png'
import Hamburger_Icon from '../../../public/Hamburger_Icon.png'
import Account_Plus from '../../../public/buttons_main_page/Account_Plus.png'
import Details from '../../../public/buttons_main_page/Details.png'
import Subdomain from '../../../public/buttons_main_page/Subdomain.png'
import Info from '../../../public/Info.svg'
import Plus from '../../../public/Plus.svg'
import Minus from '../../../public/Minus.svg'
import Image from "next/image";

export default function Result() {

  const [available, setAvailable] = useState(true)

  
  return (
    <>
      <div className='min-h-screen w-screen'>
        <div className='flex-col bg-[#0F172A] md:flex md:flex-row'>
          {/* Left Side / Navbar */}
          <div className='flex justify-between items-center py-3 px-4 w-full bg-gray-800 md:flex-col md:w-1/4 md:min-h-screen'>
            {/* Logo */}
            <div className='md:border-b md:border-white/[.23] md:pl-16 md:pr-20 md:py-8'>
              <Image className='h-8 w-32 md:h-14 md:w-56' src={Logo} alt="FNS" />
            </div>
            {/* Middle md:visible */}
            <div className='hidden mt-8 mx-4 w-full md:flex md:flex-col md:mb-auto'>
              <div className='flex items-center w-full h-12 px-3 py-2 rounded-md bg-gray-700 active:bg-gray-700'>
                <Image className='h-6 w-6 mr-2' src={Search} alt="FNS" />
                <p className='w-full bg-transparent font-semibold text-normal text-white focus:outline-none'>Search For Domain</p>
              </div>
              <div className='flex items-center w-full mt-2 h-12 px-3 py-2 rounded-md bg-trasparent active:bg-gray-700'>
                <Image className='h-6 w-6 mr-2' src={Account} alt="FNS" />
                <p className='w-full bg-transparent font-semibold text-normal text-gray-500 focus:outline-none'>My Account</p>
              </div>
              <div className='flex items-center w-full mt-2 h-12 px-3 py-2 rounded-md bg-trasparent active:bg-gray-700'>
                <Image className='h-6 w-6 mr-2' src={FAQ} alt="FNS" />
                <p className='w-full bg-transparent font-semibold text-normal text-gray-500 focus:outline-none'>FAQ</p>
              </div>
            </div>
            {/* Flare Image md:visible */}
            <div className='hidden md:flex md:mb-10'>
              <div className='flex items-center w-full mt-auto h-12 px-3 py-2 bg-trasparent'>
                <p className='w-full bg-transparent font-semibold text-lg text-white focus:outline-none'>Built on </p>
                <Image className='h-7 w-20 ml-4' src={Flare} alt="FNS" />
              </div>
            </div>
            {/* Hamburger md:hidden */}
            <Image className='h-6 w-6 md:hidden' src={Hamburger_Icon} alt="FNS" /> 
          </div>

          {/* Main */}
          <div className='flex-col mt-9 pb-8 md:mx-8 w-full min-h-screen'>
            {/* Three button Register, Details, Subdomain (TODO put Link) / Search Input (hidden mobile) */}
            <div className='flex justify-between items-center'>
              {/* Buttons div */}
              <div className='flex justify-center items-center mx-auto md:mx-2'>
                <div className='flex items-center h-12 px-4 py-3 mr-4 rounded-md bg-gray-700 active:bg-gray-700'>
                  <Image className='h-3 w-3 md:h-5 md:w-5 mr-2' src={Account_Plus} alt="FNS" />
                  <p className='w-full bg-transparent font-semibold text-sm md:text-normal text-white focus:outline-none'>Register</p>
                </div>
                <div className='flex items-center h-12 px-5 py-3 mr-4 rounded-md bg-transparent active:bg-gray-700'>
                  <Image className='h-3 w-4 mr-2' src={Details} alt="FNS" />
                  <p className='w-full bg-transparent font-semibold text-sm md:text-normal text-gray-500 focus:outline-none'>Details</p>
                </div>
                <div className='flex items-center h-12 px-2 py-3 rounded-md bg-transparent active:bg-gray-700'>
                  <Image className='h-4 w-4 mr-2' src={Subdomain} alt="FNS" />
                  <p className='w-full bg-transparent font-semibold text-sm md:text-normal text-gray-500 focus:outline-none'>Subdomain</p>
                </div>
              </div>
              {/* Search */}
              <div className='hidden md:flex items-center w-2/5 py-2 px-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500'>
                <Image className='z-10 h-6 w-6 mr-2' src={Search} alt="FNS" />
                <input type="text" className='w-full bg-transparent font-normal text-base text-white focus:outline-none placeholder:text-gray-300 placeholder:font-normal' placeholder='Search New Names or Addresses'/>
              </div>
            </div>

            {/* Main Content / Wallet connect (hidden mobile) */}
            <div className='flex-col w-11/12 mx-auto md:flex-row md:w-full'>
              {/* Domain Result */}
              <div className='flex-col w-full mt-6 md:w-2/3'>
                {/* Domain Container */}
                <div className='flex justify-between items-center w-full rounded-t-lg h-28 bg-[#334155] px-9'>
                  {/* Domain */}
                  <p className='text-white font-bold text-4xl'>neel.eth</p>
                  {/* Search Icon */}
                  <div className='h-7 w-7 mr-1'>
                    <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5572 17.3121L12.3181 12.0729M14.0644 7.70702C14.0644 11.0828 11.3279 13.8193 7.95214 13.8193C4.57641 13.8193 1.83984 11.0828 1.83984 7.70702C1.83984 4.33129 4.57641 1.59473 7.95214 1.59473C11.3279 1.59473 14.0644 4.33129 14.0644 7.70702Z" stroke="#94A3B8" stroke-width="1.87485" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>

                {
                  available ? 
                  <>
                    <div className='flex-col bg-gray-800 px-8 pt-12'>
                      {/* Alert */}
                      <div className='flex w-full bg-[#F97316] py-3 px-5 rounded-lg'>
                        <div className='h-4 w-4 mr-2'>
                          {/* Like */}
                          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.64638 6.44444H13.3517C14.508 6.44444 15.2601 7.66138 14.743 8.69567L12.0208 14.1401C11.7573 14.6671 11.2186 15 10.6294 15H7.50454C7.37736 15 7.25065 14.9844 7.12726 14.9536L4.20193 14.2222M9.64638 6.44444V2.55556C9.64638 1.69645 8.94993 1 8.09082 1H8.01656C7.62802 1 7.31304 1.31498 7.31304 1.70352C7.31304 2.25909 7.14859 2.80223 6.84042 3.26449L4.20193 7.22222V14.2222M9.64638 6.44444H8.09082M4.20193 14.2222H2.64638C1.78727 14.2222 1.09082 13.5258 1.09082 12.6667V8C1.09082 7.14089 1.78727 6.44444 2.64638 6.44444H4.59082" stroke="#FFF7ED" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                        <div className='flex-col'>
                          <p className='text-white font-semibold text-sm'>This name is available!</p>
                          <p className='text-white font-normal text-sm mt-2'>Please complete the form below to secure this domain for yourself.</p>
                        </div>
                      </div>

                      {/* Increment Selector */}
                      <div className='flex flex-col md:flex-row justify-between items-center mt-9'>

                        {/* Registration Period */}
                        <div className='flex items-center'>
                          {/* - */}
                          <div className='bg-[#F97316] h-6 w-6 rounded-full text-white text-center mr-5 flex items-center justify-center'>
                            {/* <p className='text-lg'>-</p> */}
                            <Image className='h-3 w-3' src={Minus} alt="FNS" />
                          </div>
                          {/* Text */}
                          <div className='flex-col'>
                            <p className='text-white font-semibold text-3xl'>1 year</p>
                            <p className='text-[#91A3B8] font-medium text-sm'>Registration Period</p>
                          </div>
                          {/* + */}
                          <div className='bg-[#F97316] h-6 w-6 rounded-full text-white text-center ml-5 flex items-center justify-center'>
                            {/* <p className='text-lg'>+</p> */}
                            <Image className='h-3 w-3' src={Plus} alt="FNS" />
                          </div>
                        </div>

                        {/* Registration price to pay */}
                        <div className='flex-col mt-6 md:mt-0'>
                          <p className='text-white font-semibold text-3xl'>0.003 ETH</p>
                          <p className='text-[#91A3B8] font-medium text-sm'>Registration price to pay </p>
                        </div>

                        {/* Note */}
                        <div className='flex justify-center items-center mt-6 md:mt-0 bg-[#334155] h-12 text-[#9cacc0] rounded-lg px-5 w-3/4 md:w-1/3'>
                          <Image className='h-5 w-5 mr-2' src={Info} alt="FNS" />
                          <p className='text-xs font-medium'>Increase period to avoid paying gas every year</p>
                        </div>
                      </div>

                      {/* Final price block */}
                      <div className='flex flex-col items-center mt-9 h-96 w-full bg-[#334155] rounded-t-lg md:flex-row md:rounded-l-lg md:h-32'>
                        <div className='bg-[#334155] flex flex-col items-center w-full md:w-2/3 md:flex-row'>
                          {/* Estimated Total Price */}
                          <div className='px-12 py-8 bg-[#334155] md:py-0'>
                            <p className='text-[#91A3B8] font-medium text-sm'>Estimated Total Price</p>
                            <p className='text-white font-semibold text-2xl'>0.003 ETH</p>
                          </div>
                          {/* + */}
                          <div className='text-white text-xl'>
                            +
                          </div>
                          {/* Gas Fee (at most) */}
                          <div className='px-12 py-8 bg-[#334155] md:py-0'>
                            <p className='text-[#91A3B8] font-medium text-sm'>Gas Fee (at most)</p>
                            <p className='text-white font-semibold text-2xl'>0.011 ETH</p>
                          </div>
                        </div>

                        {/* Final Price */}
                        <div className='flex flex-col text-center items-center w-full bg-[#F97316] h-32 py-6 rounded-b-lg md:rounded-bl-none md:rounded-r-lg md:w-1/3'>
                          <div className='px-20 bg-[#F97316] flex flex-col justify-center items-center text-center md:px-10'>
                            <p className='text-[#FED7AA] text-xs'>At most</p>
                            <p className='text-white font-semibold text-2xl'>0.014 ETH</p>
                            <p className='text-[#FED7AA] text-xs'>Calculated to <span className='font-semibold text-white'>$21.65 USD</span></p>
                          </div>
                        </div>

                      </div>

                      {/* Steps title mobile hidden */}
                      <div className='hidden md:flex items-center mt-12'>
                        <div className='bg-[#F97316] h-8 w-8 rounded-full mr-4'/>
                        <p className='text-white font-semibold text-lg'>Registering requires 3 steps</p>
                      </div>

                      {/* Steps */}
                      <div className='flex flex-col mt-10 md:flex-row w-full'>
                        {/* 1 */}
                        <div className='w-full flex-col justify-center items-center md:w-1/3'>
                          {/* Line and number */}
                          <div className='flex justify-center items-center w-full'>
                            {/* First half line */}
                            <div className='w-1/2 h-1 bg-[#F97316]'/>
                            {/* Number */}
                            <div className='flex justify-center items-center bg-[#F97316] border-2 border-[#F97316] h-9 w-9 rounded-full p-3 text-center'>
                              <p className='text-white'>1</p>
                            </div>
                            {/* Second half line */}
                            <div className='w-1/2 h-1 bg-[#F97316]'/>
                          </div>
                          <p className='text-white font-medium mt-2 text-center'>Request to Register</p>
                          <p className='text-[#94A3B8] text-[0.625rem] mx-2 mt-4 text-center'>Your wallet will open and you will be asked to confirm the first of two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step 1.</p>
                        </div>
                        {/* 2 */}
                        <div className='w-full flex-col justify-center items-center mt-4 md:mt-0 md:w-1/3'>
                          {/* Line and number */}
                          <div className='flex justify-center items-center w-full'>
                            {/* First half line */}
                            <div className='w-1/2 h-1 bg-[#F97316]'/>
                            {/* Number */}
                            <div className='flex justify-center items-center bg-[#0F172A] border-2 border-[#F97316] h-9 w-9 rounded-full p-3 text-center'>
                              <p className='text-white'>2</p>
                            </div>
                            {/* Second half line */}
                            <div className='w-1/2 h-1 bg-[#334155]'/>
                          </div>
                          <p className='text-white font-medium mt-2 text-center'>Wait for 1 minute</p>
                          <p className='text-[#94A3B8] text-[0.625rem] mx-2 mt-4 text-center'>The waiting period is required to ensure another person hasn’t tried to register the same name and protect you after your request.</p>
                        </div>
                        {/* 3 */}
                        <div className='w-full flex-col justify-center items-center mt-4 md:mt-0 md:w-1/3'>
                          {/* Line and number */}
                          <div className='flex justify-center items-center w-full'>
                            {/* First half line */}
                            <div className='w-1/2 h-1 bg-[#334155]'/>
                            {/* Number */}
                            <div className='flex justify-center items-center bg-[#0F172A] border-2 border-[#E2E8F0] h-9 w-9 rounded-full p-3 text-center'>
                              <p className='text-white'>3</p>
                            </div>
                            {/* Second half line */}
                            <div className='w-1/2 h-1 bg-[#334155]'/>
                          </div>
                          <p className='text-white font-medium mt-2 text-center'>Complete Registration</p>
                          <p className='text-[#94A3B8] text-[0.625rem] mx-2 font-normal mt-4 text-center'>Click ‘register’ and your wallet will re-open. Only after the 2nd transaction is confirmed you'll know if you got the name.</p>
                        </div>
                      </div>

                      {/* Connect Wallet */}
                      <div className='hidden mt-10 md:flex items-center w-full pb-12'>
                        <div className='w-2/3 flex items-center bg-[#334155] h-12 rounded-lg text-[#9cacc0] px-5 mr-4'>
                          <Image className='h-4 w-4 mr-2' src={Info} alt="FNS" />
                          <p className='text-xs font-medium'>No wallet connected. Please connect to continue.</p>
                        </div>
                        <div className='w-1/3 flex justify-center items-center bg-[#F97316] h-12 rounded-lg text-white px-auto'>
                          <p className='text-base font-semibold mr-2'>Connect</p>
                          <Image className='h-4 w-4' src={Plus} alt="FNS" />
                        </div>
                      </div>

                      {/* Mobile -- Request to Register */}
                      <div className='md:hidden mt-10 flex items-center w-full pb-12'>
                        <div className='w-full flex justify-center items-center bg-[#F97316] h-12 rounded-lg text-white px-auto'>
                          <p className='text-base font-semibold mr-2'>Request to Register</p>
                          <Image className='h-4 w-4' src={Plus} alt="FNS" />
                        </div>
                      </div>
                    </div>
                  </>
                  :
                  <>
                  </>
                }
                
                
                
              </div>

              {/* Wallet connect */}
              <div className='hidden md:flex md:w-1/3'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}