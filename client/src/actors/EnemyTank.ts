import { Engine, Random } from "excalibur";
import { Resources } from "../resources";
import { Direction } from "../../../common/types";
import { Tank } from "./Tank";
import { ENEMY_MOVE_TIMER_MAX, ENEMY_SPEED } from "../../../common/settings";

export class EnemyTank extends Tank {
	private speed: number = ENEMY_SPEED;
	public direction: Direction = Direction.Up;
	public moveTimer: number = 0;
	private rng: Random = new Random();

	constructor(x: number, y: number) {
		super(Resources.tankRed, x, y, 270);
	}

	public update(engine: Engine, dt: number): void {
		super.update(engine, dt);

		if (this.moveTimer > 0) {
			const originalPos = this.pos.clone();

			if (this.direction === Direction.Right) {
				this.pos.x += this.speed * dt;
			} else if (this.direction === Direction.Up) {
				this.pos.y -= this.speed * dt;
			} else if (this.direction === Direction.Left) {
				this.pos.x -= this.speed * dt;
			} else if (this.direction === Direction.Down) {
				this.pos.y += this.speed * dt;
			}

			if (
				this.pos.x - this.width / 2 < 0 ||
				this.pos.x + this.width / 2 > engine.drawWidth ||
				this.pos.y - this.width / 2 < 0 ||
				this.pos.y + this.width / 2 > engine.drawHeight
			) {
				this.pos = originalPos;
				this.moveTimer = 0;
			}
			this.moveTimer -= dt;
		} else {
			const choice = this.rng.integer(0, 2);

			if (choice === 0) {
				this.moveTimer = ENEMY_MOVE_TIMER_MAX;
			} else if (choice === 1) {
				this.direction = this.rng.integer(0, 3);
			} else {
				this.emit("enemyFire", this);
			}

			switch (this.direction) {
				case Direction.Right:
					this.rotation = 0;
					break;
				case Direction.Down:
					this.rotation = Math.PI / 2;
					break;
				case Direction.Left:
					this.rotation = Math.PI;
					break;
				case Direction.Up:
					this.rotation = (Math.PI * 3) / 2;
					break;
			}
		}
	}
}
