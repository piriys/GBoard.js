console.clear();
const SETTINGS = {
    playerCount: 2,
    startingTileCount: 7,
    boardLength: 15,
    dictionaryUrl: './sowpods.txt'
};

const TILE_DATA = {
    'B': { point: 3, count: 2 },
    'A': { point: 1, count: 9 },
    'C': { point: 3, count: 2 },
    'D': { point: 2, count: 4 },
    'E': { point: 1, count: 12 },
    'F': { point: 4, count: 2 },
    'G': { point: 2, count: 3 },
    'H': { point: 4, count: 2 },
    'I': { point: 1, count: 9 },
    'J': { point: 8, count: 1 },
    'K': { point: 5, count: 1 },
    'L': { point: 1, count: 4 },
    'M': { point: 3, count: 2 },
    'N': { point: 1, count: 6 },
    'O': { point: 1, count: 8 },
    'P': { point: 3, count: 2 },
    'Q': { point: 10, count: 1 },
    'R': { point: 1, count: 6 },
    'S': { point: 1, count: 4 },
    'T': { point: 1, count: 6 },
    'U': { point: 1, count: 4 },
    'V': { point: 4, count: 2 },
    'W': { point: 4, count: 2 },
    'X': { point: 8, count: 1 },
    'Y': { point: 4, count: 2 },
    'Z': { point: 10, count: 1 },
    '_BLANK': { point: 0, count: 2 }
};

const PREMIUM_SQUARE_DATA = {
    // Double Letter
    'D|1': { type: 'dl' },
    'L|1': { type: 'dl' },
    'G|3': { type: 'dl' },
    'I|3': { type: 'dl' },
    'A|4': { type: 'dl' },
    'H|4': { type: 'dl' },
    'O|4': { type: 'dl' },
    'C|7': { type: 'dl' },
    'G|7': { type: 'dl' },
    'I|7': { type: 'dl' },
    'M|7': { type: 'dl' },
    'D|8': { type: 'dl' },
    'L|8': { type: 'dl' },
    'C|9': { type: 'dl' },
    'G|9': { type: 'dl' },
    'I|9': { type: 'dl' },
    'M|9': { type: 'dl' },
    'A|12': { type: 'dl' },
    'H|12': { type: 'dl' },
    'O|12': { type: 'dl' },
    'G|13': { type: 'dl' },
    'I|13': { type: 'dl' },
    'D|15': { type: 'dl' },
    'L|15': { type: 'dl' },
    // Triple letter
    'F|2': { type: 'tl' },
    'J|2': { type: 'tl' },
    'B|6': { type: 'tl' },
    'F|6': { type: 'tl' },
    'J|6': { type: 'tl' },
    'N|6': { type: 'tl' },
    'B|10': { type: 'tl' },
    'F|10': { type: 'tl' },
    'J|10': { type: 'tl' },
    'N|10': { type: 'tl' },
    'F|14': { type: 'tl' },
    'J|14': { type: 'tl' },
    // Double word
    'B|2': { type: 'dw' },
    'N|2': { type: 'dw' },
    'C|3': { type: 'dw' },
    'M|3': { type: 'dw' },
    'D|4': { type: 'dw' },
    'L|4': { type: 'dw' },
    'E|5': { type: 'dw' },
    'K|5': { type: 'dw' },
    'H|8': { type: 'dw' },
    'E|11': { type: 'dw' },
    'K|11': { type: 'dw' },
    'D|12': { type: 'dw' },
    'L|12': { type: 'dw' },
    'C|13': { type: 'dw' },
    'M|13': { type: 'dw' },
    'B|14': { type: 'dw' },
    'N|14': { type: 'dw' },
    // Triple word 
    'A|1': { type: 'tw' },
    'H|1': { type: 'tw' },
    'O|1': { type: 'tw' },
    'A|8': { type: 'tw' },
    'O|8': { type: 'tw' },
    'A|15': { type: 'tw' },
    'H|15': { type: 'tw' },
    'O|15': { type: 'tw' }
};

