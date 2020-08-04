# Azuhntivize

Incentivizing machine learning model training.

Upload a problem set to IPFS and fund the contract with some reward amount. Participants can submit models trained off this data, and their
performance against some evaluation dataset determines the share of the reward they receive.


## Requirements


## Installation
Install web dependencies
`cd web && yarn`

Install truffle and ganache

Start a ganache test network

Install Metamask browser extension

Configure Metamask to point to Ganache test network

Import an account from Ganache to Metamask using the private key of the account (click the key icon)

## Run
To build the contract, execute `scripts/build_contract.sh`
Ensure you have installed `truffle` and are running a local blockchain with `ganache`

To start the web app, execute `yarn start` in the web directory.

### Debug


### Prod
