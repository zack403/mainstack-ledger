Solution Documentation
===========================

# Approach to solving the problem and Task Breakdown
   # Step 1: Project Setup
   - Initialize Git Repository
   - Clone Repository
   - Set Up Project Structure

   # Step 2: Divided the Tasks
   - Setting up Nodejs Express Typescript project structure(leveraged the controller-service-repository pattern with tsyringe Dependency Injection container which makes us to have seperation of concerns and help us achieve invertion of control and make components more testable and flexible.)
   - Setup ESLint for better development experience
   - Handling global error cases and response cases.
   - Set up loggin and Auditing 
   - Defining Mongoose models and setting up the database.
   - Implementing API endpoints.
     - User registration
     - User login
     - account management
     - transactions management
   - Setup swagger api documentation
   - Writing documentation and README.
   
   # Step 3: Implement Features
   - Create Branches
   - Work on Features
   - Commit Changes
   - Push Branches

   # Step 4: Review and Merge
   - Pull Requests
   - Review Code
   - Merge PRs

# Improvements If given more time

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

