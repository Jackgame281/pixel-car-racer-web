import { vehicles, getVehicleById, formatPrice } from '../data/vehicles.js';

export default class DealershipScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DealershipScene' });
        this.currentVehicleIndex = 0;
        this.playerStats = null;
    }

    preload() {
        // Load dealership background
        this.load.image('dealership_bg', 'assets/tracks/garages/sp_garage_4.png');
        
        // Load car sprites
        vehicles.forEach(vehicle => {
            this.load.image(vehicle.sprite, `assets/cars/bodies/${vehicle.sprite}.png`);
        });

        // Load sound effects
        this.load.audio('buy_sound', 'assets/audio/snd_buy.wav');
        this.load.audio('buycar_sound', 'assets/audio/snd_buycar.wav');
        this.load.audio('error_sound', 'assets/audio/snd_alert.wav');
    }

    create() {
        // Load player stats from localStorage
        const savedStats = localStorage.getItem('playerStats');
        this.playerStats = savedStats ? JSON.parse(savedStats) : {
            money: 50000,
            ownedCars: []
        };

        // Add background
        this.add.sprite(400, 300, 'dealership_bg').setDisplaySize(779, 475);

        // Add header
        this.add.text(400, 50, 'DEALERSHIP', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add money display
        this.moneyText = this.add.text(700, 50, formatPrice(this.playerStats.money), {
            fontSize: '24px',
            fill: '#00ff00',
            fontStyle: 'bold'
        });

        // Display current vehicle
        this.vehicleDisplay = this.add.sprite(400, 300, vehicles[0].sprite);
        
        // Add vehicle stats display
        this.statsText = this.add.text(600, 200, '', {
            fontSize: '24px',
            fill: '#ffffff'
        });

        // Add navigation arrows
        this.addNavigationArrows();

        // Add purchase button
        this.purchaseButton = this.add.text(400, 500, 'PURCHASE', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 15, y: 8 }
        })
        .setOrigin(0.5)
        .setInteractive();

        // Add button interactions
        this.setupButtonInteractions();

        // Add sound effects
        this.buySound = this.sound.add('buy_sound');
        this.buyCarSound = this.sound.add('buycar_sound');
        this.errorSound = this.sound.add('error_sound');

        // Back button
        this.add.text(100, 50, 'Back', {
            fontSize: '24px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.scene.start('MenuScene'));

        // Show initial vehicle
        this.updateVehicleDisplay();
    }

    addNavigationArrows() {
        // Left arrow
        this.add.text(300, 300, '←', {
            fontSize: '32px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.cycleVehicle(-1));

        // Right arrow
        this.add.text(500, 300, '→', {
            fontSize: '32px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerup', () => this.cycleVehicle(1));
    }

    setupButtonInteractions() {
        this.purchaseButton.on('pointerover', () => {
            this.purchaseButton.setStyle({ fill: '#ffff00' });
        });

        this.purchaseButton.on('pointerout', () => {
            this.purchaseButton.setStyle({ fill: '#ffffff' });
        });

        this.purchaseButton.on('pointerdown', () => {
            this.tryPurchaseVehicle();
        });
    }

    cycleVehicle(direction) {
        this.currentVehicleIndex = (this.currentVehicleIndex + direction + vehicles.length) % vehicles.length;
        this.updateVehicleDisplay();
    }

    updateVehicleDisplay() {
        const vehicle = vehicles[this.currentVehicleIndex];
        
        // Update vehicle sprite
        this.vehicleDisplay.setTexture(vehicle.sprite);
        
        // Check if player owns this vehicle
        const isOwned = this.playerStats.ownedCars.includes(vehicle.id);
        
        // Update stats display
        this.statsText.setText(
            `${vehicle.name}\n\n` +
            `Speed: ${vehicle.stats.speed}\n` +
            `Acceleration: ${vehicle.stats.acceleration}\n` +
            `Handling: ${vehicle.stats.handling}\n` +
            `Price: ${formatPrice(vehicle.stats.price)}\n\n` +
            `${isOwned ? '[OWNED]' : ''}`
        );

        // Update purchase button state
        this.purchaseButton.setVisible(!isOwned);
    }

    tryPurchaseVehicle() {
        const vehicle = vehicles[this.currentVehicleIndex];
        
        // Check if player already owns the vehicle
        if (this.playerStats.ownedCars.includes(vehicle.id)) {
            this.errorSound.play();
            return;
        }

        // Check if player has enough money
        if (this.playerStats.money >= vehicle.stats.price) {
            // Deduct price and add to owned cars
            this.playerStats.money -= vehicle.stats.price;
            this.playerStats.ownedCars.push(vehicle.id);
            
            // Save to localStorage
            localStorage.setItem('playerStats', JSON.stringify(this.playerStats));
            
            // Update displays
            this.moneyText.setText(formatPrice(this.playerStats.money));
            this.updateVehicleDisplay();
            
            // Play purchase sound
            this.buyCarSound.play();
            
            // Show success message
            this.showMessage('Vehicle purchased!', '#00ff00');
        } else {
            // Play error sound
            this.errorSound.play();
            
            // Show error message
            this.showMessage('Not enough money!', '#ff0000');
        }
    }

    showMessage(text, color) {
        const message = this.add.text(400, 400, text, {
            fontSize: '24px',
            fill: color,
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // Fade out and destroy after 2 seconds
        this.tweens.add({
            targets: message,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => message.destroy()
        });
    }
}