console.clear();
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

const SETTINGS = {
    playerCount: 2,
    startingTileCount: 7
};

class UtilHelpers {
    static squareIndexToCoordinates(index) {
        const col = String.fromCharCode(65 + Math.floor(index % 15)); //65 = 'A'       
        const row = Math.floor(index / 15) + 1;
        return `${col}|${row}`;
    }
    static squareColumnRowIndexToCoordinates(colIndex, rowIndex) {
        const col = String.fromCharCode(65 + colIndex);
        const row = rowIndex + 1;
        console.log(`colIndex:${colIndex} rowIndex:${rowIndex}`);
        return `${col}|${row}`;
    }
    static squareCoordinatesToColumnRowIndex(coordinates) {
        const array = coordinates.split('|');
        const columnIndex = array[0].charCodeAt(0) - 65;
        const rowIndex = array[1] - 1;
        console.log(`${coordinates} => ${columnIndex} ${rowIndex}`);
        return { columnIndex: columnIndex, rowIndex: rowIndex };
    }
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

        for (let i = 0; i < 15 * 15; i++) {
            const coordinates = UtilHelpers.squareIndexToCoordinates(i);
            const type = PREMIUM_SQUARE_DATA.hasOwnProperty(coordinates) ?
                PREMIUM_SQUARE_DATA[coordinates].type : 'np';
            const columnIndex = i % 15;
            const rowIndex = Math.floor(i / 15);
            const newSquare = new Square({ type: type, coordinates: coordinates, columnIndex: columnIndex, rowIndex: rowIndex });

            squares.set(coordinates, newSquare);
            squareOrder.push(coordinates);
        }
        console.log(squares);
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
        this.tileId = undefined; // Tile that this square has on
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
        this.tileIds = []; // Tiles that this player currently holds
    }
}

