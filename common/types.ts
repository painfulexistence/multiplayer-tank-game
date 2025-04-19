export enum Difficulty {
	Easy = 0,
	Medium = 1,
	Hard = 2,
}

export interface GameActivationData {
	difficulty: Difficulty;
}

export enum Direction {
	Up = 0,
	Down = 1,
	Left = 2,
	Right = 3,
}

export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}