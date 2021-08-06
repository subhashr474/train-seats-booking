import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tickets';
  userSeats!: number;
  msg!: string;
  totalSeats: number = 0;
  seatsInRow: number = 0;
  seatsInCol: number = 0;
  maxBookSeats: number = 0;
  seats!: number[][];
  submit!: boolean;
  bookedSeats!: number[];
  chooseSeats!: number[];
  constructor() {
    this.totalSeats = 80;
    this.seatsInCol = 7;
    this.maxBookSeats = 7;
    this.seatsInRow = Math.abs(this.totalSeats / this.seatsInCol); // calculate rows
    this.seats = [];
    this.chooseSeats = [];
    this.bookedSeats = [35,40,1,50,77,3];
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
    } else {
      this.chooseSeats.push(seat);
    }
  }

  confirmSeats(): void {
    // confirm my seats as booked
    if(this.chooseSeats.length != this.userSeats){
      return alert('Please Select '+this.userSeats+' seat(s).');
    }

    this.bookedSeats = this.bookedSeats.concat(this.chooseSeats);
    this.chooseSeats = [];
    this.submit = false;
    this.userSeats = 0;
  }

  confirmUserSeats() : void{
      this.chooseSeats = [];
      if(!this.userSeats){
        this.msg = "The Field is required";
        this.submit = false;
      } else if(this.userSeats > 0 && this.userSeats <= 7){
        this.submit = true;
        this.msg = "";
        this.checkAvailableSeats();
      } else {
         this.msg = "No. of seats must be between 1 to 7";
         this.submit = false;
      }
  }

  checkAvailableSeats() : void{
    for (var i = 0; i < this.seatsInRow; i++) {
      var rowSeats = this.seats[i];
      var freeSeats = 0;
      var slots : any = [];
      slots.push([]);
      for (var j = 0; j < this.seatsInCol; j++) {
        if(this.bookedSeats.indexOf(rowSeats[j]) == -1){
          slots[slots.length-1].push(rowSeats[j]);
          freeSeats++;
        } else {
          slots.push([]);
          freeSeats = 0;
        }
      }

      if(freeSeats >= this.userSeats){
        for(var k=0; k < slots.length; k++){
           if(slots[k].length >= this.userSeats){             
              for(var a = 0 ; a < this.userSeats; a++){
                this.chooseSeats.push(slots[k][a]);  
              }
              break;
           }
        }
        break;
      }
    }
  }

}
