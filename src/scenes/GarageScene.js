import { vehicles, getVehicleById, getOwnedVehicles, formatPrice } from '../data/vehicles.js';

export default class GarageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GarageScene' });
        this.currentVehicleIndex = 0;
        this.currentBgIndex = 0;
        this.backgrounds = ['garage1', 'garage2', 'garage3'];
        this.playerStats = null;
        this.ownedVehicles = [];
    }

    preload() {
        // Load garage backgrounds
        this.load.image('garage1', 'assets/tracks/garages/sp_garage_0.png');
        this.load.image('garage2', 'assets/tracks/garages/sp_garage_2.png');
        this.load.image('garage3', 'assets/tracks/garages/sp_garage_3.png');
        
        // Load car sprites
        vehicles.forEach(vehicle => {
            this.load.image(vehicle.sprite, `assets/cars/bodies/${vehicle.sprite}.png`);
        });
    }

    create() {
        // Load player stats
        const savedStats = localStorage.getItem('playerStats');
        this.playerStats = savedStats ? JSON.parse(savedStats) : {
            money: 50000,
            ownedCars: []
        };

        // Get owned vehicles
        this.ownedVehicles = getOwnedVehicles(this.playerStats.ownedCars);

        if (this.ownedVehicles.length === 0) {
            // Show message if no cars owned
            this.add.text(400, 300, 'No cars in garage!\nVisit the dealership to buy cars.', {
                fontSize: '24px',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            // Add back button
            this.addBackButton();
            return;
        }

        // Add background first so it's behind everything
        this.background = this.add.sprite(400, 300, this.backgrounds[0]);
        this.background.setDisplaySize(779, 475);
        this.background.setDepth(-1);

        // Add background cycling buttons
        this.addBackgroundControls();

        // Display current vehicle - shifted down
        this.vehicleDisplay = this.add.sprite(400, 400, this.ownedVehicles[0].sprite);
        
        // Add vehicle stats - moved below the car
        this.statsText = this.add.text(200, 180, '', {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Add navigation arrows
        this.addNavigationArrows();

        // Add back button
        this.addBackButton();

        // Show initial vehicle
        this.updateVehicleDisplay();
    }

    addBackButton() {
        this.add.text(100, 50, 'Back', {
            fontSize: '24px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.scene.start('MenuScene'));
    }

    addNavigationArrows() {
        // Left arrow - adjusted Y position
        this.add.text(300, 350, '←', {
            fontSize: '32px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.cycleVehicle(-1));

        // Right arrow - adjusted Y position
        this.add.text(500, 350, '→', {
            fontSize: '32px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.cycleVehicle(1));
    }

    addBackgroundControls() {
        // Background cycle left
        this.add.text(50, 550, '←', {
            fontSize: '24px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.cycleBackground(-1));

        // Background label
        this.bgText = this.add.text(100, 550, 'Background', {
            fontSize: '20px',
            fill: '#ffffff'
        });

        // Background cycle right
        this.add.text(200, 550, '→', {
            fontSize: '24px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.cycleBackground(1));
    }

    cycleVehicle(direction) {
        this.currentVehicleIndex = (this.currentVehicleIndex + direction + this.ownedVehicles.length) % this.ownedVehicles.length;
        this.updateVehicleDisplay();
    }

    updateVehicleDisplay() {
        const vehicle = this.ownedVehicles[this.currentVehicleIndex];
        
        // Update vehicle sprite
        this.vehicleDisplay.setTexture(vehicle.sprite);
        
        // Update stats display with more details
        this.statsText.setText(
            `${vehicle.name}\n` +
            `Speed: ${vehicle.stats.speed}\n` +
            `Acceleration: ${vehicle.stats.acceleration}\n` +
            `Handling: ${vehicle.stats.handling}\n` +
            `Value: ${formatPrice(vehicle.stats.price)}\n` +
            '[OWNED]'
        );
    }

    cycleBackground(direction) {
        this.currentBgIndex = (this.currentBgIndex + direction + this.backgrounds.length) % this.backgrounds.length;
        this.background.setTexture(this.backgrounds[this.currentBgIndex]);
    }
}