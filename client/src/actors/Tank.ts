import {
	Actor,
	CollisionType,
	Color,
	Engine,
	ImageSource,
	Keys,
	Vector,
} from "excalibur";
import { TANK_HEIGHT, TANK_WIDTH } from "../../../common/settings";

export class Tank extends Actor {
	constructor(
		img: ImageSource,
		x: number,
		y: number,
		rotation: number,
		color?: string,
	) {
		super({
			pos: new Vector(x, y),
			width: TANK_WIDTH,
			height: TANK_HEIGHT,
			rotation: (rotation * Math.PI) / 180,
			collisionType: CollisionType.Active,
			color: color ? Color.fromHex(color) : Color.White,
			z: 2
		});
		this.graphics.use(img.toSprite());
	}
}
