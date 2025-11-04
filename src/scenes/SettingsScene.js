export default class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    create() {
        // Temporary text to show the scene loaded
        this.add.text(400, 300, 'Placeholder Settings', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add a back button
        this.add.text(100, 50, 'Back', {
            fontSize: '24px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.scene.start('MenuScene'));
        this.add.text(400, 350, 'Settings will be implemented in future updates.', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(400, 400, 'For now, enjoy the proof-of-concept!', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(200, 50, 'Credits', {
            fontSize: '24px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.scene.start('CreditsScene'));

    }
}