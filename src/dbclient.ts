/**
 * File: dbclient.ts
 * Description: Database client for DynamoDB.
 * Author: Pertti Husu
 */

'use strict';

// Import external modules
import AWS = require('aws-sdk');

// Import own modules
import { Reservation } from './reservation';

/**
 * Class DBClient for handling database operations
 */
export class DBClient {

    // Our DynamoDB client
    private dynamodb: AWS.DynamoDB.DocumentClient;

    // DynamoDB table name
    private tableName: string;

    /**
     * Constructor for the DBClient. Sets up the database connection.
     * @param tableName DynamoDB table name as a string.
     */
    constructor(tableName: string) {
        AWS.config.update({
            region: <<YOUR_AWS_REGION >>
        });

        this.dynamodb = new AWS.DynamoDB.DocumentClient();
        this.tableName = tableName;
    }

    /**
     * Adds a new reservation to the database. 
     * 
     * @param reservation Reservation to add.
     * @return Promise object containing boolean. True, if reservation was added successfully. Reservation succeeds when there is no entry 
     * for the given 'startTime'. If there already is an entry or any error occurs, function will return false.
     */
    addReservation(reservation: Reservation): Promise<boolean> {
        let p = new Promise<boolean>((resolve, reject) => {
            if (reservation) {
                let params = {
                    TableName: this.tableName,
                    Item: {
                        'timeFrom': reservation.startTimeValue,
                        'userName': reservation.userNameValue
                    },
                    ConditionExpression: 'attribute_not_exists(timeFrom)'
                };

                console.log('Adding new item to DB...');
                let putPromise = this.dynamodb.put(params).promise();
                putPromise.then((response) => {
                    console.log(`Got a response: ${JSON.stringify(response)}`);
                    resolve(true);
                }, (error) => {
                    console.log(`Caught an error: ${JSON.stringify(error)}`);
                    reject("Couldn't add new reservation, because reservation already exists.");
                });
            }
            else {
                reject('Missing reservation object.');
            }
        });
        return p;
    }

    /**
     * Deletes a reservation from the database.
     * 
     * @param reservation Reservation to delete.
     * @return Promise object containing boolean. True, if reservation was deleted successfully. Reservation deletion succeeds when there exists
     * an entry with the same start time than parameter 'startTime' and the reservation user name equals to parameter
     * 'userName'. If there is no reservation for given 'startTime', or the user names don't match, function will
     * return false.
     */
    deleteReservation(reservation: Reservation): Promise<boolean> {
        let p = new Promise<boolean>((resolve, reject) => {
            if (reservation) {
                let params = {
                    TableName: this.tableName,
                    Key: {
                        'timeFrom': reservation.startTimeValue
                    },
                    ConditionExpression: 'userName = :val',
                    ExpressionAttributeValues: {
                        ':val': reservation.userNameValue
                    }
                };

                console.log('Attempting to delete an item from DB...');
                let deletePromise = this.dynamodb.delete(params).promise();
                deletePromise.then((response) => {
                    console.log(`Got a response: ${JSON.stringify(response)}`);
                    resolve(true);
                }, (error) => {
                    console.log(`Caught an error: ${JSON.stringify(error)}`);
                    reject("Couldn't delete reservation, because resservation doesn't exist or userId doesn't match.");
                });
            }
            else {
                reject('Missing reservation object.');
            }
        });
        return p;
    }

    /**
     * Returns an array of reservations between two timestamps.
     * @param startTime Start time of the search, inclusive
     * @param endTime End time of the search, exclusive
     * @return Promise object containing array of Reservation objects. If there were no results, array is empty.
     */
    getReservations(startTime: string, endTime: string): Promise<Reservation[]> {
        let p = new Promise<Reservation[]>((resolve, reject) => {
            let result: Array<Reservation> = [];

            if (startTime && endTime) {
                let params = {
                    TableName: this.tableName,
                    FilterExpression: 'timeFrom BETWEEN :val1 AND :val2',
                    ExpressionAttributeValues: {
                        ':val1': startTime,
                        ':val2': endTime
                    }
                };

                console.log('Getting list of reservations from DB...');
                let scanPromise = this.dynamodb.scan(params).promise();
                scanPromise.then((response) => {
                    console.log(`Got a response: ${JSON.stringify(response)}`);

                    if (response.Items) {
                        response.Items.forEach(item => {
                            result.push(new Reservation(item['timeFrom'], item['userName']));
                        });
                    }

                    resolve(result);

                }, (error) => {
                    console.log(`Caught an error: ${JSON.stringify(error)}`);
                    reject(`Caught an error: ${JSON.stringify(error)}`);
                });
            }
            else {
                reject('Missing timestamps.');
            }

        });
        return p;
    }
}