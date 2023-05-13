# Flare Naming Service Monorepo

## Introduction

Flare Name Service (FNS) is a decentralized domain name registry that facilitates the allocation of human-readable addresses to wallet addresses and smart contracts. FNS domains serve to simplify the identification of wallets and smart contracts on the Flare blockchain, as well as to enable links to decentralized webpages.

Anyone with a Flare-supported wallet may visit the FNS dApp to register a .flr address of their choosing. This process effectively transforms their 64-character 0x address, which is typically composed of randomized alphanumeric characters, into an easily recognizable domain name. The protocol also allows the setting of records of the users choosing, from arbitrary text inputs like email addresses, to wallet addresses for a multitude of other chains.

Access the docs [here](https://docs.flrns.domains/).


## Navigating the Monorepo

- [Front End](./apps/next) - nextJS environment for building the [FNS dApp](https://app.flrns.domains/).

- [Smart Contracts](./apps/forge) - Foundry environment for testing, compiling, and development of the smart contract protocol.


## How it Works

### FNS App

To get started, navigate to the FNS app at app.flrns.domains using a Web3 compatible browser and a Flare browser extension wallet such as Metamask (see a list of compatible wallets here). You can utilize the search function to browse through domain name options and determine which domains are currently available. Additionally, the app allows you to view the details of previously registered domain names, including the address that holds ownership, the address to which they resolve, and the expiration date of their registration.

### Registering

Once your browser wallet has been authorized to connect to the FNS app, you will be able to initiate the registration process for a .flr domain. Before submitting your registration request, ensure that your wallet contains enough FLR cryptocurrency to cover the registration fee and any associated gas fees. 
By default, FNS requires a two-step registration process to protect all users from front-running attacks.
Once you have confirmed the availability of a desired domain address and chosen the desired registration duration, click the "commit" button.

After signing the initial transaction with your browser extension wallet, you must wait a few minutes while the contracts prevent you from falling prey to a front-running attack. Once the registry approves your request, you will be prompted to finalize your registration by signing another transaction to register, which will likely entail the highest gas fee due to the computation involved.
Once the second transaction is processed, you will officially become the owner of a new .flr domain; however, additional configuration steps may be necessary before the domain is fully functional.

### Resolve Domain Address

Once you have successfully registered your .flr domain, the next step is to assign it to a Flare wallet or smart contract address of your choice. This can be accomplished by setting the ReverseRegistrar to point to your desired Flare Wallet Address on the My Account page.
You have the flexibility to choose whether the domain resolves to your own Flare wallet address or to an alternate wallet address or smart contract address. Once you have specified the desired address in the domain records, any transactions sent to the .flr domain will be automatically routed to the corresponding address via the resolver. To do this, you must be using a wallet provider that supports FNS domain name look-ups.

### Decentralized Webpages

FNS domains offer an additional feature of functioning as URLs to decentralized webpages. Similar to ENS domains, FNS domains have limitations when it comes to websites, but registrants can still create a functional HTML webpage by coding it and uploading the HTML file to the Inter-Planetary File System (IPFS) network. After that, registrants can paste the IPFS link into their FNS domain's content records, sign the transaction, and pay the gas fee to make their decentralized website live.

### Subdomains

FNS subdomains allow registrants to add a prefix to their original FNS domain, allowing them to create multiple subdomains that resolve to different Flare wallets or smart contract addresses. For instance, if someone registered elon.flr, they could create subdomains such as tesla.elon.flr or spacex.elon.flr, with each resolving to a different Flare wallet or smart contract address. Subdomains give registrants the ability to use one FNS domain for several different purposes, or even sell subdomains if their FNS domain is in high demand.