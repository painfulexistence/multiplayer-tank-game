import {
	Actor,
	Collider,
	CollisionContact,
	Engine,
	Side,
	vec,
} from "excalibur";
import { Resources } from "../resources";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer

export class Player extends Actor {
	constructor() {
		super({
			// Giving your actor a name is optional, but helps in debugging using the dev tools or debug mode
			// https://github.com/excaliburjs/excalibur-extension/
			// Chrome: https://chromewebstore.google.com/detail/excalibur-dev-tools/dinddaeielhddflijbbcmpefamfffekc
			// Firefox: https://addons.mozilla.org/en-US/firefox/addon/excalibur-dev-tools/
			name: "Player",
			pos: vec(150, 150),
			width: 100,
			height: 100,
			// anchor: vec(0, 0), // Actors default center colliders and graphics with anchor (0.5, 0.5)
			// collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
		});
	}

	override onInitialize() {
		// Generally recommended to stick logic in the "On initialize"
		// This runs before the first update
		// Useful when
		// 1. You need things to be loaded like Images for graphics
		// 2. You need excalibur to be initialized & started
		// 3. Deferring logic to run time instead of constructor time
		// 4. Lazy instantiation
		this.graphics.add(Resources.Sword.toSprite());

		// Actions are useful for scripting common behavior, for example patrolling enemies
		this.actions.delay(2000);
		this.actions.repeatForever((ctx) => {
			ctx.moveBy({ offset: vec(100, 0), duration: 1000 });
			ctx.moveBy({ offset: vec(0, 100), duration: 1000 });
			ctx.moveBy({ offset: vec(-100, 0), duration: 1000 });
			ctx.moveBy({ offset: vec(0, -100), duration: 1000 });
		});

		// Sometimes you want to click on an actor!
		this.on("pointerdown", (evt) => {
			// Pointer events tunnel in z order from the screen down, you can cancel them!
			// if (true) {
			//   evt.cancel();
			// }
			console.log("You clicked the actor @", evt.worldPos.toString());
		});
	}
}
