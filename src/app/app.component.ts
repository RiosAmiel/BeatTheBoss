import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { Cell, Maze, keyboardMap } from '../models';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
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

  //Main Game

  row = 15;
  col = 15;
  cellSize = 20; // cell size
  private maze: Maze;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameOver = false;
  private myPath: Cell[] = [];
  private currentCell: Cell;

  ngOnInit() {}

  ngAfterViewInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('maze');
    this.ctx = this.canvas.getContext('2d');
    this.drawMaze();
  }

  drawMaze() {
    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.canvas.width = this.col * this.cellSize;
    this.canvas.height = this.row * this.cellSize;
    this.maze.draw();
    this.initPlay();
  }

  initPlay(lineThickness = 10, color = '#4080ff') {
    this.gameOver = false;
    this.myPath.length = 0;
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);
    this.ctx.lineTo(this.cellSize / 2, this.cellSize / 2);
    this.ctx.stroke();
    this.currentCell = this.maze.cells[0][0];
    this.myPath.push(this.currentCell);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return;
    const direction = keyboardMap[event.key];
    if (direction) this.move(direction);
  }

  move(direction: 'Left' | 'Right' | 'Up' | 'Down') {
    let nextCell: Cell;
    if (direction === 'Left') {
      if (this.currentCell.col < 1) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col - 1
      ];
    }
    if (direction === 'Right') {
      if (this.currentCell.col + 1 >= this.col) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col + 1
      ];
    }
    if (direction === 'Up') {
      if (this.currentCell.row < 1) return;
      nextCell = this.maze.cells[this.currentCell.row - 1][
        this.currentCell.col
      ];
    }
    if (direction === 'Down') {
      if (this.currentCell.row + 1 >= this.row) return;
      nextCell = this.maze.cells[this.currentCell.row + 1][
        this.currentCell.col
      ];
    }
    if (this.currentCell.hasConnectionWith(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        this.maze.erasePath(this.myPath);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(new Cell(this.row - 1, this.col - 1))) {
          this.hooray();
          this.gameOver = true;
          this.maze.drawSolution('#4080ff');
          return;
        }
      }

      this.maze.drawPath(this.myPath);
      this.currentCell = nextCell;
    }
  }

  solution() {
    this.gameOver = true;
    this.maze.drawSolution('#ff7575', 3);
  }

  private hooray() {
    var audio = new Audio('assets/KidsCheering.mp3');
    audio.play();
  }
}

