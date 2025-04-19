import {
	Actor,
	Color,
	Engine,
	Font,
	FontUnit,
	GoToOptions,
	Label,
	Scene,
	TextAlign,
	Vector,
} from "excalibur";
import type { GameActivationData } from "../../../common/types";

export class MainMenu extends Scene {
	private title!: Label;
	private singlePlayerButton!: Actor;
	private multiPlayerButton!: Actor;

	override async onInitialize(engine: Engine): Promise<void> {
		this.backgroundColor = Color.fromHex("#333333");

		this.title = new Label({
			text: "TANK CITY",
			pos: new Vector(engine.halfDrawWidth, 150),
			font: new Font({
				family: "Impact",
				size: 72,
				unit: FontUnit.Px,
				textAlign: TextAlign.Center,
			}),
			color: Color.White,
		});
		this.add(this.title);

		this.singlePlayerButton = new Actor({
			x: engine.halfDrawWidth,
			y: 350,
			width: 300,
			height: 60,
			color: Color.Green,
		});

		const singlePlayerLabel = new Label({
			text: "Single Player",
			font: new Font({
				family: "Arial",
				size: 24,
				unit: FontUnit.Px,
				textAlign: TextAlign.Center,
			}),
			color: Color.White,
		});
		this.singlePlayerButton.addChild(singlePlayerLabel);

		this.singlePlayerButton.on("pointerdown", () => {
			engine.goToScene("play", {
				sceneActivationData: {} as GoToOptions<GameActivationData>,
			});
		});

		this.singlePlayerButton.on("pointerenter", () => {
			this.singlePlayerButton.color = Color.fromHex("#00AA00");
		});

		this.singlePlayerButton.on("pointerleave", () => {
			this.singlePlayerButton.color = Color.Green;
		});

		this.add(this.singlePlayerButton);

		this.multiPlayerButton = new Actor({
			x: engine.halfDrawWidth,
			y: 450,
			width: 300,
			height: 60,
			color: Color.Blue,
		});

		const multiPlayerLabel = new Label({
			text: "Multiplayer",
			font: new Font({
				family: "Arial",
				size: 24,
				unit: FontUnit.Px,
				textAlign: TextAlign.Center,
			}),
			color: Color.White,
		});
		this.multiPlayerButton.addChild(multiPlayerLabel);

		this.multiPlayerButton.on("pointerdown", () => {
			engine.goToScene("playOnline", {
				sceneActivationData: {} as GoToOptions<GameActivationData>,
			});
		});

		this.multiPlayerButton.on("pointerenter", () => {
			this.multiPlayerButton.color = Color.fromHex("#0000AA");
		});

		this.multiPlayerButton.on("pointerleave", () => {
			this.multiPlayerButton.color = Color.Blue;
		});

		this.add(this.multiPlayerButton);
	}
}
