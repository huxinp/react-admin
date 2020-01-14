import React from 'react';
import renderGame from './snake';
import Rx from 'rxjs/Rx';
// import { Observable } from 'rxjs/Observable';
// import { animationFrame } from 'rxjs/scheduler/animationFrame';
// import {
//   map,
//   filter,
//   scan,
//   startWith,
//   distinctUntilChanged,
//   share,
//   withLatestFrom,
//   tap,
//   skip,
//   switchMap,
//   takeWhile,
//   first,
// } from 'rxjs/operators';

// import {
//   DIRECTIONS,
//   SPEED,
//   SNAKE_LENGTH,
//   FPS,
//   APPLE_COUNT,
//   POINTS_PRE_APPLE,
// } from './constants';

// import { Key, Point2D, Scene } from './types';

// import {
//   createCanvasElement,
//   renderScene,
//   renderGameOver,
// } from './canvas';

// import {
//   isGameOver,
//   nextDirection,
//   move,
//   eat,
//   generateApples,
//   generateSnake,
// } from './utils';

// const INITIAL_DIRECTION = DIRECTIONS[Key.RIGHT];

interface SnakeProps {
  name: 'string'
}

export default class Snake extends React.PureComponent <SnakeProps> {
  ref_snake: HTMLElement | null;
  game$: Rx.Subscription | null;
  constructor() {
    super();
    this.ref_snake = null;
    this.game$ = null;
  }
  componentDidMount() {
    this.game$ = renderGame(this.ref_snake as HTMLElement)
  }
  componentWillUnmount() {
    (this.game$ as Rx.Subscription).unsubscribe();
  }
  /* 
  componentDidMount() {
    renderGame(this.ref_snake as HTMLElement)
    let canvas = createCanvasElement();
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ref_snake && this.ref_snake.appendChild(canvas);

    let ticks$: Observable<number> = Observable.interval(SPEED);
    let click$: Observable<MouseEvent> = Observable.fromEvent(document, 'click');
    let keydown$: Observable<KeyboardEvent> = Rx.Observable.fromEvent(document, 'keydown');
    
    function createGame(fps$: Observable<number>): Observable<Scene> {
      let direction$ = keydown$.pipe(
        map((event: KeyboardEvent) => DIRECTIONS[event.keyCode]),
        filter(direction => !!direction),
        startWith(INITIAL_DIRECTION),
        scan(nextDirection),
        distinctUntilChanged()
      );
      let length$ = new Rx.BehaviorSubject<number>(SNAKE_LENGTH);
      let snakeLength$ = length$.pipe(
        scan((step, snakeLength) => snakeLength + step),
        share()
      );
      let score$ = snakeLength$.pipe(
        startWith(0),
        scan((score, _) => score + POINTS_PRE_APPLE)
      );
      let snake$: Observable<Point2D[]> = ticks$.pipe(
        withLatestFrom(direction$, snakeLength$, (_, direction, snakeLength): [Point2D, number] => [direction, snakeLength]),
        scan(move, generateSnake()),
        share()
      )
      let apples$ = snake$.pipe(
        scan(eat, generateApples()),
        distinctUntilChanged(),
        share()
      );
      let appleEaten$ = apples$.pipe(
        skip(1),
      ).subscribe();
      let scene$: Observable<Scene> = Rx.Observable.combineLatest(snake$, apples$, score$, (snake, apples, score) => ({ snake, apples, score }));
      return fps$.pipe(withLatestFrom(scene$, (_, scene) => scene));  
    }
    let game$ = Observable.of('Start Game').pipe(
      map(() => Observable.interval(1000 / FPS, animationFrame)),
      switchMap(createGame),
      takeWhile(scene => !isGameOver(scene))
    );
    const startGame = () => game$.subscribe({
      next: scene => renderScene(ctx, scene),
      complete:　() => {
        renderGameOver(ctx);

        click$.pipe(first()).subscribe(startGame);
      }
    })
    startGame();
  }
 */
  render() {
    return <div ref={el => this.ref_snake = el} className="ts-snake"></div>
  }
}