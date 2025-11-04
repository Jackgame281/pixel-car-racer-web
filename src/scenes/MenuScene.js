export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // Load button images
        this.load.image('button', 'assets/ui/title_buttons/sp_buttons_20.png');
        this.load.image('button2', "assets/ui/title_items/sp_buttons_52.png");
        this.load.image('button3', "assets/ui/title_items/sp_buttons_13.png");
        this.load.image('title', 'assets/ui/sp_title_2.png');
        this.load.image('background', 'assets/ui/bg_title_back_0.png');

        // Add icons for currency
        this.load.image('cash-icon', 'assets/ui/title_items/sp_cash_2.png');
        this.load.image('diamond-icon', 'assets/ui/title_items/sp_diamond_2.png');
    }

    create() {
        // Add background first so it's behind other elements
        const background = this.add.sprite(400, 300, 'background')
            .setOrigin(0.5);

        // Make background fit the game screen
        background.setDisplaySize(1024, 566);
        background.setScrollFactor(0.8);

        // Load player stats
        const savedStats = localStorage.getItem('playerStats');
        const playerStats = savedStats ? JSON.parse(savedStats) : {
            money: 50000,
            diamonds: 50,
            ownedCars: []
        };

        // Add stats bar at the top
        const statsBar = this.add.rectangle(400, 30, 1100, 60, 0x000000, 1);
        
        // Add currency displays
        this.add.sprite(780, 40, 'cash-icon').setScale(0.5);
        this.add.sprite(680, 40, 'diamond-icon').setScale(0.5);
        
        // Display cash with actual player money
        this.add.text(800, 30, `$${playerStats.money.toLocaleString()}`, {
            fontSize: '24px',
            fill: '#00ff00'
        });

        // Display diamonds
        this.add.text(700, 30, `${playerStats.diamonds}`, {
            fontSize: '24px',
            fill: '#00ffff'
        });

        // Replace the title sprite creation with:
        const title = this.add.sprite(450, 130, 'title')
            .setOrigin(0.5);
        
        // Optionally scale the image if needed
        // title.setScale(0.8); // Adjust scale value as needed

        // Create menu buttons
        this.createButton(450, 250, 'RACE', () => {
            this.scene.start('RaceScene');
        });

        this.createButton(450, 320, 'GARAGE', () => {
            this.scene.start('GarageScene');
        });
        this.createButton(450, 390, 'DEALERSHIP', () => {
            this.scene.start('DealershipScene');
        });
        this.createButton(450, 460, 'SHOP', () => {
            this.scene.start('ShopScene');
        });
        this.createButton(450, 530, 'SETTINGS', () => {
            this.scene.start('SettingsScene');
        });
        this.createButton2(30, 20, '', () => {
            this.scene.start('ProfileScene');
        });
        this.createButton3(500, 30, '', () => {
            if (confirm("Go to the Pixel Car Racer Web GitHub page?")) {
                window.open("https://github.com/Jackgame281/pixel-car-racer-web", "_blank");
            }
        });
            
    }

    createButton2(x, y, text, callback) {
        const button2 = this.add.sprite(x, y, 'button2')
            .setInteractive()
            .setScale(0.9)
            .setOrigin(0.5);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '16px',  // Smaller font size for secondary button
            fill: '#ffffff'
        }).setOrigin(0.5);

        button2.on('pointerover', () => {
            button2.setTint(0xcccccc);
        });

        button2.on('pointerout', () => {
            button2.clearTint();
        });

        button2.on('pointerdown', () => {
            button2.setTint(0x999999);
        });

        button2.on('pointerup', () => {
            button2.clearTint();
            callback();
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.sprite(x, y, 'button')
            .setInteractive()
            .setScale(2)
            .setOrigin(0.5);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '32px',
            fill: '#ffffff'
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

    createButton3(x, y, text, callback) {
        const button3 = this.add.sprite(x, y, 'button3')
            .setInteractive()
            .setScale(0.8)
            .setOrigin(0.5);

        const buttonText = this.add.text(x, y, text, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        button3.on('pointerover', () => {
            button3.setTint(0xcccccc);
        });

        button3.on('pointerout', () => {
            button3.clearTint();
        });

        button3.on('pointerdown', () => {
            button3.setTint(0x999999);
        });

        button3.on('pointerup', () => {
            button3.clearTint();
            callback();
        });
    }
}