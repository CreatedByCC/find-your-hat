const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
        this.positionX = 0;
        this.positionY = 0;
        this.field[0][0] = pathCharacter;   // Set the starting position
    };

    print() {
        for (const row of this.field) {
            console.log(row.join(" "));
        }; 
    };

    getUserInput() {
        const userInput = prompt('Type the letter of the direction you want to go:').toLowerCase();

        switch(userInput) {
            case 'r':
                this.positionX += 1;
                break;
            case 'l':
                this.positionX -= 1;
                break;
            case 'd':
                this.positionY += 1;
                break;
            case 'u':
                this.positionY -= 1;
                break;
            default:
                console.log('Type the letter of the direction you want to go, for example U is UP.');
                this.getUserInput();
                break;
        }
    }

    playGame() {
        let playing = true;
        const numRows = this.field.length;
        const numCols = this.field[0].length;
        
        while (playing) {
            this.print();
            this.getUserInput();
            
            try {
                const newPosX = this.positionX;
                const newPosY = this.positionY;

                if (newPosX < 0 || newPosX >= numCols || newPosY < 0 || newPosY >= numRows) {
                    console.log('Ahhh, you fell off the map!');
                    playing = false;
                } else if (this.field[newPosY][newPosX] === hat) {
                    console.log('Congratulations!! You found the hat!');
                    playing = false;
                } else if (this.field[newPosY][newPosX] === hole) {
                    console.log('Oops!! You fell into a hole!');
                    playing = false;
                } else {
                    this.field[newPosY][newPosX] = pathCharacter;
                    this.positionX = newPosX;
                    this.positionY = newPosY;
                }
            } catch(e) {
                console.log('Error occurred:', e.message);
                playing = false;
                break;
            }
        }
    }

    static generateField(height, width) {
        const holePercentage = parseFloat(prompt('How many holes would you like to add (%)?'));

        if (isNaN(holePercentage) || holePercentage < 0 || holePercentage > 100) {
            console.log('Invalid input. Please provide a valid percentage between 0 and 100.');
            return null;
        }

        // Creates a new field array
        const field = Array.from({ length: height }, () => Array.from({ length: width }, () => fieldCharacter)); 
        
        // Set hat location
        let hatY, hatX;

        do {
            hatY = Math.floor(Math.random() * height);
            hatX = Math.floor(Math.random() * width);
        } while (hatY === 0 && hatX === 0); 
        
        field[hatY][hatX] = hat;

        // Set the hole locations
        const numHoles = Math.floor((height * width * holePercentage) / 100);

        for (let i = 0; i < numHoles; i++) {
            let holeY, holeX;
        
            do {
                holeY = Math.floor(Math.random() * height);
                holeX = Math.floor(Math.random() * width);
            } while (field[holeY][holeX] !== fieldCharacter || (holeY === 0 && holeX === 0)); 
            
            field[holeY][holeX] = hole;
        }
        return field;
    }
};


const myField = new Field(Field.generateField(10, 10));
myField.playGame();

