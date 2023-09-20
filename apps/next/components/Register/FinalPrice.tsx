import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'

const ETH_TO_USD_API_URL = 'https://min-api.cryptocompare.com/data/price'

const Loading = ({
  isFinalPrize,
  isCalculation,
}: {
  isFinalPrize: boolean
  isCalculation: boolean
}) => {
  return (
    <>
      <div className="animate-pulse mb-1 mr-2">
        <div
          className={`${isFinalPrize ? 'bg-[#f49c5c]' : 'bg-slate-500'} ${
            isCalculation ? 'h-3 w-7' : 'h-6 w-16'
          } rounded`}
        ></div>
      </div>
    </>
  )
}

const FlarePrice = ({
  regPeriod,
  priceToPay,
}: {
  regPeriod: number
  priceToPay: string
}) => {
  return (
    <>
      <div className="bg-[#334155] lg:py-0">
        <p className="text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm">
          Estimated Total Price
        </p>
        <div className="flex items-center text-white font-semibold text-2xl lg:text-lg xl:text-2xl">
          {priceToPay ? (
            (Number(priceToPay) * regPeriod).toString().slice(0, 6)
          ) : (
            <Loading isFinalPrize={false} isCalculation={false} />
          )}{' '}
          FLR
        </div>
      </div>
    </>
  )
}

const GasFee = ({ fee }: { fee: number }) => {
  return (
    <>
      <div className="bg-[#334155] lg:py-0">
        <p className="text-[#91A3B8] font-medium text-sm lg:text-xs xl:text-sm">
          Gas Fee (at most)
        </p>
        <p className="text-white font-semibold text-2xl lg:text-lg xl:text-2xl">
          {/* {(fee / 10 ** 18).toFixed(9)} FLR */}
          0.5 FLR
        </p>
      </div>
    </>
  )
}

const TotalPrice = ({
  regPeriod,
  fee,
  priceToPay,
}: {
  regPeriod: number
  fee: number
  priceToPay: string
}) => {
  const [ethPrice, setEthPrice] = useState<number>(0)

  useEffect(() => {
    axios
      .get(ETH_TO_USD_API_URL, {
        params: {
          fsym: 'FLR',
          tsyms: 'USD',
        },
      })
      .then((response) => {
        const priceData = response.data
        const price = priceData['USD']
        // console.log('price', price)
        setEthPrice(price)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <>
      <div className="flex flex-col text-center justify-center w-full bg-flarelink h-32 rounded-b-lg lg:rounded-l-none lg:rounded-r-lg px-4 lg:w-1/3">
        <div className="flex flex-col items-center text-center">
          <p className="text-gray-100 text-xs">At most</p>
          <div className="flex items-center text-white font-semibold text-2xl lg:text-lg xl:text-2xl">
            {priceToPay ? (
              (
                Number(priceToPay) * regPeriod +
                (0.5 * 10 ** 18) / 10 ** 18
              ).toFixed(3)
            ) : (
              <Loading isFinalPrize={true} isCalculation={false} />
            )}{' '}
            FLR
          </div>
          <div className="flex flex-wrap items-center text-xs gap-1 justify-center">
            <p className="text-gray-100 text-xs">Calculated to</p>
            <span className="font-semibold text-white flex items-center">
              $
              {priceToPay ? (
                (
                  (Number(priceToPay) * regPeriod +
                    (0.5 * 10 ** 18) / 10 ** 18) *
                  ethPrice
                ).toFixed(2)
              ) : (
                <Loading isFinalPrize={true} isCalculation={true} />
              )}{' '}
              USD
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function FinalPrice({
  regPeriod,
  fee,
  priceToPay,
}: {
  regPeriod: number
  fee: number
  priceToPay: string
}) {
  const flrPrice = ethers.utils.formatEther(priceToPay ? priceToPay : 1)
  return (
    <div className="flex flex-col items-center mt-9 h-96 w-full bg-[#334155] rounded-lg lg:rounded-l-lg lg:flex-row lg:h-32">
      <div className="flex flex-col h-2/3 items-center justify-evenly w-full lg:w-2/3 lg:flex-row rounded-lg">
        <FlarePrice regPeriod={regPeriod} priceToPay={flrPrice} />

        {/* + */}
        <div className="text-white text-xl">+</div>

        <GasFee fee={fee} />
      </div>

      {/* Final Price */}
      <TotalPrice regPeriod={regPeriod} fee={fee} priceToPay={flrPrice} />
    </div>
  )
}
