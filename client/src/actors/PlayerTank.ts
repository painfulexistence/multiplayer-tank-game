import { Engine, Keys } from "excalibur";
import { Resources } from "../resources";
import { Direction } from "../../../common/types";
import { Tank } from "./Tank";
import { BULLET_COOLDOWN_MAX, PLAYER_SPEED } from "../../../common/settings";

export class PlayerTank extends Tank {
	private speed: number = PLAYER_SPEED;
	public direction: Direction = Direction.Up;
	private bulletCooldown: number = 0;

	constructor(x: number, y: number) {
		super(Resources.tankGreen, x, y, 270);
	}

	public update(engine: Engine, dt: number): void {
		super.update(engine, dt);

		const originalPos = this.pos.clone();

		if (
			engine.input.keyboard.isHeld(Keys.Left) ||
			engine.input.keyboard.isHeld(Keys.A)
		) {
			this.pos.x -= this.speed * dt;
			this.direction = Direction.Left;
		} else if (
			engine.input.keyboard.isHeld(Keys.Right) ||
			engine.input.keyboard.isHeld(Keys.D)
		) {
			this.pos.x += this.speed * dt;
			this.direction = Direction.Right;
		} else if (
			engine.input.keyboard.isHeld(Keys.Up) ||
			engine.input.keyboard.isHeld(Keys.W)
		) {
			this.pos.y -= this.speed * dt;
			this.direction = Direction.Up;
		} else if (
			engine.input.keyboard.isHeld(Keys.Down) ||
			engine.input.keyboard.isHeld(Keys.S)
		) {
			this.pos.y += this.speed * dt;
			this.direction = Direction.Down;
		}

		if (
			this.pos.x - this.width / 2 < 0 ||
			this.pos.x + this.width / 2 > engine.drawWidth ||
			this.pos.y - this.width / 2 < 0 ||
			this.pos.y + this.width / 2 > engine.drawHeight
		) {
			this.pos = originalPos;
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

		if (this.bulletCooldown > 0) {
			this.bulletCooldown -= dt;
		} else if (engine.input.keyboard.isHeld(Keys.Space)) {
			this.emit("fire", this);
			this.bulletCooldown = BULLET_COOLDOWN_MAX;
		}
	}
}
