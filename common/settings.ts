export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 600;

export const TANK_WIDTH = 46;
export const TANK_HEIGHT = 42;
export const BULLET_WIDTH = 20;
export const BULLET_HEIGHT = 20;
export const WALL_WIDTH = 50;
export const WALL_HEIGHT = 50;

export const PLAYER_SPEED = 0.1;
export const ENEMY_SPEED = 0.05;
export const BULLET_SPEED = 0.4;

export const BULLET_COOLDOWN_MAX = 500;
export const ENEMY_MOVE_TIMER_MAX = 500;

export const PLAYER_SPAWN_POINTS = [
    { x: 400, y: MAP_HEIGHT - TANK_WIDTH / 2 },
    { x: 600, y: MAP_HEIGHT - TANK_WIDTH / 2 },
    { x: 200, y: MAP_HEIGHT - TANK_WIDTH / 2 },
    { x: 800, y: MAP_HEIGHT - TANK_WIDTH / 2 },
];