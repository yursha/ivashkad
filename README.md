# ivashkad
Ethernet command-line chat server. Designed to work with [ivashka](https://github.com/yursha/ivashka) client.

# Installation

`$ npm install -g ivashkad`

# Usage

`$ ivashkad`

Listens on port 6666 which is the standard port for **ivashka** server.

# Deployment

Currently ivashkad won't work on cloud node.js PAAS as Heroku or Nodejitsu due to the latter don't support raw tcp connections. This may change in the future though.
