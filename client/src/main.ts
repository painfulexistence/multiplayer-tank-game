import { Color, DisplayMode, Engine, FadeInOut, Keys } from "excalibur";
import { loader } from "./resources";
import { Game, GameOnline, GameOver, MainMenu } from "./scenes";
import { MAP_WIDTH, MAP_HEIGHT } from "../../common/settings";

const game = new Engine({
	width: MAP_WIDTH, // Logical width and height in game pixels
	height: MAP_HEIGHT,
	displayMode: DisplayMode.Fixed, // Display mode tells excalibur how to fill the window
	pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
	scenes: {
		start: MainMenu,
		play: Game,
		playOnline: GameOnline,
		gameOver: GameOver,
	},
	// physics: {
	//   solver: SolverStrategy.Realistic,
	//   substep: 5 // Sub step the physics simulation for more robust simulations
	// },
	// fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game.start("start", {
	loader, // Optional loader (but needed for loading images/sounds)
	inTransition: new FadeInOut({
		duration: 1000,
		direction: "in",
		color: Color.ExcaliburBlue,
	}),
});

game.input.keyboard.on("press", (evt) => {
	if (evt.key === Keys.Key1) {
		game.toggleDebug();
	}
});
