import { ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
	Sword: new ImageSource("./images/sword.png"),
	tankBlue: new ImageSource("/images/tank_blue.png"),
	tankGreen: new ImageSource("/images/tank_green.png"),
	tankRed: new ImageSource("/images/tank_red.png"),
	tankDark: new ImageSource("/images/tank_dark.png"),
	bulletBlue: new ImageSource("/images/bulletblue2.png"),
	bulletGreen: new ImageSource("/images/bulletgreen2.png"),
	bulletRed: new ImageSource("/images/bulletred2.png"),
	wall: new ImageSource("/images/wall.png"),
	grass: new ImageSource("/images/grass.png"),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources.
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
	loader.addResource(res);
}