class GridHelpers {
    static squareIndexToCoordinates(index) {
        const column = String.fromCharCode(65 + Math.floor(index % SETTINGS.boardLength)); //65 = 'A'       
        const row = Math.floor(index / SETTINGS.boardLength) + 1;
        return `${column}|${row}`;
    }
    static squareColumnRowIndexToCoordinates(columnIndex, rowIndex) {
        const column = String.fromCharCode(65 + columnIndex);
        const row = rowIndex + 1;
        return `${column}|${row}`;
    }
    static squareCoordinatesToColumnRowIndex(coordinates) {
        const array = coordinates.split('|');
        const columnIndex = array[0].charCodeAt(0) - 65;
        const rowIndex = array[1] - 1;
        return { columnIndex: columnIndex, rowIndex: rowIndex };
    }
    static getVerticalAdjacentCoordinates(coordinates) {
        const squareColumnRowIndex = this.squareCoordinatesToColumnRowIndex(coordinates);

        // Up
        const up = this.squareColumnRowIndexToCoordinates(
            squareColumnRowIndex.columnIndex, squareColumnRowIndex.rowIndex - 1);
        // Down
        const down = this.squareColumnRowIndexToCoordinates(
            squareColumnRowIndex.columnIndex, squareColumnRowIndex.rowIndex + 1);

        return {
            up: up,
            down: down
        };
    }
    static getHorizontalAdjacentCoordinates(coordinates) {
        const squareColumnRowIndex = this.squareCoordinatesToColumnRowIndex(coordinates);

        const left = this.squareColumnRowIndexToCoordinates(
            squareColumnRowIndex.columnIndex - 1, squareColumnRowIndex.rowIndex);
        // Left
        const right = this.squareColumnRowIndexToCoordinates(
            squareColumnRowIndex.columnIndex + 1, squareColumnRowIndex.rowIndex);

        return {
            left: left,
            right: right
        };
    }
    static getAdjacentCoordinates(coordinates) {
        // Vertical
        const vertical = this.getVerticalAdjacentCoordinates(coordinates)
        // Horizontal
        const horizontal = this.getHorizontalAdjacentCoordinates(coordinates)

        return {
            up: vertical.up,
            down: vertical.down,
            left: horizontal.left,
            right: horizontal.right
        };
    }
    static getColumnFromCoordinates(coordinates) {
        const columnIndex = this.squareCoordinatesToColumnRowIndex(coordinates).columnIndex;
        const columnCoordinates = [];

        for (let i = 0; i < SETTINGS.boardLength; i++) {
            columnCoordinates.push(this.squareColumnRowIndexToCoordinates(columnIndex, i));
        }

        return columnCoordinates;
    }
    static getRowCoordinates(coordinates) {
        const rowIndex = this.squareCoordinatesToColumnRowIndex(coordinates).rowIndex;
        const rowCoordinates = [];

        for (let i = 0; i < SETTINGS.boardLength; i++) {
            rowCoordinates.push(this.squareColumnRowIndexToCoordinates(i, rowIndex));
        }

        return rowCoordinates;
    }
}
class UtilHelpers {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // From https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static generateUUID() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }
    static cloneClassInstance(instance) {
        return Object.assign(Object.create(instance), instance);
    }
}

class SetupHelpers {
    static loadSquares() {
        const squares = new Map();
        const squareOrder = [];

        for (let i = 0; i < SETTINGS.boardLength * SETTINGS.boardLength; i++) {
            const coordinates = GridHelpers.squareIndexToCoordinates(i);
            const type = PREMIUM_SQUARE_DATA.hasOwnProperty(coordinates) ?
                PREMIUM_SQUARE_DATA[coordinates].type : 'np';
            const columnIndex = i % SETTINGS.boardLength;
            const rowIndex = Math.floor(i / SETTINGS.boardLength);
            const newSquare = new Square({ type: type, coordinates: coordinates, columnIndex: columnIndex, rowIndex: rowIndex });

            squares.set(coordinates, newSquare);
            squareOrder.push(coordinates);
        }

        return {
            squares: squares,
            squareOrder: squareOrder
        };
    }

    static loadTiles() {
        const tiles = new Map();
        const tileOrder = [];

        for (let letter in TILE_DATA) {
            const point = TILE_DATA[letter].point;
            const count = TILE_DATA[letter].count;

            for (let i = 0; i < count; i++) {
                const newTile = new Tile({ letter: letter, point: point });
                tiles.set(newTile.tileId, newTile);
                tileOrder.push(newTile.tileId);
            }
        }

        return {
            tiles: tiles,
            tileOrder: tileOrder
        };
    }

