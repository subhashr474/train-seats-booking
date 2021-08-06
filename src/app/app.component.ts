import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tickets';
  userSeats!: number;
  totalSeats: number = 0;
  seatsInRow: number = 0;
  seatsInCol: number = 0;
  maxBookSeats: number = 0;
  maxBookSeatsCollection!: number[];
  seats!: number[][];
  bookedSeats!: number[];
  chooseSeats!: number[];
  highlightSeats!: number[];
  constructor() {
    this.totalSeats = 80;
    this.seatsInCol = 7;
    this.maxBookSeats = 7;
    this.userSeats = 0;
    this.seatsInRow = Math.abs(this.totalSeats / this.seatsInCol); // calculate rows
    this.seats = [];
    this.chooseSeats = [];
    this.highlightSeats = [];
    this.bookedSeats = [35, 40, 1, 50, 77, 3];
    this.maxBookSeatsCollection = [];
    for (let i = 0; i < this.maxBookSeats; i++) {
      this.maxBookSeatsCollection.push(i + 1);
    }

    for (var i = 0; i < this.seatsInRow; i++) {
      this.seats[i] = [];
      for (var j = 0; j < this.seatsInCol; j++) {
        var total = i == 0 ? j : i * this.seatsInCol + j; // calculte seat no.
        if (total < this.totalSeats) {
          this.seats[i][j] = total + 1; // init seats with seat no.
        }
      }
    }
  }

  checkSeatIsBooked(seat: number): boolean {
    // check already booked seats
    return this.bookedSeats.indexOf(seat) == -1 ? false : true;
  }

  mySeats(seat: number): boolean {
    // check user seat is choosed or not
    return this.chooseSeats.indexOf(seat) == -1 ? false : true;
  }

  checkHighlightSeats(seat: number): boolean {
    // check user seat is choosed or not
    return this.highlightSeats.indexOf(seat) == -1 ? false : true;
  }

  selectSeat(seat: number): void {
    // user select seat for booking
    if (this.bookedSeats.indexOf(seat) > -1) {
      return alert('Seat Already Booked');
    }

    if (this.userSeats <= this.chooseSeats.length && !this.mySeats(seat)) {
      return alert(
        'You can not choose more than ' + this.userSeats + ' Seat(s).'
      );
    }

    if (this.mySeats(seat)) {
      this.chooseSeats.splice(this.chooseSeats.indexOf(seat), 1);
      this.suggestSeats();
    } else {
      this.chooseSeats.push(seat);
      this.suggestSeats();
    }
  }

  suggestSeats(): void {
    this.highlightSeats = [];
    if (this.chooseSeats.length >= 1 && this.userSeats > 1) {
      var exist = -1;
      var row = -1;
      for (var i = 0; i < this.seatsInRow; i++) {
        var rowSeats = this.seats[i];
        row = i;
        exist = -1;
        for (var j = 0; j < this.seatsInCol; j++) {
          if (this.chooseSeats.includes(rowSeats[j])) {
            exist = j;
            break;
          }
        }

        if (exist > -1) {
          var l = exist;
          var r = exist;
          var ar = 0;
          var count = 1;
          while (exist != -1) {
            if (
              this.chooseSeats.length + this.highlightSeats.length >=
                this.userSeats ||
              count > 15
            ) {
              exist = -1;
            }
            //console.log("c",(this.chooseSeats.length + this.highlightSeats.length));
            if (
              this.chooseSeats.includes(rowSeats[exist]) &&
              r == rowSeats.length - 1 &&
              this.chooseSeats.length + this.highlightSeats.length <
                this.userSeats
            ) {
              //console.log("bb",l,this.bookedSeats.includes(rowSeats[l-1]));
              if (
                l - 1 >= 0 &&
                !this.highlightSeats.includes(rowSeats[l - 1]) &&
                !this.chooseSeats.includes(rowSeats[l - 1]) &&
                !this.bookedSeats.includes(rowSeats[l - 1])
              ) {
                l--;
                this.highlightSeats.push(rowSeats[l]);
              } else if (
                l - 1 >= 0 &&
                (this.bookedSeats.includes(rowSeats[l - 1]) ||
                  this.highlightSeats.includes(rowSeats[l - 1]) ||
                  this.chooseSeats.includes(rowSeats[l - 1]))
              ) {
                l--;
              }
            }

            if (
              this.chooseSeats.includes(rowSeats[exist]) &&
              this.chooseSeats.length + this.highlightSeats.length <
                this.userSeats
            ) {
              //console.log("aa",r,this.bookedSeats.includes(rowSeats[r+1]));
              if (
                r + 1 <= rowSeats.length - 1 &&
                !this.highlightSeats.includes(rowSeats[r + 1]) &&
                !this.chooseSeats.includes(rowSeats[r + 1]) &&
                !this.bookedSeats.includes(rowSeats[r + 1])
              ) {
                r++;
                this.highlightSeats.push(rowSeats[r]);
              } else if (
                r + 1 <= rowSeats.length - 1 &&
                (this.bookedSeats.includes(rowSeats[r + 1]) ||
                  this.highlightSeats.includes(rowSeats[r + 1]) ||
                  this.chooseSeats.includes(rowSeats[r + 1]))
              ) {
                r++;
              }
            }

            //console.log("row",row,(this.chooseSeats.length + this.highlightSeats.length),l,r);
            if (
              this.chooseSeats.length + this.highlightSeats.length <
                this.userSeats &&
              l <= 0 &&
              r >= rowSeats.length - 1
            ) {
              if (
                !this.chooseSeats.includes(rowSeats[exist]) &&
                ar < rowSeats.length
              ) {
                if (
                  !this.highlightSeats.includes(rowSeats[ar]) &&
                  !this.chooseSeats.includes(rowSeats[ar]) &&
                  !this.bookedSeats.includes(rowSeats[ar])
                ) {
                  this.highlightSeats.push(rowSeats[ar]);
                }
                ar++;
              }

              if (ar == rowSeats.length || ar == 0) {
                if (row == this.seats.length - 1) {
                  row--;
                  rowSeats = this.seats[row];
                  r = rowSeats.length;
                } else {
                  row++;
                  rowSeats = this.seats[row];
                }
              }
            }

            count++;
          }
        }
      }
    }
  }

  confirmSeats(): void {
    // confirm my seats as booked
    if(this.chooseSeats.length != this.userSeats){
      return alert('Please Select '+this.userSeats+' seat(s).');
    }

    this.bookedSeats = this.bookedSeats.concat(this.chooseSeats);
    this.chooseSeats = [];
    this.highlightSeats = [];
  }

  setUserSeats(): void {
    this.chooseSeats = [];
    this.highlightSeats = [];
  }
}
