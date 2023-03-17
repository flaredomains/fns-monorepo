import React, { useState } from 'react'

const progressArr = [
  {
    number: 1,
    stepText: 'Request to Register',
    descriptionText: `Your wallet will open and you will be asked to confirm the first of
  two transactions required for registration. If the second
  transaction is not processed within 7 days of the first, you will
  need to start again from step 1.`,
  },
  {
    number: 2,
    stepText: 'Wait for 1 minute',
    descriptionText: `The waiting period is required to ensure another person hasn't
  tried to register the same name and protect you after your request.`,
  },
  {
    number: 3,
    stepText: 'Complete Registration',
    descriptionText: `Click 'register' and your wallet will re-open. Only after
  the 2nd transaction is confirmed you'll know if you got the
  name.`,
  },
]

const Step = ({
  count,
  number,
  stepText,
  descriptionText,
}: {
  count: number
  number: number
  stepText: string
  descriptionText: string
}) => {
  console.log(`Number:${number} -- number - 1 ${number - 1} <= count ${count}`)
  console.log(`Number:${number} -- number - 1 ${number - 1} === count ${count}`)
  console.log(`Number:${number} -- number ${number} <= count ${count}`)
  return (
    <>
      <div className="w-full flex-col justify-center items-center mt-4 lg:mt-0 lg:w-1/3">
        {/* Line and number */}
        <div className="flex justify-center items-center w-full">
          {/* First half line */}
          <div
            className={`w-1/2 h-1 transition duration-500 ease-in ${
              number - 1 <= count ? 'bg-[#F97316]' : 'bg-[#334155]'
            }`}
          />
          {/* Number */}
          <div
            className={`flex justify-center items-center transition duration-500 ease-in ${
              number - 1 === count
                ? 'bg-[#0F172A] border-[#F97316]'
                : number - 1 < count
                ? 'bg-[#F97316] border-[#F97316]'
                : 'bg-[#0F172A] border-[#E2E8F0]'
            } border-2 h-9 w-9 rounded-full p-3 text-center`}
          >
            <p className="text-white">{number}</p>
          </div>
          {/* Second half line */}
          <div
            className={`w-1/2 h-1 transition duration-500 ease-in ${
              number <= count ? 'bg-[#F97316]' : 'bg-[#334155]'
            }`}
          />
        </div>
        <p className="text-white font-medium mt-2 text-center">{stepText}</p>
        <p className="text-[#94A3B8] text-[0.625rem] mx-2 mt-4 text-center">
          {descriptionText}
        </p>
      </div>
    </>
  )
}

export default function Steps() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className="flex flex-col mt-10 w-full lg:flex-row">
        {progressArr.map((item, index) => (
          <Step
            key={index}
            count={count}
            number={item.number}
            stepText={item.stepText}
            descriptionText={item.descriptionText}
          />
        ))}
      </div>
      {/* <button
        onClick={() => setCount(count + 1)}
        className="bg-[#F97316] text-white font-semibold  rounded-xl p-5 mt-10"
      >
        Add count
      </button> */}
    </>
  )
}
