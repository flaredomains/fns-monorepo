import React, { useState } from 'react'
import Image from 'next/image'
import ArrowDown from '../../public/ArrowDown.svg'

const arrFAQ = [
  {
    text: 'How long does it take to register a name using the .flr registrar?',
    subText:
      'It takes less than 5 minutes to register a name, including a 1-minute delay between the first and second transactions to prevent frontrunning.',
  },
  {
    text: 'Which wallets and dapps support FNS so far?',
    subText: 'TBA',
  },
  {
    text: 'Once I own a Flare name, can I create a subdomain?',
    subText:
      'Yes. You can delegate ownership of subdomains to a different wallet or smart contract. You can also manipulate the CNAME and Text Records for each subdomain.',
  },
  {
    text: 'Can I change the address my name points to after I’ve registered it?',
    subText:
      'Yes, you can update the addresses and other resources pointed to by your name at any time.',
  },
  {
    text: 'Who owns the FNS root contract? What functions does that grant them?',
    subText: 'TBA',
  },
  {
    text: 'What about foreign characters? What about upper case letters? Is any unicode character valid What does it cost to register a .flr domain?',
    subText:
      'Because the FNS contracts only deal with hashes internally, they do not enforce limits on what can be registered. However, any resolvers such as browsers and wallets should apply the same nameprep algorithm to any names a user enters before resolving. As a result, names that are not valid outputs of nameprep will not be resolvable by the standard PublicResolver, making them useless.',
  },
  {
    text: 'Currently, registration costs are set at the following prices (Not including gas fees):',
    subText:
      'Domains with less than 5 characters are priced higher since there are less combinations than the names with 5+ characters.',
    list: [
      '5+ character .flr names: $5 in FLR per year.',
      '4 character .flr names: $100 in FLR per year.',
      '3 character .flr names: $300 in FLR per year.',
      '2 character .flr names: $350 in FLR per year.',
      '1 character .flr names: $500 in FLR per year.',
    ],
  },
  {
    text: 'What happens if I forget to extend the registration of a name?',
    subText: `After your name expires, there is a 90 day grace period in which the owner can't edit the records but can still re-register the name. After the grace period, the name is released for registration by anyone with a temporary premium which decreases over a 21 days period. The released name continues to resolve your ETH address until the new owner overwrites it.`,
  },
  {
    text: 'Is FNS only for storing a Flare address?',
    subText:
      'No, you can store the addresses of over 100 blockchains, a content hash of a decentralized website, profile information such as an avatar and Twitter handle, and more.',
  },
  {
    text: 'Can I use an FNS name to point to my website?',
    subText: `Though FNS can technically store anything, there aren't many third party tools and applications which resolve IP addresses attached to FNS.
    Instead, we suggest hosting your static html/css/images on IPFS and put the hash in your FNS name's Content record. Then it can be resolved by FNS-aware browsers (e.g. Opera), browser extensions (Metamask), or any browser with ".link" or ".limo" appended to the end (e.g. matoken.eth.link or matoken.eth.limo).
    If you want to redirect your FNS name to an existing website, you could write a html file containing JavaScript logic to redirect to your website, upload the file into ipfs using services like IPFS Pinata, then set the CID to your contenthash. See the source code of depositcontract.eth.limo as an example.`,
  },
  {
    text: 'What is the maximum length of a name I can register?',
    subText: 'There is no limit on the name length.',
  },
  {
    text: 'Can you have names with emojis?',
    subText:
      'Yes you can! But, alternative DApp integrations not made by the FNS team will need to ensure they decode the FNS data correctly to display any emoji-based addresses.',
  },
  {
    text: 'Can I register names other than .flr?',
    subText:
      'As of now, our protocol only supports .flr names. This can change in the near future.',
  },
  {
    text: 'What is the difference between the Registrant and Controller?',
    subText: `If your Flare address is set as the Controller you can change the resolver and add/edit records. Some dapps (eg: Fleek, OpenSea) set themselves as the Controller so they can update records on your behalf.
    The Registrant only exists on ".flr" names and it allows you to change the Controller. If you transfer the Registrant to an address you don't own, you lose the ownership of the name.`,
  },
  {
    text: 'What is a Resolver?',
    subText: `A Resolver is a smart contract that holds records. Names are set by default to the Public Resolver managed by the FNS team and has all the standard FNS record types. You can set your Resolver to a custom resolver contract if you'd like.`,
  },
  {
    text: 'What is a Primary FNS Name record?',
    subText: `A Primary FNS Name record (formerly Reverse Record) makes your Flare address point to an FNS name. This allows dapps to find and display your FNS name when you connect to them with your Flare account. This can only be set by you so it is not set automatically upon registration.
    To set the Primary FNS Name record, please click "My account", and select "Primary FNS Name".`,
  },
  {
    text: 'Why are some of my subdomains shown as a jumble of characters?',
    subText: `FNS names are stored as a hash on-chain so we have to decode the name using a list of possible names, and it shows in the hashed format if we don't have it on our list. You can still access and manage the name if you search for the name directly in the search bar.`,
  },
  {
    text: 'What happens if I forget to extend the registration of a name?',
    subText: `After your name expires, there is a 90 day grace period in which the owner can't edit the records but can still re-register the name. After the grace period, the name is released for registration by anyone with a temporary premium which decreases over a 21 days period. The released name continues to resolve your FLR address until the new owner overwrites it.`,
  },
  {
    text: 'What kinds of behaviours are likely to result in losing ownership of a name?',
    subText:
      'The .flr registrar is structured such that names, once issued, cannot be revoked so long as an active registration is maintained.',
  },
]

const FAQ_Line = ({
  text,
  subText,
  list,
}: {
  text: string
  subText: string
  list: Array<string> | undefined
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex-col px-4 py-4 border-b border-gray-600 cursor-pointer"
      >
        {/* Text */}
        <div className="flex justify-between items-center">
          <p className="text-base font-medium text-gray-200">{text}</p>
          <Image className="h-2 w-3" src={ArrowDown} alt="FNS" />
        </div>
        {list && (
          <ul
            className={`list-disc ${
              isOpen ? 'block' : 'hidden'
            } py-4 text-gray-500 font-normal text-sm pl-4`}
          >
            {list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {/* SubText */}
        <p
          className={`${
            isOpen ? 'block' : 'hidden'
          } py-4 text-gray-500 font-normal text-sm`}
        >
          {subText}
        </p>
      </div>
    </>
  )
}

export default function FAQ() {
  return (
    <>
      <div className="flex-col w-full mt-6 mx-auto lg:flex lg:flex-row lg:w-full">
        <div className="flex-col bg-gray-800 px-4 py-16 w-full rounded-md lg:px-[70px]">
          <div className="flex-col bg-gray-700 w-full px-8 py-8 rounded-lg">
            <p className="text-white font-bold mb-6 px-4 text-4xl">
              Frequently Asked Questions
            </p>
            {arrFAQ.map((item, index) => (
              <FAQ_Line
                key={index}
                text={item.text}
                subText={item.subText}
                list={item.list}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
