/**
 * File: reservation.ts
 * Description: Models a reservation, which is stored in DynamoDB.
 * Author: Pertti Husu
 */

'use strict';

/**
 * Class Reservation for representing a single reservation.
 * Reservation is represented as a one hour slot which is related to a single user.
 * Time format is: 'yyyy-MM-ddTHH:mm:ss'. Minutes and seconds are ignored and only hours used.
 */
export class Reservation {
    private startTime: string;
    private userName: string;

    /**
     * Constructs a new Reservation object.
     * @param startTime Start time of the reservation. See class description for time format.
     * @param userName Name of the user that has done this reservation
     */
    constructor(startTime: string, userName: string) {
        this.startTime = startTime;
        this.userName = userName;
    }

    /**
     * Gets the start time.
     */
    get startTimeValue(): string {
        return this.startTime;
    }

    /**
     * Gets the user name.
     */
    get userNameValue(): string {
        return this.userName;
    }
}