export default class profile extends Phaser.Scene {
    constructor() {
        super({ key: 'ProfileScene' });
        this.stats = {
            wins: 0,
            losses: 0,
            totalRaces: 0,
            badges: [],
            money: 0,
            avatar: 'default_avatar',
            avatarData: null, // Will store base64 image data
            currentAvatarIndex: 0, // Track which placeholder we're using
            username: 'Player',
            displayName: 'Player'
        };
        
        // Define available placeholder avatars
        this.placeholderAvatars = [
            { key: 'default_avatar', name: 'Default' },
            { key: 'avatar_1', name: 'Racer' },
            { key: 'avatar_2', name: 'Champion' },
            { key: 'avatar_3', name: 'Pro' }
        ];
    }

    preload() {
        // Load all placeholder avatars
        this.load.image('default_avatar', './assets/placeholders/pfpholder.jpg');
        this.load.image('avatar_1', './assets/placeholders/pfpholder_1.jpg');
        this.load.image('avatar_2', './assets/placeholders/pfpholder_2.jpg');
        this.load.image('avatar_3', './assets/placeholders/pfpholder_3.jpg');
        
        // Load badge frames and badges
        this.load.image('badge_frame', './assets/ui/title_items/sp_buttons_13.png');
        // Load multiple badge images (0-15 for more badges)
        for(let i = 0; i <= 15; i++) {
            this.load.image(`badge_${i}`, `./assets/ui/badges/sp_badges_${i}.png`);
        }
    }

    init(data) {
        // Load stats from localStorage if available
        const savedStats = localStorage.getItem('playerStats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
            if (this.stats.avatarData) {
                // Create a new texture from the saved base64 data if it exists
                this.textures.addBase64('player_avatar', this.stats.avatarData);
                this.stats.avatar = 'player_avatar';
            }
        } else {
            // Add more test badges to demonstrate the system
            this.stats.badges = [0, 1, 2, 3, 4, 5, 6];
            this.stats.wins = 55;
            this.stats.losses = 20;
            this.stats.money = 250000;
            localStorage.setItem('playerStats', JSON.stringify(this.stats));
        }
        // Ensure avatar property exists and use placeholder if needed
        if (!this.stats.avatar) {
            this.stats.avatar = 'default_avatar';
            localStorage.setItem('playerStats', JSON.stringify(this.stats));
        }
    }

    create() {
        // Add background with gradient
        const bg = this.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0);
        const gradient = this.add.rectangle(0, 0, 800, 600, 0x333333).setOrigin(0);
        gradient.setAlpha(0.3);

