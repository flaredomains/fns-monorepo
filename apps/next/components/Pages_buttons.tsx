import React, { useState } from 'react'
import Search from '../public/Search.svg'
import Account_Plus from '../public/buttons_main_page/Account_Plus.png'
import Details from '../public/buttons_main_page/Details.png'
import Subdomain from '../public/buttons_main_page/Subdomain.png'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const buttonData = [
  {
    page: '/register',
    text: 'Register',
    button_style: 'px-4 py-3 mr-4',
    image_style: 'h-3 w-3 mr-2 lg:h-5 lg:w-5',
    text_style: '',
    src: Account_Plus,
  },
  {
    page: '/details',
    text: 'Details',
    button_style: 'px-5 py-3 mr-4',
    image_style: 'h-3 w-4 mr-2',
    text_style: '',
    src: Details,
  },
  {
    page: '/subdomains',
    text: 'Subdomain',
    button_style: 'px-2 py-3',
    image_style: 'h-4 w-4 mr-2',
    text_style: '',
    src: Subdomain,
  },
]

const Button = ({
  text,
  result,
  page,
  button_style,
  image_style,
  text_style,
  src,
}: {
  text: string
  result: any
  page: string
  button_style: string
  image_style: string
  text_style: string
  src: any
}) => {
  return (
    <Link
      href={{
        pathname: `${page}/[result]`,
        query: { result: result },
      }}
    >
      <button
        className={`flex items-center rounded-md ${button_style} hover:bg-gray-600 [&>p]:hover:text-white hover:scale-110 transform transition duration-300 ease-out`}
      >
        <Image className={image_style} src={src} alt="FNS" />
        <p
          className={`w-full bg-transparent font-semibold text-sm ${text_style} focus:outline-none lg:text-normal`}
        >
          {text}
        </p>
      </button>
    </Link>
  )
}

function Pages_buttons({ result, path }: any) {
  const router = useRouter()
  const [route, setRoute] = useState('')
  const handleSubmit = (e: any) => {
    e.preventDefault()
    router.push(path.split('/')[0] + route)
  }

  // console.log(path)

  return (
    <>
      {/* Three button Register, Details, Subdomain / Search Input (hidden mobile) */}
      <div className="flex-col flex justify-between items-center lg:flex-row">
        {/* Buttons div */}

        <div className="flex justify-center items-center mx-auto lg:mx-2">
          {buttonData.map((item) => (
            <Button
              key={item.text}
              text={item.text}
              result={result}
              page={item.page}
              button_style={`${item.button_style}${
                path === item.page + '/[result]'
                  ? ' bg-gray-700'
                  : ' bg-transparent'
              }`}
              image_style={item.image_style}
              text_style={
                path === item.page + '/[result]'
                  ? ' text-white'
                  : ' text-gray-500'
              }
              src={item.src}
            />
          ))}
        </div>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-4/5 py-2 px-4 h-12 rounded-md bg-gray-700 border-2 border-gray-500 mt-5 lg:flex lg:w-2/5 lg:mt-0"
        >
          <Image className="z-10 h-6 w-6 mr-2" src={Search} alt="FNS" />
          <input
            type="text"
            onChange={(e) => {
              setRoute(e.target.value)
            }}
            className="w-full bg-transparent font-normal text-base text-white border-0 focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
            placeholder="Search New Names or Addresses"
            required
          />
        </form>
      </div>
    </>
  )
}

export default Pages_buttons
