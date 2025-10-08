export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Load button images
        this.load.image('button', 'assets/ui/button.png');
    }

    create() {
        // Add game title
        const title = this.add.text(400, 100, 'PIXEL CAR RACER', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create menu buttons
        this.createButton(400, 250, 'RACE', () => {
            this.scene.start('RaceScene');
        });

        this.createButton(400, 350, 'GARAGE', () => {
            this.scene.start('GarageScene');
        });

        this.createButton(400, 450, 'SHOP', () => {
            this.scene.start('ShopScene');
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.sprite(x, y, 'button')
            .setInteractive()
            .setScale(2);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '32px',
            fill: '#000000'
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setTint(0xcccccc);
        });

        button.on('pointerout', () => {
            button.clearTint();
        });

        button.on('pointerdown', () => {
            button.setTint(0x999999);
        });

        button.on('pointerup', () => {
            button.clearTint();
            callback();
        });
    }
}