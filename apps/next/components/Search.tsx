import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Logo from '../public/Logo.png'
import Search from '../public/Search.svg'
import Image from 'next/image'
import styles from '../src/styles/Main.module.css'
import Link from 'next/link'

function Main() {
  const router = useRouter()
  const [route, setRoute] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()

    // Regular expression to validate input
    const pattern = /^[a-zA-Z0-9\s\p{Emoji}]+(\.[a-zA-Z0-9\s\p{Emoji}]+)*\.flr$/u

    const exception = /^0x[a-fA-F0-9]{40}$/

    if (pattern.test(route) || exception.test(route)) {
      console.log('Input is valid!')
      router.push('register?result=' + route.toLowerCase())
    } else {
      console.log('Input is invalid!')
      const inputElement = e.target.elements['input-field'] as HTMLInputElement
      inputElement.setCustomValidity(
        'Should be a name with .flr at the end or flare wallet address.'
      )
      inputElement.reportValidity()
    }
  }

  return (
    <div className="bg-[#0F172A] min-h-screen  relative overflow-hidden">
      {/* Gradient */}
      <div className={`${styles.gradient_top}`} />
      <div className={`${styles.gradient_bottom}`} />

      {/* NavBar */}
      <div className="flex justify-between items-center py-6 px-10 z-10 md:py-14 md:px-28">
        {/* Logo */}
        <Image className="z-10 h-8 w-32 md:h-14 md:w-56" src={Logo} alt="FNS" />

        {/* My account / FAQ */}
        <div className="flex justify-center items-center px-4 z-10">
          <Link
            href={{
              pathname: `/my_account`,
            }}
          >
            <p className="text-white font-semibold pr-6 text-sm cursor-pointer md:text-lg md:pr-16">
              My Account
            </p>
          </Link>
          <Link
            href={{
              pathname: `/faq`,
            }}
          >
            <p className="text-white font-semibold text-sm cursor-pointer md:text-lg">
              FAQ
            </p>
          </Link>
        </div>
      </div>
      {/* Search -- Middle page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="font-bold text-5xl text-white text-center">
          Find Your Next .flare Domain
        </p>
        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full mt-10 py-2 px-4 h-12 bg-gray-700 border-2 border-gray-500"
        >
          <Image className="z-10 h-6 w-6 mr-2" src={Search} alt="FNS" />
          <input
            type="text"
            name="input-field"
            value={route}
            onChange={(e) => {
              setRoute(e.target.value.toLowerCase())
            }}
            onInput={(event) => {
              const inputElement = event.target as HTMLInputElement
              inputElement.setCustomValidity('')
            }}
            className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
            placeholder="Search New Names or Addresses"
            required
          />
        </form>
      </div>
    </div>
  )
}

export default Main
