import { Component } from '@angular/core';
import { CoachService } from './services/coach.service';
import { coach } from './models/coach';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'tickets';
  userId: number = 1;
  userSeats!: number;
  msg!: string;
  coachInfo!: coach;
  seatsInRow: number = 0;
  seatsInCol: number = 0;
  maxBookSeats: number = 0;
  seats!: number[][];
  submit!: boolean;
  bookedSeats!: number[];
  chooseSeats!: number[];
  constructor(private coachService: CoachService) {
    this.coachService.getCoachInfo().subscribe(
      (response) => {
        //next() callback
        this.coachInfo = response.data.coachInfo;
        this.seatsInCol = 7;
        this.maxBookSeats = 7;
        this.seatsInRow = Math.abs(this.coachInfo.totalSeats / this.seatsInCol); // calculate rows
        this.seats = [];
        this.chooseSeats = [];
        this.bookedSeats = this.coachInfo.bookedData;
        for (
          var seatRowIndex = 0;
          seatRowIndex < this.seatsInRow;
          seatRowIndex++
        ) {
          this.seats[seatRowIndex] = [];
          for (
            var seatColIndex = 0;
            seatColIndex < this.seatsInCol;
            seatColIndex++
          ) {
            var total =
              seatRowIndex == 0
                ? seatColIndex
                : seatRowIndex * this.seatsInCol + seatColIndex; // calculte seat no.
            if (total < this.coachInfo.totalSeats) {
              this.seats[seatRowIndex][seatColIndex] = total + 1; // init seats with seat no.
            }
          }
        }
      },
      (error) => {
        //error() callback
        console.error('Request failed with error');
        this.msg = JSON.stringify(error.error);
      }
    );
  }

  checkSeatIsBooked(seat: number): boolean {
    // check already booked seats
    return this.bookedSeats.indexOf(seat) == -1 ? false : true;
  }

  mySeats(seat: number): boolean {
    // check user seat in slots
    return this.chooseSeats.indexOf(seat) == -1 ? false : true;
  }

  confirmUserSeats(): void {
    // validate input is valid or not
    this.chooseSeats = [];
    if (!this.userSeats) {
      this.msg = 'The Field is required';
      this.submit = false;
    } else if (this.userSeats > 0 && this.userSeats <= 7) {
      this.submit = true;
      this.msg = '';
      this.checkAvailableSeats();
    } else {
      this.msg = 'No. of seats must be between 1 to 7';
      this.submit = false;
    }
  }

  checkAvailableSeats(): void {
    // check closest free slots for fill the row seats
    var slots: any[][][] = [];
    for (var seatRowIndex = 0; seatRowIndex < this.seatsInRow; seatRowIndex++) {
      var freeSeats = 0;
      var freeSeatsArr = [];
      var rowSeats = this.seats[seatRowIndex];
      slots[seatRowIndex] = [];
      for (
        var seatColIndex = 0;
        seatColIndex < this.seatsInCol;
        seatColIndex++
      ) {
        if (rowSeats[seatColIndex]) {
          freeSeats++;
          freeSeatsArr.push(rowSeats[seatColIndex]);
          if (freeSeats == this.userSeats) {
            var cloneFreeSeats = Object.assign([], freeSeatsArr);
            slots[seatRowIndex].push(cloneFreeSeats);
            freeSeatsArr.splice(0, 1);
            freeSeats--;
          }
        }
      }
    } // create all slots for sittings

    var lowestPot = -1;
    var lowestPotVal = -1;
    for (var rowIndex = 0; rowIndex < slots.length; rowIndex++) {
      var rowSlot = slots[rowIndex];
      for (var colIndex = 0; colIndex < rowSlot.length; colIndex++) {
        var intersection = rowSlot[colIndex].filter((nestedColSlot) => {
          return this.bookedSeats.includes(nestedColSlot);
        });
        if (intersection.length > 0) {
          // check booked slots
          slots[rowIndex].splice(rowSlot.indexOf(rowSlot[colIndex]), 1);
          colIndex--;
        }
      }

      // find the lowest seat in a row
      if (lowestPotVal == -1 && slots[rowIndex].length != 0) {
        lowestPotVal = slots[rowIndex].length;
        lowestPot = rowIndex;
      } else {
        if (
          slots[rowIndex].length != 0 &&
          lowestPotVal > slots[rowIndex].length
        ) {
          lowestPotVal = slots[rowIndex].length;
          lowestPot = rowIndex;
        }
      }
    }

    if (lowestPot != -1) {
      this.chooseSeats = slots[lowestPot][0];
      this.confirmSeats();
    } else {
      var emptySeats = [];
      for (var rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
        var rowSeats = this.seats[rowIndex];
        for (var colIndex = 0; colIndex < rowSeats.length; colIndex++) {
          var slotValue = rowSeats[colIndex];
          if (
            !this.bookedSeats.includes(slotValue) &&
            emptySeats.length < this.userSeats
          ) {
            emptySeats.push(slotValue);
          }
        }
      }

      if (emptySeats.length != this.userSeats) {
        alert('seats are not available');
      } else {
        this.chooseSeats = emptySeats;
        this.confirmSeats();
      }
    }
  }

  confirmSeats(): void {
    // confirm my seats as booked
    if (this.chooseSeats.length != this.userSeats) {
      return alert('Please Select ' + this.userSeats + ' seat(s).');
    }

    this.coachService
      .userSeatBooks(
        this.coachInfo.trainId,
        this.coachInfo.id,
        this.userId,
        this.chooseSeats
      )
      .subscribe(
        (response) => {
          //next() callback
          this.bookedSeats = this.bookedSeats.concat(this.chooseSeats);
          //this.chooseSeats = [];
          //this.submit = false;
          //this.userSeats = 0;
        },
        (error) => {
          //error() callback
          console.error('Request failed with error');
          this.msg = JSON.stringify(error.error);
        }
      );
  }
}
