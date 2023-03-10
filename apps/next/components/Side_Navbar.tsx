import React, { useState } from 'react'
import Logo from '../public/Logo.png'
import Search from '../public/Search.svg'
import Flare from '../public/Flare.png'
import Account from '../public/Account.png'
import FAQ from '../public/FAQ.png'
import Hamburger_Icon from '../public/Hamburger_Icon.png'
import Image from 'next/image'
import Link from 'next/link'

function Side_Navbar() {
  return (
    <>
      {/* Left Side / Navbar */}
      <div className='flex justify-between items-center py-3 px-4 w-full bg-gray-800 lg:flex-col lg:w-1/4 lg:min-h-screen'>
        {/* Logo */}
        <Link
          href={{
            pathname: '/',
          }}
        >
          <div className='lg:border-b lg:border-white/[.23] lg:px-auto lg:py-8'>
            <Image className='h-8 w-32 lg:h-14 lg:w-56' src={Logo} alt='FNS' />
          </div>
        </Link>
        {/* Middle lg:visible */}
        <div className='hidden mt-8 mx-4 w-full lg:flex lg:flex-col lg:mb-auto'>
          {/* Search For Domain -- TODO Link */}
          <div className='flex items-center w-full h-12 px-3 py-2 rounded-md bg-gray-700 active:bg-gray-700'>
            <Image className='h-6 w-6 mr-2' src={Search} alt='FNS' />
            <p className='w-full bg-transparent font-semibold text-normal text-white focus:outline-none'>
              Search For Domain
            </p>
          </div>
          {/* My Account -- TODO Link */}
          <div className='flex items-center w-full mt-2 h-12 px-3 py-2 rounded-md bg-trasparent active:bg-gray-700'>
            <Image className='h-6 w-6 mr-2' src={Account} alt='FNS' />
            <p className='w-full bg-transparent font-semibold text-normal text-gray-500 focus:outline-none'>
              My Account
            </p>
          </div>
          {/* FAQ -- TODO Link */}
          <div className='flex items-center w-full mt-2 h-12 px-3 py-2 rounded-md bg-trasparent active:bg-gray-700'>
            <Image className='h-6 w-6 mr-2' src={FAQ} alt='FNS' />
            <p className='w-full bg-transparent font-semibold text-normal text-gray-500 focus:outline-none'>
              FAQ
            </p>
          </div>
        </div>
        {/* Flare Image lg:visible */}
        <div className='hidden lg:flex lg:mb-10'>
          <div className='flex items-center w-full mt-auto h-12 px-3 py-2 bg-trasparent'>
            <p className='w-full bg-transparent font-semibold text-lg text-white focus:outline-none'>
              Built on{' '}
            </p>
            <Image className='h-7 w-20 ml-4' src={Flare} alt='FNS' />
          </div>
        </div>
        {/* Hamburger lg:hidden */}
        <Image className='h-6 w-6 lg:hidden' src={Hamburger_Icon} alt='FNS' />
      </div>
    </>
  )
}

export default Side_Navbar
