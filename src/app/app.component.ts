import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  date: any;
  now: any;
  targetDate: any = new Date(2022, 12, 9);
  targetTime: any = this.targetDate.getTime();
  difference!: number;
  months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentTime: any = `${
    this.months[this.targetDate.getMonth()]
  } ${this.targetDate.getDate()}, ${this.targetDate.getFullYear()}`;

  @ViewChild('days', { static: true }) days!: ElementRef;
  @ViewChild('hours', { static: true }) hours!: ElementRef;
  @ViewChild('minutes', { static: true }) minutes!: ElementRef;
  @ViewChild('seconds', { static: true }) seconds!: ElementRef;

  ngAfterViewInit() {
    setInterval(() => {
      this.tickTock();
      this.difference = this.targetTime - this.now;
      this.difference = this.difference / (1000 * 60 * 60 * 24);

      !isNaN(this.days.nativeElement.innerText)
        ? (this.days.nativeElement.innerText = Math.floor(this.difference))
        : (this.days.nativeElement.innerHTML = `<img src="https://i.gifer.com/VAyR.gif" />`);
    }, 1000);
  }

  tickTock() {
    this.date = new Date();
    this.now = this.date.getTime();
    this.days.nativeElement.innerText = Math.floor(this.difference);
    this.hours.nativeElement.innerText = 23 - this.date.getHours();
    this.minutes.nativeElement.innerText = 60 - this.date.getMinutes();
    this.seconds.nativeElement.innerText = 60 - this.date.getSeconds();
  }
  title = 'BeatTheBoss';

  holding = [];
  moves:any;
  rating = 3
  diskNum = 7;
  minMoves = 127;
  canves:any = ('#canves');
  restart = this.canves.find('.restart');
  tower = this.canves.find('.tower');
  scorePanel = this.canves.find('#score-panel');
  movesCount = this.scorePanel.find('#moves-num');
  ratingStars = this.scorePanel.find('i');


  
  setRating = (moves: number) => {
    if (moves === 127) {
			this.ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
			this.rating = 2;
		} else if (moves >= 128 && moves <= 228) {
			this.ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
			this.rating = 1;
		} else if (moves >= 229) {
			this.ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
			this.rating = 0;
		}	
		return { score: this.rating };
  }
  initGame = () => {
    this.tower.html('');
    this.moves = 0;
    this.movesCount.html(0);
    this.holding = [];
    for ( var i = 1; i <= this.diskNum; i++){
      this.tower.prepend('<li class="disk disk-' + i + '" data-value="' + i + '"></li>');
    }
  }

  countMove = () => {
    this.moves++;
    this.movesCount.html(this.moves);
    if (this.moves > this.minMoves - 1) {
			if (this.tower.eq(1).children().length === this.diskNum || this.tower.eq(2).children().length === this.diskNum) {
				Swal.fire({
					allowEscapeKey: false,
					allowOutsideClick: false,
					title: 'Congratulations! You Won!',
					text: "Boom Shaka Lak",
					type: 'success',
					confirmButtonColor: '#8bc34a',
					confirmButtonText: 'Play again!'
				}).then(function(isConfirm: any) {
					if (isConfirm) {
						initGame(.eq(0));
					}
				})
			}
		}
		
		setRating(this.moves);
  }
}
