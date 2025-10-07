import Phaser from "phaser";
import config from "./config";

let game;

export const initGame = () => {
  if (!game) {
    game = new Phaser.Game(config);
  }
  return game;
};
