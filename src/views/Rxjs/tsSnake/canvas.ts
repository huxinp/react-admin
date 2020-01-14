import { Scene, Point2D } from './types';

export const COLS = 30;
export const ROWS = 30;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;

export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

export function createCanvasElement (): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}

export function renderScene (ctx: CanvasRenderingContext2D, scene: Scene): void {
  renderBackground(ctx);
  renderScore(ctx, scene.score);
  renderApples(ctx, scene.apples);
  renderSnake(ctx, scene.snake);
}

export function renderScore(ctx: CanvasRenderingContext2D, score: number): void {
  let textX = CANVAS_WIDTH / 2;
  let textY = CANVAS_HEIGHT / 2;
  drawText(ctx, score.toString(), textX, textY, 'rgba(0,0,0,0.1)', 150);
}

export function renderApples(ctx: CanvasRenderingContext2D, apples: Point2D[]): void {
  apples.forEach(apple => paintCell(ctx, apple, 'red'));
}

export function renderSnake(ctx: CanvasRenderingContext2D, snake: Point2D[]): void {
  snake.forEach((segment, index) => paintCell(ctx, wrapBounds(segment), getSegmentColor(index)))
}

export function renderGameOver(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let textX = CANVAS_WIDTH / 2;
  let textY = CANVAS_HEIGHT / 2;

  drawText(ctx, 'GAME OVER!', textX, textY, 'black', 25);
}

export function getRandomPosition(snake: Point2D[] = []): Point2D {
  let position = {
    x: getRandomNumber(0, COLS - 1),
    y: getRandomNumber(0, ROWS - 1)
  }
  if (isEmptyCell(position, snake)) {
    return position;
  }
  return getRandomPosition(snake);
}

export function checkCollision(a: Point2D, b: Point2D): boolean {
  return a.x === b.x && a.y === b.y;
}

function isEmptyCell(position: Point2D, snake: Point2D[]): boolean {
  return !snake.some(segment => checkCollision(segment, position));
}

function getRandomNumber(min: number, max: number): number {
  return (Math.random() * (max - min + 1) + min) >> 0;
}

function renderBackground(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#EEE';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function  drawText(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  fillStyle: string, fontSize: number,
  horizontalAlign: CanvasTextAlign = 'center',
  verticalAlign: CanvasTextBaseline = 'middle'
): void {
  ctx.fillStyle = fillStyle;
  ctx.font = `bold ${fontSize}px sans-serif`;

  let textY = y;
  let textX = x;

  ctx.textAlign = horizontalAlign;
  ctx.textBaseline = verticalAlign;

  ctx.fillText(text, textX, textY);
}

function getSegmentColor(index: number): string {
  return index === 0 ? 'black' :　'#2196f3';
}

function wrapBounds(point: Point2D): Point2D {
  point.x = point.x >= COLS ? 0: point.x < 0 ? COLS - 1 : point.x;
  point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1: point.y;

  return point;
}

function paintCell(ctx: CanvasRenderingContext2D, point: Point2D, color: string): void {
  const x = point.x * CELL_SIZE + (point.x * GAP_SIZE);
  const y = point.y * CELL_SIZE + (point.y + GAP_SIZE);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}
