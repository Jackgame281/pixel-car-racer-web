export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
        this.creditsContainer = null;
        this.isScrolling = false;
    }

    preload() {
        this.load.image('background', 'assets/ui/bg_title_back_0.png');
        this.load.image('backButton', 'assets/ui/title_buttons/sp_buttons_20.png');
    }

    create() {
        // Add background
        const background = this.add.sprite(400, 300, 'background')
            .setOrigin(0.5)
            .setDisplaySize(1024, 566);

        // Create a container for scrolling content
        this.creditsContainer = this.add.container(400, 700);

        // Title
        const title = this.add.text(0, 0, 'CREDITS', {
            fontSize: '48px',
            fill: '#ffffff',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5);
        this.creditsContainer.add(title);

        // Credits content
        const credits = [
            { title: 'FONTS', content: ['DePixelKlein - Dafont/ingoFonts'] },
            { title: 'MUSIC', content: ['AfterBurner - dubmood/Chiptune', 'Sound Effects - Unknown, ripped stright from game'] },
            { title: 'VISUALS', content: ['Artwork - Artist/Source', 'Sprites - Artist/Source'] },
            { title: 'CODE', content: ['Game Engine - Phaser', 'Programming - Jackgame281, AI', 'Bug-Catchers - Jackgame281, WaffleLover44, fern' ] },
            { title: 'CUSTOM DECALS', content: ['Shuffle - @MewMewSpirit', 'Sparkle Time - cranky', 'Marco Madness - Indo921'] },
            { title: 'SPECIAL THANKS', content: ['Coach H - Motivated me', 'Name 2'] },
            { title: "STORYWRITERS", content: ['@Jackgame281', 'Writer 2'] },
            { title: 'TRANSLATORS', content: ['Spanish - Translator1', 'French - Translator2', 'Ukranian - Translator3'] },
            { title: 'TESTERS', content: ['Tester 1', 'Tester 2', 'Tester 3'] },
            { title: 'AND YOU!', content: ['Thanks for playing our game! :)'] }
        ];

        let yPosition = 100;
        credits.forEach(section => {
            // Section title
            const sectionTitle = this.add.text(0, yPosition, section.title, {
                fontSize: '32px',
                fill: '#ffff00',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 2,
                    fill: true
                }
            }).setOrigin(0.5);
            this.creditsContainer.add(sectionTitle);
            
            yPosition += 40;

            // Section content
            section.content.forEach(line => {
                const contentText = this.add.text(0, yPosition, line, {
                    fontSize: '24px',
                    fill: '#ffffff',
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: '#000000',
                        blur: 2,
                        fill: true
                    }
                }).setOrigin(0.5);
                this.creditsContainer.add(contentText);
                yPosition += 30;
            });

            yPosition += 20;
        });

        // Back button (keep it outside the container so it doesn't scroll)
        const backButton = this.add.sprite(400, 550, 'backButton')
            .setInteractive()
            .setScale(2);

        const backText = this.add.text(400, 550, 'BACK', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Start scrolling after 2 seconds
        this.time.delayedCall(2000, () => {
            this.isScrolling = true;
        });

        // Button events
        backButton.on('pointerover', () => backButton.setTint(0xcccccc));
        backButton.on('pointerout', () => backButton.clearTint());
        backButton.on('pointerdown', () => backButton.setTint(0x999999));
        backButton.on('pointerup', () => {
            backButton.clearTint();
            this.scene.start('MenuScene');
        });
    }

    update() {
        if (this.isScrolling && this.creditsContainer.y > -800) { // Adjust -800 based on your content length
            this.creditsContainer.y -= 1; // Adjust speed by changing this value
        }
    }
}