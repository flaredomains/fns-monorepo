import React from 'react'

function DomainSelect({ result }: { result: string }) {
  return (
    <>
      {/* Domain Container */}
      <div className="flex justify-between items-center w-full rounded-t-lg h-28 bg-[#334155] px-9 mr-4">
        {/* Domain */}
        <p
          data-test="Domain Text"
          className="text-white font-bold text-4xl w-3/4 truncate"
        >
          {/^0x/.test(result) // Check if is an address or normal text
            ? `${result.slice(0, 6)}...${result.slice(-4)}`
            : result}
        </p>
      </div>
    </>
  )
}

export default DomainSelect
