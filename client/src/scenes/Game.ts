import {
	Actor,
	DefaultLoader,
	Engine,
	ExcaliburGraphicsContext,
	Random,
	Scene,
	SceneActivationContext,
	Vector,
} from "excalibur";
import { Bullet, EnemyTank, PlayerTank, Wall } from "../actors";
import { Resources } from "../resources";
import type { GameActivationData } from "../../../common/types";
import { PLAYER_SPAWN_POINTS } from "../../../common/settings";

export class Game extends Scene<GameActivationData> {
	private playerTank!: PlayerTank;
	private enemyTanks: EnemyTank[] = [];
	private walls: Wall[] = [];
	private playerBullets: Bullet[] = [];
	private enemyBullets: Bullet[] = [];
	private rng: Random = new Random();

	override onInitialize(engine: Engine): void {
		const background = new Actor({
			pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2),
			width: engine.drawWidth,
			height: engine.drawHeight,
		});
		background.graphics.use(Resources.grass.toSprite());
		this.add(background);
	}

	public update(engine: Engine, dt: number): void {
		super.update(engine, dt);
	}

	override onPreLoad(loader: DefaultLoader): void {
		// Add any scene specific resources to load
	}

	override async onActivate(
		context: SceneActivationContext<GameActivationData>,
	): Promise<void> {
		// Called when Excalibur transitions to this scene
		// Only 1 scene is active at a time
        const spawnPos = PLAYER_SPAWN_POINTS[0];
        
		const tank = new PlayerTank(spawnPos.x, spawnPos.y);
		this.playerTank = tank;
		this.add(tank);

		for (let i = 0; i < 3; i++) {
			const enemyTank = new EnemyTank(i * 200 + 100, 25);
			this.enemyTanks.push(enemyTank);
			this.add(enemyTank);
		}

		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 10; y++) {
				if (this.rng.integer(0, 100) < 50) {
					const wall = new Wall(x * 50 + 25, y * 50 + 25 + 50);
					this.walls.push(wall);
					this.add(wall);
				}
			}
		}

		this.playerTank.on("fire", (evt) => {
			const bullet = new Bullet(
				Resources.bulletBlue,
				this.playerTank.pos.x,
				this.playerTank.pos.y,
				this.playerTank.direction,
			);
			this.playerBullets.push(bullet);
			this.add(bullet);
		});

		for (const enemyTank of this.enemyTanks) {
			enemyTank.on("enemyFire", (evt) => {
				const bullet = new Bullet(
					Resources.bulletRed,
					enemyTank.pos.x,
					enemyTank.pos.y,
					enemyTank.direction,
				);
				this.enemyBullets.push(bullet);
				this.add(bullet);
			});
		}
	}

	override onDeactivate(context: SceneActivationContext): void {
		// Called when Excalibur transitions away from this scene
		// Only 1 scene is active at a time
		this.playerTank?.kill();
		for (const enemyTank of this.enemyTanks) {
			enemyTank.kill();
		}
		for (const wall of this.walls) {
			wall.kill();
		}
		for (const bullet of this.playerBullets) {
			bullet.kill();
		}
		for (const bullet of this.enemyBullets) {
			bullet.kill();
		}
		this.enemyTanks = [];
		this.walls = [];
		this.playerBullets = [];
		this.enemyBullets = [];
	}

	override onPreUpdate(engine: Engine, elapsedMs: number): void {
		// Called before anything updates in the scene
	}

	override onPostUpdate(engine: Engine, dt: number): void {
		// Called after everything updates in the scene

		for (let i = this.playerBullets.length - 1; i >= 0; i--) {
			const bullet = this.playerBullets[i];
			let collided = false;

			for (let j = this.walls.length - 1; j >= 0; j--) {
				if (bullet.collider.collide(this.walls[j].collider).length > 0) {
					this.walls[j].kill();
					this.walls.splice(j, 1);
					collided = true;
					break;
				}
			}

			if (!collided) {
				for (let j = this.enemyTanks.length - 1; j >= 0; j--) {
					if (bullet.collider.collide(this.enemyTanks[j].collider).length > 0) {
						this.enemyTanks[j].kill();
						this.enemyTanks.splice(j, 1);
						collided = true;
						break;
					}
				}
			}

			if (collided) {
				bullet.kill();
				this.playerBullets.splice(i, 1);
			}
		}

		for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
			const bullet = this.enemyBullets[i];
			let collided = false;

			for (let j = this.walls.length - 1; j >= 0; j--) {
				if (bullet.collider.collide(this.walls[j].collider).length > 0) {
					this.walls[j].kill();
					this.walls.splice(j, 1);
					collided = true;
					break;
				}
			}

			if (
				!collided &&
				bullet.collider.collide(this.playerTank.collider).length > 0
			) {
				engine.goToScene("gameOver");
			}

			if (collided) {
				bullet.kill();
				this.enemyBullets.splice(i, 1);
			}
		}

        // if (this.enemyTanks.length === 0) {
		// 	engine.goToScene("win");
		// }
	}

	override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
		// Called before Excalibur draws to the screen
	}

	override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
		// Called after Excalibur draws to the screen
	}
}
