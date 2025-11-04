export default class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    create() {
        const menuStyle = {
            fontSize: '24px',
            fill: '#ffffff'
        };

        const menuItems = [
            { text: 'Back', y: 50, scene: 'MenuScene' },
            { text: 'Cars', y: 150, scene: 'CarsScene' },
            { text: 'Parts', y: 200, scene: 'PartsScene' },
            { text: 'Other', y: 250, scene: 'OtherScene' }
        ];

        menuItems.forEach(item => {
            this.add.text(100, item.y, item.text, menuStyle)
                .setInteractive()
                .on('pointerup', () => this.scene.start(item.scene));
        });
    }
}