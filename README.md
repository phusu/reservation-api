# Reservation API

Simple Reservation API implemented with AWS Serverless Framework.

## Background and implementation details
Our band rehearsal space had an old and aging PHP & MySQL based application for reserving rehearsal slots. I decided to implement a completely new solution with modern technologies and utilize AWS Serverless Framework for the application so that it needs no maintaining of servers. In addition, this solution is extremely low-cost.

The rehearsal slot is always a one-hour slot. If a user wants to book a longer slot, for example from 6PM to 9PM, he or she would need to make three reservations. A reservation is represented by two strings: A `startTime`and a `userName` which is basically the band name. For timestamp handling an excellent Moment.js library is used. User must be authorized to access the API methods. All user credentials are manually maintained in Cognito user pool.

## Supported functionality in this API
- GET returns all reservations from 'now' to five weeks forward.
- PUT adds a new reservation.
- DELETE deletes a reservation.

## Goals of the project
- Learn to implement a completely serverless API in AWS
- Learn TypeScript / Node.JS
- Learn Swagger for defining the API
- Learn CloudFormation for creating the environment, resources, etc.
- Learn AWS CodePipeline for automatic integration, building and deployment of the application
- Learn Cognito for authorizing users

## AWS resources used
- S3 bucket for storing the build artifacts
- Lambda function for executing the functionality of the API
- API Gateway for the API itself
- DynamoDB for storing the reservations
- Cognito for authorizing users

## Steps needed for use
- Make S3 bucket "reservation-api", needed for storing the build artifacts
- Modify the files and fill in your own AWS account details (region, account ID, Cognito User pool ARN)
- Make Cognito User pool
- Make CodePipeline: http://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html

## Things still to do
- Client (coming up)
- Modern client with Angular (probably coming up)
- Roles for users to implement an admin user who could modify all reservations (depends if Cognito groups support will improve)
- Recurring reservation (need to figure out the best way to implement)

## Lessons learned
I could have probably implement all of the server-side functionality in client application, for example accessing the DynamoDB database directly using AWS Javascript SDK. I might still do that if I decide (and have time) to do a completely new client with Angular. However, this implementation of Reservation API serves as a nice example of how to implement a completely serverless solution with AWS resources and how to automatize the build & deployment using CodePipeline.