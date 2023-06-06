import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Logo from '../public/Logo.png'
import Search from '../public/Search.png'
import Ellipse_2 from '../public/Ellipse_2.png'
import Ellipse from '../public/Ellipse.png'
import Image from 'next/image'
import styles from '../src/styles/Main.module.css'
import Link from 'next/link'
import Links from './Links'

function Main() {
  const router = useRouter()
  const [route, setRoute] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()

    // Regular expression to validate input
    const pattern =
      /^[a-zA-Z0-9-\s\p{Emoji}]+(\.[a-zA-Z0-9-\s\p{Emoji}]+)*\.flr$/u

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
    <div className="bg-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Gradient */}
      <Image
        className="absolute top-0 left-0 h-2/5 w-full md:h-1/3 md:w-2/3 pointer-events-none"
        src={Ellipse}
        alt="Gradient Top"
      />

      <Image
        className="absolute bottom-0 right-0 h-5/6 w-8/9 md:h-2/3 md:w-5/6 pointer-events-none"
        src={Ellipse_2}
        alt="Gradient Bottom"
      />

      {/* NavBar */}
      <div className="flex justify-between items-center py-6 px-10 z-10 md:py-14 md:px-28 gap-4">
        {/* Logo */}
        <Link
          data-test="Logo Search"
          className="z-10"
          target="_blank"
          href="https://flrns.domains/"
        >
          <Image
            width={96}
            height={24}
            className="cursor-pointer z-10 md:h-14 md:w-56"
            src={Logo}
            alt="Logo"
          />
        </Link>

        {/* My account / FAQ */}
        <div className="flex justify-around items-center z-10 gap-4 md:gap-6">
          <Link
            href={{
              pathname: `/my_account`,
            }}
          >
            <p className="text-white font-semibold text-xs text-center cursor-pointer md:text-lg">
              My Account
            </p>
          </Link>
          <Link
            href={{
              pathname: `/faq`,
            }}
          >
            <p className="text-white font-semibold text-xs cursor-pointer md:text-lg">
              FAQ
            </p>
          </Link>
        </div>
      </div>

      {/* Search -- Middle page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 md:w-auto">
        <p className="font-bold text-5xl text-white text-center">
          Find Your Next .flr Domain
        </p>
        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className={`flex items-center w-full mt-10 py-2 px-4 h-12 bg-gray-700 border-2 border-gray-500 ${styles.autofill}`}
        >
          <Image className="z-10 h-6 w-6 mr-2" src={Search} alt="Search" />
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
            spellCheck="false"
            required
          />
        </form>
      </div>

      {/* Links */}
      <div className="flex bottom-0 absolute w-full justify-center py-6 px-10 z-10 md:py-14 md:px-28 gap-8 ">
        <Links />
      </div>
    </div>
  )
}

export default Main
