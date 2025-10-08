import RaceScene from "./scenes/RaceScene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#222",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [RaceScene]
};
async function loadConfig() {
  const response = await fetch('config/config.json');
  if (!response.ok) throw new Error('Failed to load config');
  return await response.json();
}

loadConfig().then(config => {
  const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [ new RaceScene(config) ]
  };

  new Phaser.Game(gameConfig);
}).catch(err => {
  console.error('Error loading config:', err);
});

new Phaser.Game(config);
