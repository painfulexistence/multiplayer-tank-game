import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "../resources";
import { WALL_HEIGHT, WALL_WIDTH } from "../../../common/settings";

export class Wall extends Actor {
	constructor(x: number, y: number) {
		super({
			pos: new Vector(x, y),
			width: WALL_WIDTH,
			height: WALL_HEIGHT,
			collisionType: CollisionType.Fixed,
			z: 0
		});

		this.graphics.use(Resources.wall.toSprite());
	}
}
