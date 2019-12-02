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
    static getColumnCoordinates(coordinates) {
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
                        console.log('current game phase is not play or a tile is already placed on this square');
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
                        console.log('callback from squareDisplay');
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
                <p>Selected Tile Id: {this.props.selectedTileId}</p>
                <p>Id: {this.props.currentPlayer.playerId}</p>
                <p>Current Phase: {this.props.currentGamePhase}</p>
                <p>Turn: {this.props.turn}</p>
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
                        console.log('updating selectedTileId');
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
        this.gamePhases = ['play/exchange', 'place', 'draw', 'end'];
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
            currentGamePhase: this.gamePhases[this.currentGamePhaseIndex],
            gameState: 'loading',
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

    nextGamePhase(skipNextPhase = false) {
        this.currentGamePhaseIndex++;
        if (!skipNextPhase) {
            const updatedStateProperties = {};

            if (this.currentGamePhaseIndex === this.gamePhases.length) {
                console.log('going to next player.')
                this.currentGamePhaseIndex = 0;
                this.currentPlayerIndex++;

                if (this.currentPlayerIndex === this.playerOrder.length) {
                    this.currentPlayerIndex = 0;
                }

                updatedStateProperties.currentPlayerId = this.playerOrder[this.currentPlayerIndex];
                updatedStateProperties.turn = this.state.turn + 1;
            }

            updatedStateProperties.currentGamePhase = this.gamePhases[this.currentGamePhaseIndex];
            this.setState(updatedStateProperties, () => {
                console.log(`current game phase is ${this.state.currentGamePhase} `);
            });
        } else {
            this.nextGamePhase();
        }
    }
    cancelPlaceGamePhase() {
        if (this.state.currentGamePhase === 'place') {
            this.currentGamePhaseIndex--;
            const updatedStateProperties = {};

            const currentPlayer = this.players.get(this.state.currentPlayerId);

            this.state.placedTileIds.forEach((tileId) => {
                this.tiles.get(tileId).coordinates = undefined;
                currentPlayer.tileIds.add(tileId);
            });

            updatedStateProperties.currentGamePhase = this.gamePhases[this.currentGamePhaseIndex];
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
        // Add api check here
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

        const squareCoordinates = [...placedSquareCoordinates, ...playedSquareCoordinates];


        // Api check passed, empty placedTileIds into playedTileIds
        console.log('placedTileIds: ');
        console.log(this.state.placedTileIds);
        this.state.placedTileIds.forEach((tileId) => {
            this.state.playedTileIds.push(tileId);
        });

        this.state.placedTileIds = [];
        console.log('playedTileIds: ');
        console.log(this.state.playedTileIds);
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
            // Refract these into functions
            const currentPlayer = this.players.get(this.state.currentPlayerId);
            const currentPlayerTiles = [];

            console.log(currentPlayer);
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
            if (this.state.currentGamePhase === 'place') {
                if (this.state.placedTileIds.length === 0) {
                    console.log('no square is placed yet');
                    if (this.state.playedTileIds.length === 0) {
                        console.log('no square is played yet');
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
                    console.log('squareCoordinates: ');
                    console.log(squareCoordinates);

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
                        const columnCoordinates = GridHelpers.getColumnCoordinates(firstPlacedSquareCoordinates);
                        let squareColumnString = '';

                        columnCoordinates.forEach((coordinates) => {
                            if (squareCoordinates.has(coordinates)) {
                                squareColumnString += coordinates + '/';
                            } else {
                                squareColumnString += ' ';
                            }
                        });
                        const squareColumnGroups = squareColumnString.replace(/\s+/g, " ").trim().split(' ').map((s) => s.substring(0, s.length - 1).split('/'));
                        console.log('squareColumnGroups: ');
                        console.log(squareColumnGroups);
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
                                squareRowString += coordinates + '/';
                            } else {
                                squareRowString += ' ';
                            }
                        });
                        const squareRowGroups = squareRowString.replace(/\s+/g, " ").trim().split(' ').map((s) => s.substring(0, s.length - 1).split('/'));
                        console.log('squareRowGroups: ');
                        console.log(squareRowGroups);
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


            console.log(`placed: `);
            console.log(placedSquareCoordinates);
            console.log(`playable: `);
            console.log(playableSquareCoordinates);
            console.log(`played: `);
            console.log(playedSquareCoordinates);

            return (
                <div id="scrabble" >
                    <div id="scrabble__game" className="page">
                        <GameBoard currentGamePhase={this.state.currentGamePhase}
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
                        <GameStatsDisplay currentGamePhase={this.state.currentGamePhase}
                            selectedTileId={this.state.selectedTileId}
                            currentPlayer={currentPlayer}
                            turn={this.state.turn} />
                        <InputButtonsDisplay currentGamePhase={this.state.currentGamePhase}
                            inputButtonsCallback={(choice) => {
                                // Draw -> Play/exchange -> Place(skip if exchange) -> End
                                // Play/exchange phase
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
                        <CurrentPlayerTilesDisplay currentGamePhase={this.state.currentGamePhase}
                            selectedTileId={this.state.selectedTileId}
                            placedTileIds={new Set(this.state.placedTileIds)}
                            currentPlayerTiles={currentPlayerTiles}
                            currentPlayerTilesDisplayCallback={(selectedTileId) => {
                                this.setState({ selectedTileId: selectedTileId });
                            }} />
                    </div>
                    <ScoreBoard currentGamePhase={this.state.currentGamePhase}
                        players={this.players}
                        playerOrder={this.playerOrder} />
                </div>
            );
        }
    }
}

const loader = document.querySelector('#loader');
ReactDOM.render(<Scrabble />, loader);