/* React Components */
class SquareDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`scrabble__square scrabble__square--${this.props.squareType} ${this.props.isPlayable ? 'scrabble__square--playable' : ''} ${this.props.isPlaced ? 'scrabble__square--placed' : ''}`}
                onClick={(this.props.letter === undefined && this.props.currentGamePhase === 'place' && this.props.isPlayable) ?
                    () => {
                        this.props.squareDisplayCallback(this.props.coordinates);
                    } : () => {
                        console.log('current game phase is not play or a tile is already placed on this square');
                        console.log(this.props.currentGamePhase);
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

            squareDisplays.push(
                <SquareDisplay currentGamePhase={this.props.currentGamePhase}
                    squareType={square.squareType}
                    letter={letter}
                    key={coordinates}
                    coordinates={coordinates} // Remove this if unused
                    isPlayable={this.props.playableSquareCoordinates.has(coordinates)}
                    isPlaced={this.props.placedSquareCoordinates.has(coordinates)}
                    squareDisplayCallback={(coordinates) => {
                        console.log('callback from squareDisplay');
                        console.log(this.props.placedLetters);
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
        const playerSetupData = SetupHelpers.loadPlayers();
        const squareSetupData = SetupHelpers.loadSquares();
        const tileSetupData = SetupHelpers.loadTiles();

        // These will not be used in child components, no need to track them in state 
        this.tiles = tileSetupData.tiles;
        this.undrawnTileIds = tileSetupData.tileOrder;
        this.drawnTileIds = [];

        this.playerOrder = playerSetupData.playerOrder;
        this.currentPlayerIndex = 0;
        this.squareOrder = squareSetupData.squareOrder;

        this.gamePhases = ['draw', 'play/exchange', 'place', 'end'];
        this.currentGamePhaseIndex = 0;

        // playerSetupData.players.forEach((player, playerId, map) => {
        //     // player = this.drawTile(player);
        //     // // map.set(playerId, player);
        // });

        this.state = {
            currentGamePhase: this.gamePhases[this.currentGamePhaseIndex],
            players: playerSetupData.players,
            squares: squareSetupData.squares,
            playedTileIds: [],
            placedTileIds: [],
            selectedTileId: undefined,
            currentPlayerId: this.playerOrder[this.currentPlayerIndex],
            turn: 1
        };
    }

    drawTile({ player = this.state.players.get(this.state.currentPlayerId) } = {}) {
        let drawCount = SETTINGS.startingTileCount - player.tileIds.length;
        drawCount = Math.min(drawCount, this.undrawnTileIds.length);

        if (drawCount > 0) {
            for (let i = 0; i < drawCount; i++) {
                const randomTileIndex = UtilHelpers.randomInt(1, this.undrawnTileIds.length) - 1;
                const tileId = this.undrawnTileIds[randomTileIndex];

                player.tileIds.push(tileId);
                this.undrawnTileIds.splice(randomTileIndex, 1);
                this.drawnTileIds.push(tileId);
            }
            console.log(`${player.name} drew ${drawCount} tiles, ${this.undrawnTileIds.length} remains.`);
        }
    }

    exchangeTile({ player = this.state.players.get(this.state.currentPlayerId) } = {}) {
        console.log('exchanging tiles of current player to pool');

        while (player.tileIds.length > 0) {
            this.undrawnTileIds.push(player.tileIds.pop());
        }

        this.drawTile(player);
    }

    updatePlayerState(player, callback) {
        const players = this.state.Players;
        const updateStateProperties = {};

        players.set(player.playerId, player);
        updateStateProperties.players = players;

        if (this.currentPlayerId === player.playerId) {
            updateStateProperties.currentPlayer = player;
        }

        this.setState({ players: players }, callback);
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

            updatedStateProperties.currentGamePhase = this.gamePhases[this.currentGamePhaseIndex];
            updatedStateProperties.placedTiles = new Map();
            updatedStateProperties.selectedTileId = undefined;
            // TO DO: put placed tiles back 

            this.setState(updatedStateProperties, () => {
                console.log('place cancelled');
            });
        } else {
            console.log('current game phase is not place');
        }
    }

    render() {
        // Refract these into functions
        const currentPlayer = this.state.players.get(this.state.currentPlayerId);
        const currentPlayerTiles = [];

        console.log(currentPlayer);
        currentPlayer.tileIds.forEach((tileId) => {
            currentPlayerTiles.push(this.tiles.get(tileId));
        });

        const placedLetters = new Map(); // For GameBoard
        const placedSquareCoordinates = [];
        this.state.placedTileIds.forEach((tileId) => {
            const tile = this.tiles.get(tileId);
            placedLetters.set(tile.coordinates, tile.letter);
            placedSquareCoordinates.push(tile.coordinates);
        });

        const playableSquareCoordinates = new Set();
        if (this.state.currentGamePhase === 'place') {
            console.log('checking for playableSquares');
            if (this.state.playedTileIds.length === 0 && this.state.placedTileIds.length === 0) {
                console.log('no square is placed yet');
                playableSquareCoordinates.add('H|8');
            } else {
                console.log('at least one square is placed');
                if (this.state.placedTileIds.length > 0) {
                    const firstPlacedSquareCoordinates = placedSquareCoordinates[0];
                    const firstPlacedSquare = this.state.squares.get(firstPlacedSquareCoordinates);
                    let placingDirection = undefined;

                    // Second placed square will determine the direction
                    if (this.state.placedTileIds.length > 1) {
                        const secondPlacedSquareCoordinates = placedSquareCoordinates[0];
                        const secondPlacedSquare = this.state.squares.get(secondPlacedSquareCoordinates);

                        if (secondPlacedSquare.rowIndex === firstPlacedSquare.rowIndex) {
                            placingDirection = 'horizontal';
                        } else if (secondPlacedSquare.columnIndex === firstPlacedSquare.columnIndex) {
                            placingDirection = 'vertical';
                        }
                    }

                    placedSquareCoordinates.forEach((coordinates) => {
                        const squareColumnRow = UtilHelpers.squareCoordinatesToColumnRowIndex(coordinates);

                        // Up
                        const upSquareCoordinates = UtilHelpers.squareColumnRowIndexToCoordinates(
                            squareColumnRow.columnIndex, squareColumnRow.rowIndex - 1);
                        console.log(`checking ${upSquareCoordinates}`);
                        if (this.state.squares.has(upSquareCoordinates) &&
                            this.state.placedTileIds.indexOf(upSquareCoordinates) === -1 &&
                            this.state.playedTileIds.indexOf(upSquareCoordinates) === -1 &&
                            (placingDirection === undefined || placingDirection === 'horizontal')) {
                            console.log('square above is available');
                            playableSquareCoordinates.add(upSquareCoordinates);
                        }
                        // Down
                        const downSquareCoordinates = UtilHelpers.squareColumnRowIndexToCoordinates(
                            squareColumnRow.columnIndex, squareColumnRow.rowIndex + 1);
                        console.log(`checking ${downSquareCoordinates}`)
                        if (this.state.squares.has(downSquareCoordinates) &&
                            this.state.placedTileIds.indexOf(downSquareCoordinates) === -1 &&
                            this.state.playedTileIds.indexOf(downSquareCoordinates) === -1 &&
                            (placingDirection === undefined || placingDirection === 'horizontal')) {
                            console.log('square below is available');
                            playableSquareCoordinates.add(downSquareCoordinates);
                        }
                        // Left
                        const leftSquareCoordinates = UtilHelpers.squareColumnRowIndexToCoordinates(
                            squareColumnRow.columnIndex - 1, squareColumnRow.rowIndex);
                        console.log(`checking ${leftSquareCoordinates}`)
                        if (this.state.squares.has(leftSquareCoordinates) &&
                            this.state.placedTileIds.indexOf(leftSquareCoordinates) === -1 &&
                            this.state.playedTileIds.indexOf(leftSquareCoordinates) === -1 &&
                            (placingDirection === undefined || placingDirection === 'vertical')) {
                            console.log('square left is available');
                            playableSquareCoordinates.add(leftSquareCoordinates);
                        }
                        // Right
                        const rightSquareCoordinates = UtilHelpers.squareColumnRowIndexToCoordinates(
                            squareColumnRow.columnIndex + 1, squareColumnRow.rowIndex);
                        console.log(`checking ${rightSquareCoordinates}`)
                        if (this.state.squares.has(rightSquareCoordinates) &&
                            this.state.placedTileIds.indexOf(rightSquareCoordinates) === -1 &&
                            this.state.playedTileIds.indexOf(rightSquareCoordinates) === -1 &&
                            (placingDirection === undefined || placingDirection === 'vertical')) {
                            console.log('square right is available');
                            playableSquareCoordinates.add(rightSquareCoordinates);
                        }

                    });

                    console.log(playableSquareCoordinates);
                }
            }
        }


        return (
            <div id="scrabble">
                <div id="scrabble__game" className="page">
                    <GameBoard currentGamePhase={this.state.currentGamePhase}
                        squares={this.state.squares}
                        placedLetters={placedLetters}
                        squareOrder={this.squareOrder}
                        playableSquareCoordinates={playableSquareCoordinates}
                        placedSquareCoordinates={new Set(placedSquareCoordinates)}
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

                                const tiles = this.tiles;
                                const tile = this.tiles.get(this.state.selectedTileId);

                                tile.coordinates = coordinates;
                                tiles.set(this.state.selectedTileId, tile);
                                updatedStateProperties.tiles = tiles;

                                console.log('PlacedTileId is:');
                                console.log(this.state.placedTileIds);

                                const placedTileIds = this.state.placedTileIds;
                                placedTileIds.push(this.state.selectedTileId);
                                updatedStateProperties.placedTilesIds = placedTileIds;

                                updatedStateProperties.selectedTileId = undefined;

                                this.setState(updatedStateProperties, () => {
                                    console.log('tile placed. current squares are:');
                                    console.log(this.state.squares);
                                    console.log(this.state.placedTileIds);
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

                            // Draw phase
                            if (choice === 'draw') {
                                this.drawTile();
                                this.nextGamePhase();

                                // Play/exchange phase
                            } else if (choice === 'play') {
                                this.nextGamePhase();
                            } else if (choice === 'exchange') {
                                this.exchangeTile();
                                this.nextGamePhase({ skipNextPhase: true });

                                // Place phase (skip if player picked exchange)
                            } else if (choice === 'place') {
                                this.nextGamePhase();
                            } else if (choice === 'cancel') {
                                // TO DO: put all placed tiles back to player
                                this.cancelPlaceGamePhase();

                                // End Phase
                            } else if (choice === 'end') {
                                this.nextGamePhase();
                            }
                        }} />
                    <CurrentPlayerTilesDisplay currentGamePhase={this.state.currentGamePhase}
                        selectedTileId={this.state.selectedTileId}
                        currentPlayerTiles={currentPlayerTiles}
                        currentPlayerTilesDisplayCallback={(selectedTileId) => {
                            this.setState({ selectedTileId: selectedTileId });
                        }} />
                </div>
                <ScoreBoard currentGamePhase={this.state.currentGamePhase}
                    players={this.state.players}
                    playerOrder={this.playerOrder} />
            </div>
        );
    }
}

const loader = document.querySelector('#loader');
ReactDOM.render(<Scrabble />, loader);