    static loadPlayers() {
        const players = new Map();
        const playerOrder = [];

        for (let k = 0; k < SETTINGS.playerCount; k++) {
            const name = `player${k + 1}`;
            const newPlayer = new Player({ name: name });

            players.set(newPlayer.playerId, newPlayer);
            playerOrder.push(newPlayer.playerId);
        }

        return {
            players: players,
            playerOrder: playerOrder
        };
    }
}

/* Class containing game data */
class Square {
    constructor({ coordinates, columnIndex, rowIndex, type = 'np' } = {}) {
        this.coordinates = coordinates;
        this.columnIndex = columnIndex;
        this.rowIndex = rowIndex;
        this.squareType = type;
    }
}

class Tile {
    constructor({ letter = '', point = 0 } = {}) {
        this.coordinates = undefined; // Square that this tile is placed on        
        this.tileId = UtilHelpers.generateUUID();
        this.letter = letter;
        this.point = point;
    }
}

class GamePhase {
    constructor({ name, message } = {}) {
        this.name = name;
        this.message = message;
    }
}

class Player {
    constructor({ name = 'Player' } = {}) {
        this.playerId = UtilHelpers.generateUUID();
        this.name = name;
        this.score = 0;
        this.tileIds = new Set(); // Tiles that this player currently holds
    }
}

/* React Components */
class SquareDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const classList = [`scrabble__square scrabble__square--${this.props.squareType}`];

        if (this.props.isPlayed)
            classList.push('scrabble__square--played');
        else if (this.props.isPlayable)
            classList.push('scrabble__square--playable');
        else if (this.props.isPlaced)
            classList.push('scrabble__square--placed');

        return (
            <div className={classList.join(' ')}
                onClick={(this.props.letter === undefined && this.props.currentGamePhase === 'place' && this.props.isPlayable) ?
                    () => {
                        this.props.squareDisplayCallback(this.props.coordinates);
                    } : () => {
                        console.log('current game phase is not place or a tile is already placed on this square');
                    }}>
                <p>{this.props.coordinates}</p>
                <p>{this.props.letter}</p>
            </div>
        );
    }
}

class GameBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const squareDisplays = [];

        for (let i = 0; i < this.props.squareOrder.length; i++) {
            const coordinates = this.props.squareOrder[i];
            const square = this.props.squares.get(coordinates);
            let letter = undefined;

            if (this.props.placedLetters.has(coordinates)) {
                letter = this.props.placedLetters.get(coordinates);
            }

            if (this.props.playedLetters.has(coordinates)) {
                letter = this.props.playedLetters.get(coordinates);
            }

            squareDisplays.push(
                <SquareDisplay currentGamePhase={this.props.currentGamePhase}
                    squareType={square.squareType}
                    letter={letter}
                    key={coordinates}
                    coordinates={coordinates}
                    isPlayable={this.props.playableSquareCoordinates.has(coordinates)}
                    isPlaced={this.props.placedSquareCoordinates.has(coordinates)}
                    isPlayed={this.props.playedSquareCoordinates.has(coordinates)}
                    squareDisplayCallback={(coordinates) => {
                        this.props.gameBoardCallback(coordinates);
                    }} />
            );
        }

        return (
            <div id="scrabble__board">
                {squareDisplays}
            </div>
        );
    }
}

class PlayerDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="scoreboard__player">
                <p>Name: {this.props.player.name}</p>
                <p>Score: {this.props.player.score}</p>
                <h2>Played Words:</h2>
            </div>
        );
    }
}

class ScoreBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const playerDisplays = [];

        for (let playerId of this.props.playerOrder) {
            const player = this.props.players.get(playerId);

            playerDisplays.push(
                <PlayerDisplay key={player.playerId} player={player} />
            );
        }

        return (
            <div id="page__scoreboard" className="page">
                {playerDisplays}
            </div>
        );
    }
}

class GameStatsDisplay extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="playerInput__stats">
                <p>Current Player: {this.props.currentPlayer.name}</p>
                <p>Current Phase: {this.props.currentGamePhase}</p>
                <p>Turn: {this.props.turn}</p>
                <p>{this.props.message}</p>
            </div>
        );
    }
}

class TileDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`scrabble__tile ${this.props.selected ? 'scrabble__tile--selected' : ''}`}
                onClick={this.props.currentGamePhase === 'place' ? () => {
                    console.log(`selected ${this.props.tileId}`);
                    this.props.TileDisplayCallback(this.props.tileId);
                } : () => {
                    console.log('current game phase is not place');
                }}>
                <h2>{this.props.letter}</h2>
                <p>{this.props.point}</p>
            </div >
        );
    }
}