        // Add profile header
        this.add.text(400, 50, 'PLAYER PROFILE', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Add profile picture
        const avatar = this.add.sprite(150, 150, this.stats.avatar)
            .setScale(0.8)
            .setInteractive();
        
        // Add circular mask for profile picture
        const mask = this.add.graphics();
        mask.fillStyle(0xffffff);
        mask.fillCircle(150, 150, 50);
        avatar.setMask(mask.createGeometryMask());

        // Add change profile picture button
        const changeAvatarButton = this.add.text(150, 220, 'Change Picture', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5)
          .setInteractive();

        changeAvatarButton.on('pointerover', () => changeAvatarButton.setStyle({ fill: '#ffff00' }));
        changeAvatarButton.on('pointerout', () => changeAvatarButton.setStyle({ fill: '#ffffff' }));

        // Add navigation arrows for profile pictures
        const leftArrow = this.add.text(100, 150, '←', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setInteractive();

        const rightArrow = this.add.text(200, 150, '→', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setInteractive();

        // Arrow hover effects
        [leftArrow, rightArrow].forEach(arrow => {
            arrow.on('pointerover', () => arrow.setStyle({ fill: '#ffff00' }));
            arrow.on('pointerout', () => arrow.setStyle({ fill: '#ffffff' }));
        });

        // Arrow click handlers
        leftArrow.on('pointerdown', () => {
            this.stats.currentAvatarIndex = (this.stats.currentAvatarIndex - 1 + this.placeholderAvatars.length) % this.placeholderAvatars.length;
            updateAvatar();
        });

        rightArrow.on('pointerdown', () => {
            this.stats.currentAvatarIndex = (this.stats.currentAvatarIndex + 1) % this.placeholderAvatars.length;
            updateAvatar();
        });

        // Helper function to update avatar
        const updateAvatar = () => {
            const newAvatar = this.placeholderAvatars[this.stats.currentAvatarIndex];
            this.stats.avatar = newAvatar.key;
            avatar.setTexture(newAvatar.key);
            localStorage.setItem('playerStats', JSON.stringify(this.stats));
        };

        // Update Change Picture button to randomly select an avatar
        changeAvatarButton.on('pointerdown', () => {
            const randomIndex = Math.floor(Math.random() * this.placeholderAvatars.length);
            this.stats.currentAvatarIndex = randomIndex;
            updateAvatar();
        });

        // Display stats with improved styling
        const textStyle = { 
            fontSize: '24px', 
            fill: '#ffffff',
            fontStyle: 'bold'
        };
        
        const statsX = 300;
        this.add.text(statsX, 120, `Races Won: ${this.stats.wins}`, textStyle);
        this.add.text(statsX, 160, `Races Lost: ${this.stats.losses}`, textStyle);
        this.add.text(statsX, 200, `Win Rate: ${this.getWinRate()}%`, textStyle);
        this.add.text(statsX, 240, `Total Money: $${this.stats.money.toLocaleString()}`, textStyle);

        // Display badges in a grid
        this.add.text(400, 300, 'BADGES', {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create badge grid
        const badgeGrid = {
            x: 200,
            y: 350,
            spacing: 80
        };

        // If no badges, show a message
        if (this.stats.badges.length === 0) {
            this.add.text(400, 350, 'No badges earned yet!\nComplete races to earn badges.', {
                fontSize: '20px',
                fill: '#888888',
                align: 'center'
            }).setOrigin(0.5);
        } else {
            this.stats.badges.forEach((badge, index) => {
                const col = index % 4;
                const row = Math.floor(index / 4);
                const x = badgeGrid.x + (col * badgeGrid.spacing);
                const y = badgeGrid.y + (row * badgeGrid.spacing);

                // Add badge frame first
                const frame = this.add.sprite(x, y, 'badge_frame').setScale(0.8);
                
                // Add badge icon on top of frame
                const badgeIcon = this.add.sprite(x, y, `badge_${badge}`)
                    .setScale(0.7)
                    .setInteractive();
                
                // Add badge name below
                const badgeName = this.add.text(x, y + 40, this.getBadgeName(badge), {
                    fontSize: '14px',
                    fill: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);

                // Create tooltip (hidden by default)
                const tooltip = this.add.text(x, y - 40, this.getBadgeDescription(badge), {
                    fontSize: '12px',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 5, y: 3 },
                    align: 'center'
                }).setOrigin(0.5).setVisible(false);

                // Add hover effects for tooltip
                badgeIcon.on('pointerover', () => {
                    tooltip.setVisible(true);
                    frame.setTint(0xcccccc);
                });
                
                badgeIcon.on('pointerout', () => {
                    tooltip.setVisible(false);
                    frame.clearTint();
                });
            });
        }

        // Add back button with improved styling
        const backButton = this.add.text(400, 500, 'Back to Menu', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5)
          .setInteractive();

        // Add hover effect
        backButton.on('pointerover', () => backButton.setStyle({ fill: '#ffff00' }));
        backButton.on('pointerout', () => backButton.setStyle({ fill: '#ffffff' }));
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Add settings button
        const settingsButton = this.add.text(700, 50, '⚙️ Settings', {
            fontSize: '20px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 0.5)
          .setInteractive();

        // Create settings panel (initially hidden)
        const settingsPanel = this.add.container(400, 300);
        const panelBg = this.add.rectangle(0, 0, 400, 300, 0x000000, 0.9);
        const panelTitle = this.add.text(0, -130, 'Profile Settings', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add settings options
        const usernameInput = this.add.text(-150, -70, `Username: ${this.stats.username}`, {
            fontSize: '18px',
            fill: '#ffffff'
        }).setInteractive();

        const displayNameInput = this.add.text(-150, -30, `Display Name: ${this.stats.displayName}`, {
            fontSize: '18px',
            fill: '#ffffff'
        }).setInteractive();

        const exportButton = this.add.text(-80, 50, 'Export Profile Data', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5)
          .setInteractive();

        const importButton = this.add.text(80, 50, 'Import Profile Data', {
            fontSize: '18px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5)
          .setInteractive();

        const closeButton = this.add.text(180, -130, 'X', {
            fontSize: '20px',
            fill: '#ffffff'
        }).setInteractive();

        settingsPanel.add([panelBg, panelTitle, usernameInput, displayNameInput, exportButton, importButton, closeButton]);
        settingsPanel.setVisible(false);

        // Settings button handlers
        settingsButton.on('pointerover', () => settingsButton.setStyle({ fill: '#ffff00' }));
        settingsButton.on('pointerout', () => settingsButton.setStyle({ fill: '#ffffff' }));
        settingsButton.on('pointerdown', () => {
            settingsPanel.setVisible(true);
        });

        // Close button handler
        closeButton.on('pointerdown', () => {
            settingsPanel.setVisible(false);
        });

        // Input handlers
        usernameInput.on('pointerdown', () => {
            const newUsername = prompt('Enter new username:', this.stats.username);
            if (newUsername) {
                this.stats.username = newUsername;
                usernameInput.setText(`Username: ${newUsername}`);
                localStorage.setItem('playerStats', JSON.stringify(this.stats));
            }
        });

        displayNameInput.on('pointerdown', () => {
            const newDisplayName = prompt('Enter new display name:', this.stats.displayName);
            if (newDisplayName) {
                this.stats.displayName = newDisplayName;
                displayNameInput.setText(`Display Name: ${newDisplayName}`);
                localStorage.setItem('playerStats', JSON.stringify(this.stats));
            }
        });

        // Export handler
        exportButton.on('pointerdown', () => {
            const dataStr = JSON.stringify(this.stats, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportName = 'profile_data.json';

            const link = document.createElement('a');
            link.setAttribute('href', dataUri);
            link.setAttribute('download', exportName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Import handler
        importButton.on('pointerdown', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = (event) => {
                    try {
                        const importedStats = JSON.parse(event.target.result);
                        // Validate imported data has required fields
                        if (importedStats.wins !== undefined && 
                            importedStats.losses !== undefined && 
                            importedStats.badges !== undefined) {
                            this.stats = importedStats;
                            localStorage.setItem('playerStats', JSON.stringify(this.stats));
                            this.scene.restart(); // Refresh the scene to show new data
                        } else {
                            alert('Invalid profile data format');
                        }
                    } catch (error) {
                        alert('Error importing profile data');
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        });

        // Add hover effects for interactive elements
        [exportButton, importButton].forEach(button => {
            button.on('pointerover', () => button.setStyle({ fill: '#ffff00' }));
            button.on('pointerout', () => button.setStyle({ fill: '#ffffff' }));
        });
    }

    getWinRate() {
        const totalRaces = this.stats.wins + this.stats.losses;
        if (totalRaces === 0) return 0;
        return ((this.stats.wins / totalRaces) * 100).toFixed(1);
    }

    // Methods to update stats (call these from other scenes)
    updateStats(type, value) {
        switch(type) {
            case 'win':
                this.stats.wins += 1;
                break;
            case 'loss':
                this.stats.losses += 1;
                break;
            case 'money':
                this.stats.money += value;
                break;
            case 'badge':
                if (!this.stats.badges.includes(value)) {
                    this.stats.badges.push(value);
                }
                break;
        }
        // Save to localStorage
        localStorage.setItem('playerStats', JSON.stringify(this.stats));
    }

    getBadgeName(badge) {
        // Return badge name and description based on badge id
        const badges = {
            0: { name: 'First Race', desc: 'Complete your first race' },
            1: { name: 'Speedster', desc: 'Win a race at max speed' },
            2: { name: 'Champion', desc: 'Win 10 races' },
            3: { name: 'Veteran', desc: 'Complete 50 races' },
            4: { name: 'Legend', desc: 'Maintain 75% win rate' },
            5: { name: 'Master', desc: 'Own all cars' },
            6: { name: 'Mechanic', desc: 'Fully upgrade a car' },
            7: { name: 'Collector', desc: 'Own 10 cars' },
            8: { name: 'Street King', desc: 'Win 100 street races' },
            9: { name: 'Rich Rider', desc: 'Earn $1,000,000' },
            10: { name: 'Customizer', desc: 'Apply 50 mods' },
            11: { name: 'Perfect Start', desc: 'Get 10 perfect launches' },
            12: { name: 'Drag Master', desc: 'Win 25 drag races' },
            13: { name: 'Tuner', desc: 'Max tune 3 cars' },
            14: { name: 'Elite', desc: 'Reach Elite rank' },
            15: { name: 'Legend Status', desc: 'Complete all achievements' }
        };
        return badges[badge]?.name || 'Unknown Badge';
    }

    getBadgeDescription(badge) {
        const badges = {
            0: { name: 'First Race', desc: 'Complete your first race' },
            1: { name: 'Speedster', desc: 'Win a race at max speed' },
            2: { name: 'Champion', desc: 'Win 10 races' },
            3: { name: 'Veteran', desc: 'Complete 50 races' },
            4: { name: 'Legend', desc: 'Maintain 75% win rate' },
            5: { name: 'Master', desc: 'Own all cars' },
            6: { name: 'Mechanic', desc: 'Fully upgrade a car' },
            7: { name: 'Collector', desc: 'Own 10 cars' },
            8: { name: 'Street King', desc: 'Win 100 street races' },
            9: { name: 'Rich Rider', desc: 'Earn $1,000,000' },
            10: { name: 'Customizer', desc: 'Apply 50 mods' },
            11: { name: 'Perfect Start', desc: 'Get 10 perfect launches' },
            12: { name: 'Drag Master', desc: 'Win 25 drag races' },
            13: { name: 'Tuner', desc: 'Max tune 3 cars' },
            14: { name: 'Elite', desc: 'Reach Elite rank' },
            15: { name: 'Legend Status', desc: 'Complete all achievements' }
        };
        return badges[badge]?.desc || 'Badge description unavailable';
    }
}
