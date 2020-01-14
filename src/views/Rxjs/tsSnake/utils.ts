import { Scene, Point2D } from './types';
import { checkCollision, getRandomPosition } from './canvas';
import { SNAKE_LENGTH, APPLE_COUNT } from './constants';

export function isGameOver(scene: Scene): boolean {
  let snake = scene.snake;
  let head = snake[0];
  let body = snake.slice(1, snake.length);

  return body.some(segment => checkCollision(segment, head));
}

export function nextDirection(previous: Point2D, next: Point2D): Point2D {
  let isOpposite = (previous: Point2D, next: Point2D): boolean => {
    return next.x === previous.x * -1 || next.y === previous.y * -1;
  }

  if (isOpposite(previous, next)) {
    return previous;
  }
  return next;
}

export function move(snake: Point2D[], [direction, snakeLength]: [Point2D, number]): Point2D[] {
  let nx = snake[0].x;
  let ny = snake[0].y;
  nx += 1 * direction.x;
  ny += 1 * direction.y;
  let tail: Point2D;
  if (snakeLength > snake.length) {
    tail = { x: nx, y: ny };
  } else {
    tail = snake.pop() as Point2D;
    tail.x = nx;
    tail.y = ny;
  }
  snake.unshift(tail);
  return snake;
}

export function eat (apples: Point2D[], snake: Point2D[]): Point2D[] {
  let head: Point2D = snake[0];
  for (let i = 0; i < apples.length; i++) {
    if (checkCollision(apples[i], head)) {
      apples.splice(i, 1);
      return [...apples, getRandomPosition(snake)];
    }
  }
  return apples;
}

export function generateSnake(): Point2D[] {
  let snake: Array<Point2D> = [];
  for (let i = SNAKE_LENGTH - 1; i >= 0; i--) {
    snake.push({ x: i, y: 0　});
  }
  return snake;
}

export function generateApples(): Point2D[] {
  let apples = [];
  for (let i = 0; i < APPLE_COUNT; i++) {
    apples.push(getRandomPosition());
  }
  return apples;
}