class CurrentPlayerTilesDisplay extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const tileDisplays = [];

        for (let tile of this.props.currentPlayerTiles) {
            tileDisplays.push(
                <TileDisplay currentGamePhase={this.props.currentGamePhase}
                    key={tile.tileId}
                    tileId={tile.tileId}
                    letter={tile.letter}
                    point={tile.point}
                    selected={this.props.selectedTileId === tile.tileId}
                    TileDisplayCallback={(tileId) => {
                        this.props.currentPlayerTilesDisplayCallback(tileId);
                    }} />
            );
        }
        // TO DO: Implement looking up tileIds
        return (
            <div id="playerInput__tiles">
                {tileDisplays}
            </div>
        );
    }
}

class InputButtonsDisplay extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let buttonChoices = [];

        if (this.props.currentGamePhase === 'draw') {
            buttonChoices = ['draw'];
        } else if (this.props.currentGamePhase === 'play/exchange') {
            buttonChoices = ['play', 'exchange'];
        } else if (this.props.currentGamePhase === 'place') {
            buttonChoices = ['place', 'cancel'];
        } else if (this.props.currentGamePhase === 'end') {
            buttonChoices = ['end'];
        }

        const buttons = buttonChoices.map((choice) => {
            return (
                <button key={choice}
                    onClick={() => {
                        this.props.inputButtonsCallback(choice);
                    }}>
                    {choice}
                </button>
            );
        });

        return (
            <div id="playerInput__buttons">
                {buttons}
            </div>
        );
    }
}

class Scrabble extends React.Component {
    constructor(props) {
        super(props);
        this.gamePhases = [
            new GamePhase({ name: 'play/exchange', message: 'You can place tile(s) on the board or exchange your current tiles.' }),
            new GamePhase({ name: 'place', message: 'Select a tile to be placed then select a square for it to be placed on.' }),
            new GamePhase({ name: 'draw', message: 'Draw as many letters as you played.' }),
            new GamePhase({ name: 'end', message: 'Ending Turn.' })
        ];
        this.currentGamePhaseIndex = 0;

        // These will not be used in child components, no need to track them in state
        this.tiles;
        this.undrawnTileIds;
        this.drawnTileIds = [];

        this.squareOrder;

        this.players;
        this.playerOrder;
        this.currentPlayerIndex = 0;

        this.dictionary;

        this.state = {
            gameState: 'loading',
            currentGamePhaseIndex: 0,
            squares: new Map(),
            playedTileIds: [],
            placedTileIds: [],
            selectedTileId: '',
            currentPlayerId: '',
            turn: 1
        };

        Promise.all([
            new Promise((resolve) => resolve(SetupHelpers.loadTiles())),
            new Promise((resolve) => resolve(SetupHelpers.loadSquares())),
            new Promise((resolve) => resolve(SetupHelpers.loadPlayers())),
            fetch(SETTINGS.dictionaryUrl).then(response => response.text())
        ]).then(([
            tileSetupData,
            squareSetupData,
            playerSetupData,
            dictionaryText
        ]) => {

            this.tiles = tileSetupData.tiles;
            this.undrawnTileIds = tileSetupData.tileOrder;

            this.squareOrder = squareSetupData.squareOrder;

            this.players = playerSetupData.players;
            this.playerOrder = playerSetupData.playerOrder; this.players.forEach((player) => {
                this.drawTile({ player: player });
            });

            this.dictionary = new Set(dictionaryText.split(/\n|\r/g));
            console.log(`dictionary loaded. size = ${this.dictionary.size}`);

            this.setState({
                gameState: 'ready',
                currentPlayerId: this.playerOrder[this.currentPlayerIndex],
                squares: squareSetupData.squares
            });
        }).catch(error => {
            this.setState({
                gameState: 'error'
            });
            console.log(error);
        });
    }

    drawTile({ player = this.players.get(this.state.currentPlayerId) } = {}) {
        let drawCount = SETTINGS.startingTileCount - player.tileIds.size;
        drawCount = Math.min(drawCount, this.undrawnTileIds.length);

        if (drawCount > 0) {
            for (let i = 0; i < drawCount; i++) {
                const randomTileIndex = UtilHelpers.randomInt(1, this.undrawnTileIds.length) - 1;
                const tileId = this.undrawnTileIds[randomTileIndex];

                player.tileIds.add(tileId);
                this.undrawnTileIds.splice(randomTileIndex, 1);
                this.drawnTileIds.push(tileId);
            }
            console.log(`${player.name} drew ${drawCount} tiles, ${this.undrawnTileIds.length} remains.`);
        }
    }

