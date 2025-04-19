import { type Client, Room } from "@colyseus/core";
import {
	BULLET_COOLDOWN_MAX,
	BULLET_HEIGHT,
	BULLET_SPEED,
	BULLET_WIDTH,
	ENEMY_MOVE_TIMER_MAX,
	ENEMY_SPEED,
	FRAME_TIME,
	MAP_HEIGHT,
	MAP_WIDTH,
	PLAYER_SPAWN_POINTS,
	PLAYER_SPEED,
	TANK_HEIGHT,
	TANK_WIDTH,
	WALL_HEIGHT,
	WALL_WIDTH,
} from "../../../common/settings";
import { Direction, type Rect } from "../../../common/types";
import { Bullet, Enemy, MyRoomState, Player, Wall } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
	state = new MyRoomState();
	maxClients = 4;

	onCreate(options: any) {
		// Create walls
		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 10; y++) {
				if (Math.random() < 0.5) {
					const wall = new Wall();
					wall.x = x * WALL_WIDTH + 25;
					wall.y = y * WALL_HEIGHT + 25 + 50;
					this.state.walls.set(`wall_${x}_${y}`, wall);
				}
			}
		}

		// Create enemies
		for (let i = 0; i < 3; i++) {
			const enemy = new Enemy();
			enemy.x = i * 200 + 100;
			enemy.y = 25;
			enemy.direction = Direction.Down;
			enemy.moveTimer = 0;

			this.state.enemies.set(`enemy_${i}`, enemy);
		}

		// Handle player movement
		this.onMessage("move", (client, message: { direction: Direction }) => {
			const currPlayer = this.state.players.get(client.sessionId);
			if (!currPlayer) return;

			currPlayer.direction = message.direction;

			let newX = currPlayer.x;
			let newY = currPlayer.y;
			switch (message.direction) {
				case Direction.Up:
					newY -= PLAYER_SPEED * FRAME_TIME;
					break;
				case Direction.Right:
					newX += PLAYER_SPEED * FRAME_TIME;
					break;
				case Direction.Down:
					newY += PLAYER_SPEED * FRAME_TIME;
					break;
				case Direction.Left:
					newX -= PLAYER_SPEED * FRAME_TIME;
					break;
			}

			// Check wall collisions
			let canMove = true;
			const playerRect = this.getRect(
				{ x: newX, y: newY, direction: currPlayer.direction },
				TANK_WIDTH,
				TANK_WIDTH,
			); // FIXME: handle tank rotation
			this.state.walls.forEach((wall) => {
				const wallRect = this.getRect(
					{ x: wall.x, y: wall.y, direction: Direction.Up },
					WALL_WIDTH,
					WALL_HEIGHT,
				);
				if (this.checkCollision(playerRect, wallRect)) {
					canMove = false;
				}
			});
			if (canMove) {
				currPlayer.x = newX;
				currPlayer.y = newY;
			}
			currPlayer.x = Math.max(
				TANK_WIDTH / 2,
				Math.min(MAP_WIDTH - TANK_WIDTH / 2, currPlayer.x),
			); // FIXME: handle tank rotation
			currPlayer.y = Math.max(
				TANK_HEIGHT / 2,
				Math.min(MAP_HEIGHT - TANK_WIDTH / 2, currPlayer.y),
			); // FIXME: handle tank rotation
		});

		// Handle firing
		this.onMessage("fire", (client) => {
			const player = this.state.players.get(client.sessionId);
			if (!player || player.bulletCooldown > 0) return;

			const bullet = new Bullet();
			bullet.x = player.x;
			bullet.y = player.y;
			bullet.direction = player.direction;
			bullet.ownerId = client.sessionId;

			const bulletId = `bullet_${Math.random()}_${Date.now()}`;
			this.state.bullets.set(bulletId, bullet);

			player.bulletCooldown = BULLET_COOLDOWN_MAX;
		});

		// Game loop
		this.setSimulationInterval((dt: number) => this.update(dt), FRAME_TIME);
	}

	private getRect(
		entity: { x: number; y: number; direction: Direction },
		width: number,
		height: number,
	): Rect {
		if (
			entity.direction === Direction.Left ||
			entity.direction === Direction.Right
		) {
			return {
				x: entity.x - width / 2,
				y: entity.y - height / 2,
				w: width,
				h: height,
			};
		} else {
			return {
				x: entity.x - height / 2,
				y: entity.y - width / 2,
				w: height,
				h: width,
			};
		}
	}

	// AABB collision detection
	private checkCollision(rect1: Rect, rect2: Rect): boolean {
		return (
			rect1.x <= rect2.x + rect2.w &&
			rect1.x + rect1.w >= rect2.x &&
			rect1.y <= rect2.y + rect2.h &&
			rect1.y + rect1.h >= rect2.y
		);
	}

	private update(dt: number) {
		// Update enemies
		this.state.enemies.forEach((enemy, id) => {
			enemy.moveTimer -= dt;
			if (enemy.moveTimer <= 0) {
				enemy.direction = Math.floor(Math.random() * 4) as Direction;
				enemy.moveTimer = ENEMY_MOVE_TIMER_MAX;
			}

			// Handle enemy movement
			const prevX = enemy.x;
			const prevY = enemy.y;

			switch (enemy.direction) {
				case Direction.Up:
					enemy.y -= ENEMY_SPEED * dt;
					break;
				case Direction.Right:
					enemy.x += ENEMY_SPEED * dt;
					break;
				case Direction.Down:
					enemy.y += ENEMY_SPEED * dt;
					break;
				case Direction.Left:
					enemy.x -= ENEMY_SPEED * dt;
					break;
			}

			const enemyRect = this.getRect(enemy, TANK_WIDTH, TANK_HEIGHT);
			let hasCollision = false;
			this.state.walls.forEach((wall) => {
				const wallRect = this.getRect(
					{ x: wall.x, y: wall.y, direction: Direction.Up },
					WALL_WIDTH,
					WALL_HEIGHT,
				);
				if (this.checkCollision(enemyRect, wallRect)) {
					hasCollision = true;
				}
			});
			if (hasCollision) {
				enemy.x = prevX;
				enemy.y = prevY;
				enemy.direction = Math.floor(Math.random() * 4) as Direction;
			}
			enemy.x = Math.max(
				TANK_WIDTH / 2,
				Math.min(MAP_WIDTH - TANK_WIDTH / 2, enemy.x),
			); // FIXME: handle tank rotation
			enemy.y = Math.max(
				TANK_HEIGHT / 2,
				Math.min(MAP_HEIGHT - TANK_HEIGHT / 2, enemy.y),
			); // FIXME: handle tank rotation

			// Random firing
			if (Math.random() < 0.01) {
				const bullet = new Bullet();
				bullet.x = enemy.x;
				bullet.y = enemy.y;
				bullet.direction = enemy.direction;
				bullet.ownerId = id;

				const bulletId = `bullet_${Math.random()}_${Date.now()}`;
				this.state.bullets.set(bulletId, bullet);
			}
		});

		// Update cooldowns
		this.state.players.forEach((player) => {
			if (player.bulletCooldown > 0) {
				player.bulletCooldown -= dt;
			}
		});

		// Update bullets
		this.state.bullets.forEach((bullet, bulletId) => {
			switch (bullet.direction) {
				case Direction.Up:
					bullet.y -= BULLET_SPEED * dt;
					break;
				case Direction.Right:
					bullet.x += BULLET_SPEED * dt;
					break;
				case Direction.Down:
					bullet.y += BULLET_SPEED * dt;
					break;
				case Direction.Left:
					bullet.x -= BULLET_SPEED * dt;
					break;
			}

			const bulletRect = this.getRect(
				bullet,
				BULLET_WIDTH,
				BULLET_HEIGHT,
			);

			this.state.walls.forEach((wall, wallId) => {
				const wallRect = this.getRect(
					{ x: wall.x, y: wall.y, direction: Direction.Up },
					WALL_WIDTH,
					WALL_HEIGHT,
				);
				if (this.checkCollision(bulletRect, wallRect)) {
					this.state.walls.delete(wallId);
					this.state.bullets.delete(bulletId);
				}
			});

			this.state.players.forEach((player, playerId) => {
				const playerRect = this.getRect(
					player,
					TANK_WIDTH,
					TANK_HEIGHT,
				);
				if (
					bullet.ownerId !== playerId &&
					this.checkCollision(bulletRect, playerRect)
				) {
					if (bullet.ownerId.startsWith("enemy")) {
						this.state.gameOver = true;
						this.state.winner = "enemy";
					} else {
						this.state.gameOver = true;
						this.state.winner = bullet.ownerId;
					}
				}
			});

			this.state.enemies.forEach((enemy, enemyId) => {
				const enemyRect = this.getRect(enemy, TANK_WIDTH, TANK_HEIGHT);
				if (
					!bullet.ownerId.startsWith("enemy") &&
					this.checkCollision(bulletRect, enemyRect)
				) {
					this.state.enemies.delete(enemyId);
					this.state.bullets.delete(bulletId);
				}
			});

			if (
				bullet.x < 0 - BULLET_WIDTH / 2 ||
				bullet.x > MAP_WIDTH + BULLET_WIDTH / 2 ||
				bullet.y < 0 - BULLET_WIDTH / 2 ||
				bullet.y > MAP_HEIGHT + BULLET_WIDTH / 2
			) {
				// FIXME: handle bullet rotation
				this.state.bullets.delete(bulletId);
			}
		});

		// Check if all enemies are defeated
		if (this.state.enemies.size === 0 && this.state.players.size === 1) {
			const alivePlayerId = Array.from(this.state.players.keys())[0];
			this.state.gameOver = true;
			this.state.winner = alivePlayerId;
		}
	}

	onJoin(client: Client) {
		console.log(client.sessionId, "joined!");

		const playerCount = this.state.players.size;
		const position =
			PLAYER_SPAWN_POINTS[playerCount] || PLAYER_SPAWN_POINTS[0];

		const player = new Player();
		player.x = position.x;
		player.y = position.y;
		player.direction = Direction.Up;
		player.bulletCooldown = 0;

		this.state.players.set(client.sessionId, player);
	}

	onLeave(client: Client) {
		console.log(client.sessionId, "left!");

		this.state.players.delete(client.sessionId);
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}
}
