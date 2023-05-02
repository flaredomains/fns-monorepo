import React from 'react'
import Side_Navbar from '../../../components/Side_Navbar'
import MyAccount from '../../../components/MyAccount'

export default function My_Account() {
  return (
    <>
      <div className="min-h-screen">
        <div className="flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <Side_Navbar />

          {/* Register */}
          <div className="flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen lg:w-3/4">
            <MyAccount />
          </div>
        </div>
      </div>
    </>
  )
}