    exchangeTile({ player = this.players.get(this.state.currentPlayerId) } = {}) {
        console.log('exchanging tiles of current player to pool');

        player.tileIds.forEach((tileId) => {
            this.undrawnTileIds.push(tileId);
        });

        player.tileIds.clear();

        this.drawTile(player);
    }

    nextGamePhase(skipNextPhase = false, customMessage) {
        let currentGamePhaseIndex = this.state.currentGamePhaseIndex + 1;
        if (!skipNextPhase) {
            const updatedStateProperties = {};

            if (currentGamePhaseIndex === this.gamePhases.length) {
                console.log('going to next player.')
                currentGamePhaseIndex = 0;
                this.currentPlayerIndex++;

                if (this.currentPlayerIndex === this.playerOrder.length) {
                    this.currentPlayerIndex = 0;
                }

                updatedStateProperties.currentPlayerId = this.playerOrder[this.currentPlayerIndex];
                updatedStateProperties.turn = this.state.turn + 1;
            }

            updatedStateProperties.currentGamePhaseIndex = currentGamePhaseIndex;

            updatedStateProperties.selectedTileId = undefined;

            this.setState(updatedStateProperties, () => {
                console.log(`current game phase is ${this.gamePhases[this.state.currentGamePhaseIndex].name}`);
            });
        } else {
            this.nextGamePhase();
        }
    }

    cancelPlaceGamePhase(customMessage) {
        if (this.gamePhases[this.state.currentGamePhaseIndex] === 'place') {
            this.currentGamePhaseIndex--;
            const updatedStateProperties = {};

            const currentPlayer = this.players.get(this.state.currentPlayerId);

            this.state.placedTileIds.forEach((tileId) => {
                this.tiles.get(tileId).coordinates = undefined;
                currentPlayer.tileIds.add(tileId);
            });

            updatedStateProperties.currentGamePhase = this.gamePhases[this.currentGamePhaseIndex].name;
            updatedStateProperties.placedTileIds = [];
            updatedStateProperties.selectedTileId = undefined;

            this.setState(updatedStateProperties, () => {
                console.log('place cancelled');
            });
        } else {
            console.log('current game phase is not place');
        }
    }

