/**
 * File: api_backend.ts
 * Description: Contains the Lambda function, which handles the API backend functionality
 * and will be called by AWS API Gateway.
 * Author: Pertti Husu
 */

'use strict';

// Import external modules
import moment = require('moment');

// Import own modules
import { Reservation } from './reservation';
import { DBClient } from './dbclient';

// Constants
const DATE_FORMATTER = 'YYYY-MM-DDTHH:mm:ss';

// Create the DBClient
// Table name is given as a Lambda environment variable
let dbclient = new DBClient(process.env.TABLE_NAME);

/**
 * Lambda handler.
 */
exports.handler = function (event, context, callback) {

    if (event.httpMethod === 'GET') {
        // Figure out startTime & endTime
        let startTime = moment().startOf('hour');
        let startTimeStr = startTime.format(DATE_FORMATTER);

        // Endtime is end of week, five weeks from now
        let endTime = moment().endOf('isoWeek');
        endTime.add(5, 'w');
        let endTimeStr = endTime.format(DATE_FORMATTER);

        // Get all reservations
        dbclient.getReservations(startTimeStr, endTimeStr).then((response) => {
            // Return response to caller
            let httpResp = {
                "statusCode": 200,
                "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                "body": JSON.stringify(response)
            };
            callback(null, httpResp);
        }).catch((error) => {
            let httpResp = {
                "statusCode": 500,
                "body": `Server error: ${JSON.stringify(error)}`
            };
            callback(null, httpResp);
        });
    }
    else if (event.httpMethod === 'PUT') {

        // Parse parameters
        let query = JSON.parse(event.body);

        if (query.startTime && query.userName) {
            let timeObj = moment(query.startTime, DATE_FORMATTER);

            if (!timeObj.isValid()) {
                // Return response to caller
                let httpResp = {
                    "statusCode": 400,
                    "body": `Bad request: Invalid timestamp (${query.startTime})`
                };
                callback(null, httpResp);
                return;
            }

            // Ignore minutes & seconds
            timeObj.minute(0);
            timeObj.second(0);

            let reservation = new Reservation(timeObj.format(DATE_FORMATTER), query.userName);
            dbclient.addReservation(reservation).then((response) => {
                let resp = {
                    "statusCode": 200
                };
                // Return response to caller
                let httpResp = {
                    "statusCode": 200,
                    "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    "body": JSON.stringify(resp)
                };
                callback(null, httpResp);
            }).catch((error) => {
                // Return response to caller
                let httpResp = {
                    "statusCode": 500,
                    "body": `Server error: ${JSON.stringify(error)}`
                };
                callback(null, httpResp);
            });
        }
    }
    else if (event.httpMethod === 'DELETE') {

        // Parse parameters
        let query = JSON.parse(event.body);

        if (query.startTime && query.userName) {
            let timeObj = moment(query.startTime, DATE_FORMATTER);

            if (!timeObj.isValid()) {
                // Return response to caller
                let httpResp = {
                    "statusCode": 400,
                    "body": `Bad request: Invalid timestamp (${query.startTime})`
                };
                callback(null, httpResp);
                return;
            }

            // Ignore minutes & seconds
            timeObj.minute(0);
            timeObj.second(0);

            let reservation = new Reservation(timeObj.format(DATE_FORMATTER), query.userName);
            dbclient.deleteReservation(reservation).then((response) => {
                // Return response to caller
                let resp = {
                    "statusCode": 200
                };
                let httpResp = {
                    "statusCode": 200,
                    "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    "body": JSON.stringify(resp)
                };
                callback(null, httpResp);
            }).catch((error) => {
                // Return response to caller
                let httpResp = {
                    "statusCode": 500,
                    "body": `Server error: ${JSON.stringify(error)}`
                };
                callback(null, httpResp);
            });
        }
    }
    else {
        let httpResp = {
            "statusCode": 400,
            "body": `Bad request`
        };
        callback(null, httpResp);
    }
};