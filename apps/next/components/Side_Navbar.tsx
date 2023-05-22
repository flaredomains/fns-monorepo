import React, { useState, useEffect } from 'react'
import Logo from '../public/Logo.png'
import Flare from '../public/FlareBottom.png'
import Hamburger_Icon from '../public/Hamburger_Icon.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Side_Navbar_Choise from './Side_Navbar_Choise'

const LogoZone = () => {
  return (
    <>
      <Link
        href={{
          pathname: '/',
        }}
      >
        <div className="lg:border-b lg:border-white/[.23] lg:px-auto lg:py-8">
          <Image className="h-8 w-32 lg:h-14 lg:w-56" src={Logo} alt="FNS" />
        </div>
      </Link>
    </>
  )
}

const BottomFlare = () => {
  return (
    <>
      <div className="hidden lg:flex lg:mb-10">
        <div className="flex flex-row items-center w-full mt-auto h-12 py-2 bg-trasparent gap-4">
          <p className="bg-transparent font-semibold text-lg text-white focus:outline-none shrink-0">
            Built on{' '}
          </p>
          <Image className="h-7 w-20" src={Flare} alt="FNS" />
        </div>
      </div>
    </>
  )
}

function Side_Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [result, setResult] = useState<String>('')
  const [path, setPath] = useState<String>('')

  const [isLarge, setisLarge] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const result = router.query.result as String
    const path = router.pathname as String
    setPath(path)
    setResult(result)
  }, [router.isReady])

  // UseEffect for resize the address when viewport become to small
  useEffect(() => {
    // First render
    if (window.innerWidth >= 1024) {
      setisLarge(window.innerWidth >= 1024)
    }

    const handleResize = () => {
      setisLarge(window.innerWidth >= 1024)
    }

    // Add event listener to update isLarge state when the window is resized
    window.addEventListener('resize', handleResize)

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Left Side / Navbar */}
      <div className="flex justify-between items-center py-3 px-4 w-full bg-gray-800 lg:flex-col lg:w-1/5 lg:min-h-screen">
        <LogoZone />

        {/* Middle lg:visible */}
        {isLarge && (
          <Side_Navbar_Choise path={path} isOpen={isOpen} isLarge={isLarge} />
        )}

        {/* Flare Image lg:visible */}
        <BottomFlare />

        {/* Hamburger Icon lg:hidden */}
        {isOpen ? (
          <svg
            className="h-5 w-5 cursor-pointer"
            onClick={() => setIsOpen(false)}
            width="10"
            height="11"
            viewBox="0 0 10 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 9.77332L9 1.77332M1 1.77332L9 9.77332"
              stroke="#9ca3af"
              stroke-width="1.67"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <Image
            onClick={() => setIsOpen(true)}
            className="h-6 w-6 cursor-pointer lg:hidden"
            src={Hamburger_Icon}
            alt="FNS"
          />
        )}
      </div>

      {/* Menu Choise after the user click the Hamburger Icon */}
      {isOpen && !isLarge && (
        <Side_Navbar_Choise path={path} isOpen={isOpen} isLarge={isLarge} />
      )}
    </>
  )
}

export default Side_Navbar