    playPlacedTiles() {
        const boardTiles = new Map();

        const placedSquareCoordinates = [];
        this.state.placedTileIds.forEach((tileId) => {
            const tile = this.tiles.get(tileId);
            boardTiles.set(tile.coordinates, tile);
            placedSquareCoordinates.push(tile.coordinates);
        });

        const playedSquareCoordinates = [];
        this.state.playedTileIds.forEach((tileId) => {
            const tile = this.tiles.get(tileId);
            boardTiles.set(tile.coordinates, tile);
            playedSquareCoordinates.push(tile.coordinates);
        });

        const squareCoordinates = new Set([...placedSquareCoordinates, ...playedSquareCoordinates]);

        // Get every column that a tile was placed on
        const placedColumnIndexes = new Set();
        const placedRowIndexes = new Set();
        placedSquareCoordinates.forEach((coordinates) => {
            const squareColumnRowIndex = GridHelpers.squareCoordinatesToColumnRowIndex(coordinates);
            placedColumnIndexes.add(squareColumnRowIndex.columnIndex);
            placedRowIndexes.add(squareColumnRowIndex.rowIndex);
        });

        let placedWords = [];
        // Checking columns 
        placedColumnIndexes.forEach((columnIndex) => {
            const columnCoordinates = [];
            for (let i = 0; i < SETTINGS.boardLength; i++) {
                columnCoordinates.push(GridHelpers.squareColumnRowIndexToCoordinates(columnIndex, i));
            }

            let squareColumnString = '';
            columnCoordinates.forEach((coordinates) => {
                if (squareCoordinates.has(coordinates)) {
                    squareColumnString += coordinates + '+';
                } else {
                    squareColumnString += ' ';
                }
            });

            const squareColumnWords = squareColumnString.replace(/\s+/g, ' ').trim().split(' ').map((s) => {
                const letterCoordinates = s.substring(0, s.length - 1).split('+');
                let wordMultiplier = 1;
                let word = '';
                let points = 0;

                letterCoordinates.forEach((coordinates) => {
                    const square = this.state.squares.get(coordinates);

                    switch (square.squareType) {
                        case 'dl':
                            console.log(`double letter points at ${coordinates}`);
                            points += boardTiles.get(coordinates).point * 2;
                            break;
                        case 'tl':
                            console.log(`triple letter points at ${coordinates}`);
                            points += boardTiles.get(coordinates).point * 3;
                            break;
                        case 'dw':
                            wordMultiplier *= 2;
                            break;
                        case 'tw':
                            wordMultiplier *= 3;
                            break;
                        default:
                            points += boardTiles.get(coordinates).point;
                    }

                    word += boardTiles.get(coordinates).letter;
                });

                return {
                    word: word,
                    points: points * wordMultiplier,
                    containsPlacedTile: letterCoordinates.reduce((accumulator, coordinates) => {
                        return accumulator || placedSquareCoordinates.indexOf(coordinates) !== -1;
                    }, false),
                    isValidWord: this.dictionary.has(word.toLowerCase())
                };
            }).filter((wordObject) => wordObject.word.length > 1 && wordObject.containsPlacedTile);

            placedWords = [...placedWords, ...squareColumnWords];
        });

        // Checking rows
        placedRowIndexes.forEach((rowIndex) => {
            const rowCoordinates = [];
            for (let i = 0; i < SETTINGS.boardLength; i++) {
                rowCoordinates.push(GridHelpers.squareColumnRowIndexToCoordinates(i, rowIndex));
            }

            let squareRowString = '';
            rowCoordinates.forEach((coordinates) => {
                if (squareCoordinates.has(coordinates)) {
                    squareRowString += coordinates + '+';
                } else {
                    squareRowString += ' ';
                }
            });

            const squareRowWords = squareRowString.replace(/\s+/g, ' ').trim().split(' ').map((s) => {
                const letterCoordinates = s.substring(0, s.length - 1).split('+');
                let wordMultiplier = 1;
                let word = '';
                let points = 0;

                letterCoordinates.forEach((coordinates) => {
                    const square = this.state.squares.get(coordinates);

                    switch (square.squareType) {
                        case 'dl':
                            console.log(`double letter points at ${coordinates}`);
                            points += boardTiles.get(coordinates).point * 2;
                            break;
                        case 'tl':
                            console.log(`triple letter points at ${coordinates}`);
                            points += boardTiles.get(coordinates).point * 3;
                            break;
                        case 'dw':
                            wordMultiplier *= 2;
                            break;
                        case 'tw':
                            wordMultiplier *= 3;
                            break;
                        default:
                            points += boardTiles.get(coordinates).point;
                    }

                    word += boardTiles.get(coordinates).letter;
                });

                return {
                    word: word,
                    points: points * wordMultiplier,
                    containsPlacedTile: letterCoordinates.reduce((accumulator, coordinates) => {
                        return accumulator || placedSquareCoordinates.indexOf(coordinates) !== -1;
                    }, false),
                    isValidWord: this.dictionary.has(word.toLowerCase())
                };
            }).filter((wordObject) => wordObject.word.length > 1 && wordObject.containsPlacedTile);

            placedWords = [...placedWords, ...squareRowWords];
        });

        console.log('placedWords: ');
        console.log(placedWords);

        this.state.placedTileIds.forEach((tileId) => {
            this.state.playedTileIds.push(tileId);
        });

        this.state.placedTileIds = [];
    }

