import { Client, Room, getStateCallbacks } from "colyseus.js";
import {
	Actor,
	DefaultLoader,
	Engine,
	ExcaliburGraphicsContext,
	Scene,
	SceneActivationContext,
	Vector,
	Keys
} from "excalibur";
import { MyRoomState } from "../../../server/src/rooms/schema/MyRoomState";
import { Resources } from "../resources";
import type { GameActivationData } from "../../../common/types";
import { Direction } from "../../../common/types";
import {
    TANK_WIDTH,
    TANK_HEIGHT,
    BULLET_WIDTH,
    BULLET_HEIGHT,
    WALL_WIDTH,
    WALL_HEIGHT,
} from "../../../common/settings";


export class GameOnline extends Scene<GameActivationData> {
	private room!: Room<MyRoomState>;
	private players = new Map<string, Actor>();
	private enemies = new Map<string, Actor>();
	private walls = new Map<string, Actor>();
	private bullets = new Map<string, Actor>();

	override onInitialize(engine: Engine): void {
		const background = new Actor({
			pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2),
			width: engine.drawWidth,
			height: engine.drawHeight,
		});
		background.graphics.use(Resources.grass.toSprite());
		this.add(background);
	}

	override onPreLoad(loader: DefaultLoader): void {
		// Add any scene specific resources to load
	}

	override async onActivate(
		context: SceneActivationContext<GameActivationData>,
	): Promise<void> {
		if (!context.data) {
			throw new Error("Scene activation data is required");
		}

		const client = new Client("ws://localhost:2567");
		try {
			const room = await client.joinOrCreate<MyRoomState>("my_room");
			this.room = room;
			const $ = getStateCallbacks(room);

			// Handle players
			$(room.state).players.onAdd((player, sessionId) => {
				const playerActor = new Actor({
					pos: new Vector(player.x, player.y),
					width: TANK_WIDTH,
					height: TANK_HEIGHT,
					z: 2
				});
				playerActor.graphics.use(
					sessionId === room.sessionId 
						? Resources.tankGreen.toSprite()
						: Resources.tankRed.toSprite()
				);
				context.engine.add(playerActor);
				this.players.set(sessionId, playerActor);

				$(player).onChange(() => {
					playerActor.pos.x = player.x;
					playerActor.pos.y = player.y;
                    switch (player.direction) {
                    case Direction.Right:
                        playerActor.rotation = 0;
                        break;
                    case Direction.Down:
                        playerActor.rotation = Math.PI / 2;
                        break;
                    case Direction.Left:
                        playerActor.rotation = Math.PI;
                        break;
                    case Direction.Up:
                        playerActor.rotation = Math.PI * 3 / 2;
                        break;
                    }
				});
			});

			$(room.state).players.onRemove((player, sessionId) => {
				const playerActor = this.players.get(sessionId);
				if (playerActor) {
					playerActor.kill();
					this.players.delete(sessionId);
				}
			});

			// Handle enemies
			$(room.state).enemies.onAdd((enemy, id) => {
				const enemyActor = new Actor({
					pos: new Vector(enemy.x, enemy.y),
					width: TANK_WIDTH,
					height: TANK_HEIGHT,
					z: 2
				});
				enemyActor.graphics.use(Resources.tankDark.toSprite());
				context.engine.add(enemyActor);
				this.enemies.set(id, enemyActor);

				$(enemy).onChange(() => {
					enemyActor.pos.x = enemy.x;
					enemyActor.pos.y = enemy.y;
                    switch (enemy.direction) {
                    case Direction.Right:
                        enemyActor.rotation = 0;
                        break;
                    case Direction.Down:
                        enemyActor.rotation = Math.PI / 2;
                        break;
                    case Direction.Left:
                        enemyActor.rotation = Math.PI;
                        break;
                    case Direction.Up:
                        enemyActor.rotation = Math.PI * 3 / 2;
                        break;
                    }
                });
			});

			$(room.state).enemies.onRemove((enemy, id) => {
				const enemyActor = this.enemies.get(id);
				if (enemyActor) {
					enemyActor.kill();
					this.enemies.delete(id);
				}
			});

			// Handle walls
			$(room.state).walls.onAdd((wall, id) => {
				const wallActor = new Actor({
					pos: new Vector(wall.x, wall.y),
					width: WALL_WIDTH,
					height: WALL_HEIGHT,
					z: 0
				});
				wallActor.graphics.use(Resources.wall.toSprite());
				context.engine.add(wallActor);
				this.walls.set(id, wallActor);
			});

			$(room.state).walls.onRemove((wall, id) => {
				const wallActor = this.walls.get(id);
				if (wallActor) {
					wallActor.kill();
					this.walls.delete(id);
				}
			});

			// Handle bullets
			$(room.state).bullets.onAdd((bullet, id) => {
				const bulletActor = new Actor({
					pos: new Vector(bullet.x, bullet.y),
					width: BULLET_WIDTH,
					height: BULLET_HEIGHT,
					z: 1
				});
				bulletActor.graphics.use(
					bullet.ownerId === room.sessionId 
						? Resources.bulletBlue.toSprite()
						: Resources.bulletRed.toSprite()
				);
				context.engine.add(bulletActor);
				this.bullets.set(id, bulletActor);

				$(bullet).onChange(() => {
					bulletActor.pos.x = bullet.x;
					bulletActor.pos.y = bullet.y;
                    switch (bullet.direction) {
                        case Direction.Right:
                            bulletActor.rotation = 0;
                            break;
                        case Direction.Down:
                            bulletActor.rotation = Math.PI / 2;
                            break;
                        case Direction.Left:
                            bulletActor.rotation = Math.PI;
                            break;
                        case Direction.Up:
                            bulletActor.rotation = Math.PI * 3 / 2;
                            break;
                        }
				});
			});

			$(room.state).bullets.onRemove((bullet, id) => {
				const bulletActor = this.bullets.get(id);
				if (bulletActor) {
					bulletActor.kill();
					this.bullets.delete(id);
				}
			});

			// Handle game over
			$(room.state).onChange(() => {
				if (room.state.gameOver) {
					context.engine.goToScene("gameOver");
				}
			});
		} catch (error) {
			console.error(error);
		}
	}

	public update(engine: Engine, dt: number): void {
		super.update(engine, dt);

		if (!this.room) {
			return;
		}

		// Handle input
        // TODO: handle multiple keys pressed
		let direction: Direction | undefined;
		if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.Up)) {
			direction = Direction.Up;
		} else if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.Right)) {
			direction = Direction.Right;
		} else if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.Down)) {
			direction = Direction.Down;
		} else if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.Left)) {
			direction = Direction.Left;
		}
		if (direction !== undefined) {
			this.room.send("move", { direction });
		}

		if (engine.input.keyboard.isHeld(Keys.Space)) {
			this.room.send("fire");
		}
	}

	override onDeactivate(): void {
		for (const actor of this.players.values()) actor.kill();
		for (const actor of this.enemies.values()) actor.kill();
		for (const actor of this.walls.values()) actor.kill();
		for (const actor of this.bullets.values()) actor.kill();

		this.players.clear();
		this.enemies.clear();
		this.walls.clear();
		this.bullets.clear();

		this.room?.leave();
	}

	override onPreUpdate(engine: Engine, elapsedMs: number): void {
		// Called before anything updates in the scene
	}

	override onPostUpdate(engine: Engine, elapsedMs: number): void {
		// Called after everything updates in the scene
	}

	override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
		// Called before Excalibur draws to the screen
	}

	override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
		// Called after Excalibur draws to the screen
	}
}
