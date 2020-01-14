
import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import {
  map,
  filter,
  scan,
  startWith,
  distinctUntilChanged,
  share,
  withLatestFrom,
  tap,
  skip,
  switchMap,
  takeWhile,
  first,
} from 'rxjs/operators';

import {
  DIRECTIONS,
  SPEED,
  SNAKE_LENGTH,
  FPS,
  APPLE_COUNT,
  POINTS_PRE_APPLE,
} from './constants';

import { Key, Point2D, Scene } from './types';

import {
  createCanvasElement,
  renderScene,
  renderGameOver,
} from './canvas';

import {
  isGameOver,
  nextDirection,
  move,
  eat,
  generateApples,
  generateSnake,
} from './utils';

const INITIAL_DIRECTION = DIRECTIONS[Key.RIGHT];

let canvas = createCanvasElement();
let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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
  map(function () { return Observable.interval(1000 / FPS, animationFrame) }),
  switchMap(createGame),
  takeWhile(function (scene) { return !isGameOver(scene) })
);
function startGame (): Rx.Subscription {
  return game$.subscribe({
    next: scene => renderScene(ctx, scene),
    complete:　() => {
      renderGameOver(ctx);

      click$.pipe(first()).subscribe(startGame);
    }
  })
}

export default function renderGame (ref_snake: HTMLElement) {
  ref_snake.appendChild(canvas);
  return startGame();
}