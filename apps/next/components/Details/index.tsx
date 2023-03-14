import React, { useState } from 'react'
import Domain_Select from '../Domain_Select'
import WalletConnect from '../WalletConnect'
import Info from './Info'
import Content from './Content'

export default function Details({
  available,
  result,
}: {
  available: any
  result: String
}) {
  const date = new Date(1678273065000)

  return (
    <>
      {/* Main Content / Wallet connect (hidden mobile) */}
      <div className="flex-col w-11/12 mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        {/* Domain Result */}
        <div className="flex-col w-full lg:w-3/4 lg:mr-2">
          {/* Domain Container */}
          <Domain_Select result={result} />

          <Info
            available={available}
            parent={'.flare'}
            registrant_address={''}
            controller={''}
            date={date}
          />

          {available && <Content />}
        </div>

        {/* Wallet connect */}
        <WalletConnect />
      </div>
    </>
  )
}
