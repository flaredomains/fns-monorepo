import React, { useState } from 'react'
import Search from '../public/Search.svg'
import Account from '../public/Account.png'
import FAQ from '../public/FAQ.png'
import Image from 'next/image'
import Link from 'next/link'

const buttonData = [
  {
    page: '/register/[result]',
    text: 'Search For Domain',
    button_style: '',
    text_style: '',
    src: Search,
  },
  {
    page: '/my_account',
    text: 'My Account',
    button_style: '',
    text_style: '',
    src: Account,
  },
  {
    page: '/faq',
    text: 'FAQ',
    button_style: '',
    text_style: '',
    src: FAQ,
  },
]

const ButtonChoise = ({
  text,
  page,
  button_style,
  text_style,
  src,
}: {
  text: string
  page: string
  button_style: string
  text_style: string
  src: any
}) => {
  return (
    <>
      <Link
        href={{
          pathname: `${page === '/register/[result]' ? '/' : page}`,
        }}
      >
        <div
          className={`flex items-center w-full my-1 h-12 px-3 py-2 rounded-md ${button_style} hover:bg-gray-600 [&>p]:hover:text-white hover:scale-105 transform transition duration-400 ease-out`}
        >
          <Image className="h-6 w-6 mr-2" src={src} alt="FNS" />
          <p
            className={`w-full bg-transparent font-semibold text-normal ${text_style} focus:outline-none`}
          >
            {text}
          </p>
        </div>
      </Link>
    </>
  )
}

function Side_Navbar_Choise({
  path,
  isOpen,
  isLarge,
}: {
  path: String
  isOpen: boolean
  isLarge: boolean
}) {
  return (
    <>
      <div
        className={` pt-8 ${
          isOpen && !isLarge && 'py-8 px-8 bg-gray-800'
        } w-full lg:flex lg:flex-col lg:mb-auto`}
      >
        {buttonData.map((item) => (
          <ButtonChoise
            key={item.text}
            text={item.text}
            page={item.page}
            button_style={`${item.button_style}${
              path === item.page ? ' bg-gray-700' : ' bg-transparent'
            }`}
            text_style={path === item.page ? ' text-white' : ' text-gray-500'}
            src={item.src}
          />
        ))}
      </div>
    </>
  )
}

export default Side_Navbar_Choise
