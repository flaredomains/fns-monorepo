import React from 'react'
import Logo from '../public/Logo.svg'
import Search from '../public/Search.svg'
import Image from "next/image";
import styles from '../src/styles/Main.module.css'

function Main() {
  return (
    <div className='bg-[#0F172A] min-h-screen w-screen relative overflow-hidden'>
      {/* Gradient */}
      <div className={`${styles.gradient_top}`}/>
      <div className={`${styles.gradient_bottom}`}/>
      {/* NavBar */}
      <div className='flex justify-between items-center py-6 px-10 z-10 md:py-14 md:px-28'>
        <Image className='z-10 h-8 w-32 md:h-14 md:w-56' src={Logo} alt="FNS" />
        <div className='flex justify-center items-center px-4 z-10'>
          <p className='text-white font-semibold pr-6 text-sm cursor-pointer md:text-lg md:pr-16'>My Account</p>
          <p className='text-white font-semibold text-sm cursor-pointer md:text-lg'>FAQ</p>
        </div>
      </div>
      {/* Search */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <p className='font-bold text-5xl text-white text-center'>Find Your Next .flare Domain</p>
        <div className='flex items-center w-full mt-10 py-2 px-4 h-12 bg-gray-700 border-2 border-gray-500'>
          <Image className='z-10 h-6 w-6 mr-2' src={Search} alt="FNS" />
          <input type="text" className='w-full bg-transparent font-normal text-base text-white focus:outline-none placeholder:text-gray-300 placeholder:font-normal' placeholder='Search New Names or Addresses'/>
        </div>
      </div>
    </div>
  )
}

export default Main