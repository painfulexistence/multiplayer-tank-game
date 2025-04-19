import { MapSchema, Schema, type } from "@colyseus/schema";
import { Direction } from "../../../../common/types";

export class Player extends Schema {
	@type("number") x: number;
	@type("number") y: number;
  	@type("number") direction: Direction;
  	@type("number") bulletCooldown: number;
}

export class Enemy extends Schema {
	@type("number") x: number;
	@type("number") y: number;
  	@type("number") direction: Direction;
  	@type("number") moveTimer: number;
}

export class Bullet extends Schema {
	@type("number") x: number;
	@type("number") y: number;
	@type("number") direction: Direction;
	@type("string") ownerId: string;
}

export class Wall extends Schema {
	@type("number") x: number;
	@type("number") y: number;
}

export class MyRoomState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
  	@type({ map: Enemy }) enemies = new MapSchema<Enemy>();
	@type({ map: Bullet }) bullets = new MapSchema<Bullet>();
	@type({ map: Wall }) walls = new MapSchema<Wall>();
  	@type("boolean") gameOver: boolean = false;
  	@type("string") winner: string = "";
}
