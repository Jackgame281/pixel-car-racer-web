// RaceScene.js
export default class RaceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RaceScene' });
    }

    preload() {
        this.load.json('config', './assets/config/config.json');
        this.load.image('road', './assets/tracks/mountain/background39_0.png');
        this.load.image('mountains', './assets/tracks/mountain/bg_mountain_3_0.png');    // Add this
        this.load.image('clouds', './assets/tracks/mountain/bg_clouds_0.png');         // Add this
        this.load.image('trees', './assets/tracks/mountain/bg_mountain_end_0.png');          // Add this
        this.load.image('car', './assets/cars/bodies/testingscionxb.png');
        this.load.image('wheel_front', 'assets/cars/parts/rims/sp_adv_lip_310.png');
        this.load.image('wheel_rear', './assets/cars/parts/rims/sp_adv_lip_310.png');
        this.load.image('spoiler', './assets/cars/parts/spoiler_01.png');
        this.load.image('f_bumper', './assets/cars/parts/front_bumper_01.png');
        this.load.image('r_bumper', './assets/cars/parts/rear_bumper_01.png');
        this.load.audio('engine', './assets/audio/engine_test1.wav');
        this.load.audio('bgm', './assets/audio/external/abc_123a.mp3');
        this.textures.get('*').setFilter(Phaser.Textures.NEAREST);
    }

    create() {
        this.loadConfig();
        
        // Create background layers (order matters - first is furthest back)
        this.clouds = this.add.tileSprite(400, 300, 1024, 600, 'clouds');
        this.clouds.tileScaleY = 1.2; // Placeholding size, will change later
        this.mountains = this.add.tileSprite(400, 300, 1024, 600, 'mountains');
        this.mountains.tileScaleY = 1.2;
        this.trees = this.add.tileSprite(400, 300, 1024, 600, 'trees');
        this.road = this.add.tileSprite(400, 300, 1024, 600, 'road');

        // Create vehicle container
        this.vehicle = this.add.container(400, 320);

        // Add car body
        this.car = this.add.sprite(0, 0, 'car');
        this.car.setScale(1.0);

        // Add wheels
        this.wheelFront = this.add.sprite(-50, 20, 'wheel_front').setScale(0.6);
        this.wheelRear = this.add.sprite(45, 20, 'wheel_rear').setScale(0.6);

        // Add spoiler
        this.spoiler = this.add.sprite(0, -20, 'spoiler').setScale(0.8);

        // Add all parts to vehicle container
        this.vehicle.add([this.car, this.wheelFront, this.wheelRear, this.spoiler]);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.reloadKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.handbrakeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.engineSound = this.sound.add('engine', { loop: true });
        // this.engineSound.play();
        const musicCfg = this.configData.audio.music;
        this.music = this.sound.add('bgm', { loop: true, volume: musicCfg.volume });
        this.music.play();
        this.speed = 0;
        this.enginePitch = this.configData.audio.engine.minPitch;
        this.engineVol = this.configData.audio.engine.minVolume;
        this.debugText = this.add.text(10, 10, 'Press R to reload config', { fontSize: 16, fill: '#fff' });

        // Add back button
        const backButton = this.add.text(50, 550, 'BACK TO MENU', {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .setScrollFactor(0); // Keep button fixed on screen

        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ffff00' });
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#ffffff' });
        });

        backButton.on('pointerdown', () => {
            // Stop sounds before switching scenes
            this.engineSound.stop();
            this.music.stop();
            this.scene.start('MenuScene');
        });
    }

    update(time, delta) {
        const dt = delta / 1000;
        if (Phaser.Input.Keyboard.JustDown(this.reloadKey)) this.reloadConfig();
        const accel = this.configData.gameplay.acceleration;
        const decel = this.configData.gameplay.deceleration;
        const maxSpeed = this.configData.gameplay.maxSpeed;

        // Add handbrake logic
        if (this.handbrakeKey.isDown) {
            this.speed -= decel * dt * 3; // Stronger deceleration when handbrake is active
        } else {
            if (this.cursors.up.isDown) this.speed += accel * dt;
            else if (this.cursors.down.isDown) this.speed -= accel * dt;
            else this.speed -= decel * dt;
        }
        
        this.speed = Phaser.Math.Clamp(this.speed, 0, maxSpeed);
        const eng = this.configData.audio.engine;
        const targetPitch = Phaser.Math.Linear(eng.minPitch, eng.maxPitch, this.speed / maxSpeed);
        const targetVol = Phaser.Math.Linear(eng.minVolume, eng.maxVolume, this.speed / maxSpeed);
        this.enginePitch = Phaser.Math.Linear(this.enginePitch, targetPitch, 0.1);
        this.engineVol = Phaser.Math.Linear(this.engineVol, targetVol, 0.1);
        this.engineSound.setRate(this.enginePitch);
        this.engineSound.setVolume(this.engineVol);
        if (this.configData.audio.music.speedControl) {
            const rate = 1 + (this.speed / maxSpeed) * 0.3;
            this.music.setRate(rate);
        }

        // Update background parallax (different speeds for depth effect)
        this.clouds.tilePositionX += this.speed * dt * 20;      // Slowest
        this.mountains.tilePositionX += this.speed * dt * 50;   // Slow
        this.trees.tilePositionX += this.speed * dt * 100;      // Medium
        this.road.tilePositionX += this.speed * dt * 200;       // Fastest

        // Update wheel rotation based on speed
        const wheelRotationSpeed = this.speed * dt * 5;
        this.wheelFront.rotation += wheelRotationSpeed;
        this.wheelRear.rotation += wheelRotationSpeed;

        // Update vehicle position instead of just the car
        if (this.cursors.left.isDown) this.vehicle.y -= 200 * dt;
        else if (this.cursors.right.isDown) this.vehicle.y += 200 * dt;
        this.vehicle.y = Phaser.Math.Clamp(this.vehicle.y, 250, 350);

        // Add slight tilt based on vertical movement
        const tiltAmount = 0.1;
        if (this.cursors.left.isDown) this.vehicle.rotation = -tiltAmount;
        else if (this.cursors.right.isDown) this.vehicle.rotation = tiltAmount;
        else this.vehicle.rotation = 0;

        this.debugText.setText([
            `Speed: ${this.speed.toFixed(1)}`,
            `Pitch: ${this.enginePitch.toFixed(2)}`,
            `Volume: ${this.engineVol.toFixed(2)}`,
            `Press R to reload config`
        ]);
    }

    loadConfig() {
        this.configData = this.cache.json.get('config');
    }

    reloadConfig() {
        console.log('Reloading config...');
        this.load.once('complete', () => {
            this.configData = this.cache.json.get('config');
            console.log('Config reloaded:', this.configData);
            this.music.setVolume(this.configData.audio.music.volume);
            this.engineSound.setVolume(this.configData.audio.engine.minVolume);
            this.debugText.setText('Config reloaded!');
        });
        this.load.json('config', 'assets/config/config.json?t=' + Date.now());
        this.load.start();
    }
}
