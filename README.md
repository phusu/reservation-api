# Reservation-api

Simple Reservation API implemented with AWS Serverless Framework.

Background: Our band rehearsal space had an old and aging PHP & MySQL based application for reserving rehearsal slots. I decided to implement a completely new solution with modern technologies and utilize AWS Serverless Framework for the application so that it needs no maintaining of servers.

The rehearsal slot is always a one-hour slot. If a user wants to book a longer slot, for example from 6PM to 9PM, he or she would need to make three reservations.

Supported functionality in this API:
- GET returns all reservations from 'now' to five weeks forward.
- PUT adds a new reservation.
- DELETE deletes a reservation.

Goals of the project:
- Learn to implement a completely serverless API in AWS
- Learn TypeScript / Node.JS
- Learn Swagger for defining the API
- Learn CloudFormation for creating the environment, resources, etc.
- Learn AWS CodePipeline for automatic integration, building and deployment of the application
- Learn Cognito for authorizing users

AWS resources used:
- S3 bucket for storing the build artifacts
- Lambda function for executing the functionality of the API
- API Gateway for the API itself
- DynamoDB for storing the reservations
- Cognito for authorizing users

Make S3 bucket "reservation-api"
Make Cognito User pool
Make CodePipeline