    render() {
        if (this.state.gameState === 'error') {
            return (
                <p>Error</p>
            );
        }
        if (this.state.gameState === 'loading') {
            return (
                <p>Loading...</p>
            );
        } else if (this.state.gameState === 'ready') {
            const currentGamePhase = this.gamePhases[this.state.currentGamePhaseIndex].name;
            const message = this.gamePhases[this.state.currentGamePhaseIndex].message;
            console.log(currentGamePhase);

            // Refract these into functions
            const currentPlayer = this.players.get(this.state.currentPlayerId);
            const currentPlayerTiles = [];

            currentPlayer.tileIds.forEach((tileId) => {
                currentPlayerTiles.push(this.tiles.get(tileId));
            });

            const placedLetters = new Map(); // For GameBoard
            const placedSquareCoordinates = []; // For GameBoard
            this.state.placedTileIds.forEach((tileId) => {
                const tile = this.tiles.get(tileId);
                placedLetters.set(tile.coordinates, tile.letter);
                placedSquareCoordinates.push(tile.coordinates);
            });

            const playedLetters = new Map();
            const playedSquareCoordinates = [];
            this.state.playedTileIds.forEach((tileId) => {
                const tile = this.tiles.get(tileId);
                playedLetters.set(tile.coordinates, tile.letter);
                playedSquareCoordinates.push(tile.coordinates);
            });

            const playableSquareCoordinates = []; // For GameBoard
            if (currentGamePhase === 'place') {
                console.log('finding available squares');
                if (this.state.placedTileIds.length === 0) {
                    if (this.state.playedTileIds.length === 0) {
                        playableSquareCoordinates.push('H|8');
                    } else {
                        this.state.playedTileIds.forEach((tileId) => {
                            const tile = this.tiles.get(tileId);
                            const adjacentCoordinates = GridHelpers.getAdjacentCoordinates(tile.coordinates);

                            if (this.state.squares.has(adjacentCoordinates.up) &&
                                playedSquareCoordinates.indexOf(adjacentCoordinates.up) === -1) {
                                playableSquareCoordinates.push(adjacentCoordinates.up);
                            }
                            if (this.state.squares.has(adjacentCoordinates.down) &&
                                playedSquareCoordinates.indexOf(adjacentCoordinates.down) === -1) {
                                playableSquareCoordinates.push(adjacentCoordinates.down);
                            }
                            if (this.state.squares.has(adjacentCoordinates.left) &&
                                playedSquareCoordinates.indexOf(adjacentCoordinates.left) === -1) {
                                playableSquareCoordinates.push(adjacentCoordinates.left);
                            }
                            if (this.state.squares.has(adjacentCoordinates.right) &&
                                playedSquareCoordinates.indexOf(adjacentCoordinates.right) === -1) {
                                playableSquareCoordinates.push(adjacentCoordinates.right);
                            }
                        });
                    }
                } else {
                    console.log('at least one square is placed');
                    const firstPlacedSquareCoordinates = placedSquareCoordinates[0];
                    const firstPlacedSquare = this.state.squares.get(firstPlacedSquareCoordinates);
                    const squareCoordinates = new Set([...playedSquareCoordinates, ...placedSquareCoordinates]);

                    let placingDirection = 'both';

                    // Second placed square will determine the direction
                    if (this.state.placedTileIds.length > 1) {
                        const secondPlacedSquareCoordinates = placedSquareCoordinates[1];
                        const secondPlacedSquare = this.state.squares.get(secondPlacedSquareCoordinates);

                        if (secondPlacedSquare.columnIndex === firstPlacedSquare.columnIndex) {
                            placingDirection = 'vertical';
                        } else if (secondPlacedSquare.rowIndex === firstPlacedSquare.rowIndex) {
                            placingDirection = 'horizontal';
                        }
                    }

                    // Vertical
                    if (placingDirection === 'vertical' || placingDirection === 'both') {
                        const columnCoordinates = GridHelpers.getColumnFromCoordinates(firstPlacedSquareCoordinates);
                        let squareColumnString = '';

                        columnCoordinates.forEach((coordinates) => {
                            if (squareCoordinates.has(coordinates)) {
                                squareColumnString += coordinates + '+';
                            } else {
                                squareColumnString += ' ';
                            }
                        });
                        const squareColumnGroups = squareColumnString.replace(/\s+/g, ' ').trim().split(' ').map((s) => s.substring(0, s.length - 1).split('+'));
                        const firstPlacedSquareColumnGroup = squareColumnGroups.find((g) => g.indexOf(firstPlacedSquareCoordinates) !== -1);
                        firstPlacedSquareColumnGroup.forEach((coordinates) => {
                            const verticalAdjacentCoordinates = GridHelpers.getVerticalAdjacentCoordinates(coordinates);
                            const up = verticalAdjacentCoordinates.up;
                            const down = verticalAdjacentCoordinates.down;

                            if (!squareCoordinates.has(up)) {
                                playableSquareCoordinates.push(up);
                            }

                            if (!squareCoordinates.has(down)) {
                                playableSquareCoordinates.push(down);
                            }
                        });
                    }
                    // Horizontal
                    if (placingDirection === 'horizontal' || placingDirection === 'both') {
                        const rowCoordinates = GridHelpers.getRowCoordinates(firstPlacedSquareCoordinates);
                        let squareRowString = '';

                        rowCoordinates.forEach((coordinates) => {
                            if (squareCoordinates.has(coordinates)) {
                                squareRowString += coordinates + '+';
                            } else {
                                squareRowString += ' ';
                            }
                        });
                        const squareRowGroups = squareRowString.replace(/\s+/g, " ").trim().split(' ').map((s) => s.substring(0, s.length - 1).split('+'));
                        const firstPlacedSquareRowGroup = squareRowGroups.find((g) => g.indexOf(firstPlacedSquareCoordinates) !== -1);
                        firstPlacedSquareRowGroup.forEach((coordinates) => {
                            const horizontalAdjacentCoordinates = GridHelpers.getHorizontalAdjacentCoordinates(coordinates);
                            const left = horizontalAdjacentCoordinates.left;
                            const right = horizontalAdjacentCoordinates.right;

                            if (!squareCoordinates.has(left)) {
                                playableSquareCoordinates.push(left);
                            }

                            if (!squareCoordinates.has(right)) {
                                playableSquareCoordinates.push(right);
                            }
                        });
                    }
                }
            }

            console.log(playedSquareCoordinates);

            return (
                <div id="scrabble" >
                    <div id="scrabble__game" className="page">
                        <GameBoard currentGamePhase={currentGamePhase}
                            squares={this.state.squares}
                            squareOrder={this.squareOrder}
                            placedLetters={placedLetters}
                            playedLetters={playedLetters}
                            playableSquareCoordinates={new Set(playableSquareCoordinates)}
                            placedSquareCoordinates={new Set(placedSquareCoordinates)}
                            playedSquareCoordinates={new Set(playedSquareCoordinates)}
                            gameBoardCallback={(coordinates) => {
                                // Assume placeTile is never called if no tile is selected
                                console.log(`callback received from GameBoard at ${coordinates}`);
                                if (this.state.selectedTileId !== undefined) {
                                    const updatedStateProperties = {};

                                    const squares = this.state.squares;
                                    const square = this.state.squares.get(coordinates);

                                    square.tileId = this.state.selectedTileId;
                                    squares.set(coordinates, square);
                                    updatedStateProperties.squares = squares;

                                    const tile = this.tiles.get(this.state.selectedTileId);

                                    tile.coordinates = coordinates;
                                    this.tiles.set(this.state.selectedTileId, tile);

                                    const placedTileIds = this.state.placedTileIds;
                                    placedTileIds.push(this.state.selectedTileId);
                                    updatedStateProperties.placedTileIds = placedTileIds;
                                    updatedStateProperties.selectedTileId = undefined;
                                    currentPlayer.tileIds.delete(this.state.selectedTileId);

                                    this.setState(updatedStateProperties, () => {
                                        console.log('tile placed.');
                                    });
                                }
                            }} />
                        <GameStatsDisplay currentGamePhase={currentGamePhase}
                            selectedTileId={this.state.selectedTileId}
                            message={message}
                            currentPlayer={currentPlayer}
                            turn={this.state.turn} />
                        <InputButtonsDisplay currentGamePhase={currentGamePhase}
                            inputButtonsCallback={(choice) => {
                                // Play/exchange -> Place(skip if exchange) -> Draw -> End
                                if (choice === 'play') {
                                    this.nextGamePhase();
                                } else if (choice === 'exchange') {
                                    this.exchangeTile();
                                    this.nextGamePhase({ skipNextPhase: true });
                                } else if (choice === 'place') {
                                    this.playPlacedTiles();
                                    this.nextGamePhase();
                                } else if (choice === 'cancel') {
                                    this.cancelPlaceGamePhase();
                                } else if (choice === 'draw') {
                                    this.drawTile();
                                    this.nextGamePhase();
                                } else if (choice === 'end') {
                                    this.nextGamePhase();
                                }
                            }} />
                        <CurrentPlayerTilesDisplay currentGamePhase={currentGamePhase}
                            selectedTileId={this.state.selectedTileId}
                            placedTileIds={new Set(this.state.placedTileIds)}
                            currentPlayerTiles={currentPlayerTiles}
                            currentPlayerTilesDisplayCallback={(selectedTileId) => {
                                this.setState({ selectedTileId: selectedTileId });
                            }} />
                    </div>
                    <ScoreBoard currentGamePhase={currentGamePhase}
                        players={this.players}
                        playerOrder={this.playerOrder} />
                </div>
            );
        }
    }
}

const loader = document.querySelector('#loader');
ReactDOM.render(<Scrabble />, loader);