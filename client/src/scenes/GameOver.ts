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

export class GameOver extends Scene {
	private gameOverText!: Label;

	override async onInitialize(engine: Engine): Promise<void> {
		const background = new Actor({
			pos: new Vector(engine.drawWidth / 2, engine.drawHeight / 2),
			width: engine.drawWidth,
			height: engine.drawHeight,
			color: Color.fromHex("#333333"),
		});
		this.add(background);

		background.on("pointerdown", () => {
			engine.goToScene("start");
		});
		// this.backgroundColor = Color.fromHex("#333333");

		this.gameOverText = new Label({
			text: "You Lose!",
			pos: new Vector(engine.halfDrawWidth, 150),
			font: new Font({
				family: "Impact",
				size: 72,
				unit: FontUnit.Px,
				textAlign: TextAlign.Center,
			}),
			color: Color.White,
		});
		this.add(this.gameOverText);

		this.on("pointerdown", () => {
			engine.goToScene("start");
		});
		this.on("pointerenter", () => {
			this.gameOverText.color = Color.fromHex("#0000AA");
		});
		this.on("pointerleave", () => {
			this.gameOverText.color = Color.White;
		});
	}
}
