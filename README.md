Main Stack Ledger
==========================================
## Getting Started
A Nodejs, Express,Typescript  Mongodb banking transaction api ledger system


# Solution Approach and Time taken
# Visit https://github.com/zack403/mainstack-ledger/blob/dev/SOLUTION.md

# Running the application
- clone repo
- checkout to dev branch
- `npm install` to install necessary dependencies
- create a .env file at the root of the project and copy value from .env.example file into it. (set the values for your environmental variables)
- run `openssl genrsa -out private.pem 2048` on bash to generate private key for token signing
- run `openssl rsa -in private.pem -pubout -out public.pem` on bash to generate pub key for token verification
- put the generated key inside of the config file
- `npm run dev` to start the development environment

* You should now have the api running at http://localhost:5000 and the swagger doc running at http://localhost:5000/api/v1/docs

# Using MongoDB Instance
- have mongodb installed or create a mongodby atlas instance on the cloud
- Get your mongoUri or connection string and put in the .env file