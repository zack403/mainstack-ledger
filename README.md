Core Banking Transaction Ledger
==========================================
## Getting Started
A Nodejs, Express,Typescript  Mongodb banking transaction api ledger system


# Running the application
- clone repo
- checkout to dev branch
- `npm install` to install necessary dependencies
- create a .env file at the root of the project and copy value from .env.example file into it. (set the values for your environmental variables)
- run `openssl genrsa -out private.pem 2048` on bash to generate private key for token signing
- run `openssl rsa -in private.pem -pubout -out public.pem` on bash to generate pub key for token verification
- put the generated key inside of the .env file for JWT_PRIVATE_KEY and JWT_PUBLIC_KEY respectively
- `npm run dev` to start the development environment

* You should now have the api running at http://localhost:5000 and the swagger doc running at http://localhost:5000/api/v1/docs

# Using MongoDB Instance
- have mongodb installed or create a mongodby atlas instance on the cloud
- Get your mongoUri or connection string and put in the .env file

# Future Improvements

## Asynchronous Processing for Transactions

- Currently, deposit, transfer, and withdrawal operations are handled synchronously.

- I would implement BullMQ with Redis to queue these operations, ensuring:

  - Better performance by offloading tasks to background workers.

  - Fault tolerance, so failed transactions can be retried.

  - Improved Rate limiting & load balancing, preventing overload on the database.

- Each transaction would be queued and processed atomically to maintain integrity.

## caching
Caching with Redis would be a great improvement to this application if given more time, it will greatly improve the performance of the application and increase the response time.

## Transaction Status Workflow
Currently, transactions are COMPLETED immediately real world fintechs use PENDING for processing (e.g., fraud checks, bank delays).Would be nice to Add PENDING state with a cron job or queue (e.g., BullMQ) to finalize later.

## Data Encryption & API Encryption
would be nice to Implement end-to-end encryption for request payloads using RSA, adding a layer beyond HTTPS and also Encrypt sensitive fields in the DB with AES, ensuring compliance and security.

## Real time Notifications
Clients don’t get real-time updates on transaction status changes, would be nice to Add a notification system

## Docker CI/CD Deployment
If i had more time, a robust dcoerk CI/CD pipeline Github Actions setup would be in place to automate deployment

## More test covergae to cover for different edge cases
Would also be good to add more edge-case tests to cover the various validation errors to ensure that changes don't introduce bugs further down the road.
