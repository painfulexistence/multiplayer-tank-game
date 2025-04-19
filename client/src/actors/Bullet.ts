import { Actor, CollisionType, Engine, ImageSource, Vector } from "excalibur";
import { Direction } from "../../../common/types";
import { BULLET_HEIGHT, BULLET_WIDTH, BULLET_SPEED } from "../../../common/settings";

export class Bullet extends Actor {
	private speed: number = BULLET_SPEED;
	private direction: Direction = Direction.Right;

	constructor(img: ImageSource, x: number, y: number, direction: Direction) {
		super({
			pos: new Vector(x, y),
			width: BULLET_WIDTH,
			height: BULLET_HEIGHT,
			collisionType: CollisionType.Passive,
			z: 1
		});
		this.direction = direction;
		this.graphics.use(img.toSprite());
	}

	public update(engine: Engine, dt: number): void {
		super.update(engine, dt);

		if (this.direction === Direction.Right) {
			this.pos.x += this.speed * dt;
			this.rotation = 0;
		} else if (this.direction === Direction.Up) {
			this.pos.y -= this.speed * dt;
			this.rotation = (Math.PI * 3) / 2;
		} else if (this.direction === Direction.Left) {
			this.pos.x -= this.speed * dt;
			this.rotation = Math.PI;
		} else if (this.direction === Direction.Down) {
			this.pos.y += this.speed * dt;
			this.rotation = Math.PI / 2;
		}

		if (
			this.pos.x < 0 ||
			this.pos.x > engine.drawWidth ||
			this.pos.y < 0 ||
			this.pos.y > engine.drawHeight
		) {
			this.kill();
		}
	}
}
