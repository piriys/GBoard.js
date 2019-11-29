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
    'D1': { type: 'dl' },
    'L1': { type: 'dl' },
    'G3': { type: 'dl' },
    'I3': { type: 'dl' },
    'A4': { type: 'dl' },
    'H4': { type: 'dl' },
    'O4': { type: 'dl' },
    'C7': { type: 'dl' },
    'G7': { type: 'dl' },
    'I7': { type: 'dl' },
    'M7': { type: 'dl' },
    'D8': { type: 'dl' },
    'L8': { type: 'dl' },
    'C9': { type: 'dl' },
    'G9': { type: 'dl' },
    'I9': { type: 'dl' },
    'M9': { type: 'dl' },
    'A12': { type: 'dl' },
    'H12': { type: 'dl' },
    'O12': { type: 'dl' },
    'G13': { type: 'dl' },
    'I13': { type: 'dl' },
    'D15': { type: 'dl' },
    'L15': { type: 'dl' },
    // Triple letter
    'F2': { type: 'tl' },
    'J2': { type: 'tl' },
    'B6': { type: 'tl' },
    'F6': { type: 'tl' },
    'J6': { type: 'tl' },
    'N6': { type: 'tl' },
    'B10': { type: 'tl' },
    'F10': { type: 'tl' },
    'J10': { type: 'tl' },
    'N10': { type: 'tl' },
    'F14': { type: 'tl' },
    'J14': { type: 'tl' },
    // Double word
    'B2': { type: 'dw' },
    'N2': { type: 'dw' },
    'C3': { type: 'dw' },
    'M3': { type: 'dw' },
    'D4': { type: 'dw' },
    'L4': { type: 'dw' },
    'E5': { type: 'dw' },
    'K5': { type: 'dw' },
    'H8': { type: 'dw' },
    'E11': { type: 'dw' },
    'K11': { type: 'dw' },
    'D12': { type: 'dw' },
    'L12': { type: 'dw' },
    'C13': { type: 'dw' },
    'M13': { type: 'dw' },
    'B14': { type: 'dw' },
    'N14': { type: 'dw' },
    // Triple word 
    'A1': { type: 'tw' },
    'H1': { type: 'tw' },
    'O1': { type: 'tw' },
    'A8': { type: 'tw' },
    'O8': { type: 'tw' },
    'A15': { type: 'tw' },
    'H15': { type: 'tw' },
    'O15': { type: 'tw' }
};

const SETTINGS = {
    playerCount: 2,
    startingTileCount: 7
};

class UtilHelpers {
    static squareIndexToCoordinates(index) {
        const row = Math.floor(index / 15) + 1;
        const col = String.fromCharCode(65 + Math.floor(index % 15)); //65 = 'A'
        return `${col}${row}`;
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
            const column = i % 15;
            const row = Math.floor(i / 15);
            const newSquare = new Square({ type: type, coordinates: coordinates, row: row, column: column });

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
    constructor({ coordinates, row, column, type = 'np' } = {}) {
        this.coordinates = coordinates;
        this.row = row;
        this.column = column;
        this.squareType = type;
        this.letter = undefined;
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
        this.state = {
            letter: undefined
        }
    }

    render() {
        return (
            <div className={`scrabble__square scrabble__square--${this.props.squareType}`}
                onClick={(this.state.letter === undefined && this.props.currentGamePhase === 'play') ?
                    () => {
                        this.setState({ letter: 'X' }, () => {
                            this.props.squareDisplayCallback(this.state.letter);
                        });
                    } : () => {
                        console.log('current game phase is not play or a tile is already placed on this square');
                        console.log(this.props.currentGamePhase);
                    }}>
                <p>{this.props.coordinates}</p>
                <p>{this.state.letter}</p>
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

            squareDisplays.push(
                <SquareDisplay currentGamePhase={this.props.currentGamePhase}
                    squareType={square.squareType}
                    letter={square.letter}
                    key={coordinates}
                    coordinates={coordinates} // Remove this if unused
                    squareDisplayCallback={(letter) => {
                        // Modify corresponding square object then callback to Scrabble
                        const square = this.props.squares[coordinates];
                        square.letter = letter;
                        this.props.gameBoardCallback(square, 'placeTile');
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

class TileDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="scrabble__tile"
                onClick={() => { }}>
                <h2>{this.props.tile.letter}</h2>
                <p>{this.props.tile.point}</p>
            </div>
        );
    }
}

class CurrentPlayerStats extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="playerInput__stats">
                <p>Current Player: {this.props.currentPlayer.name}</p>
                <p>Id: {this.props.currentPlayer.playerId}</p>
                <p>Current Phase: {this.props.currentGamePhase}</p>
                <p>Turn: {this.props.turn}</p>
            </div>
        );
    }
}

class CurrentPlayerTiles extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const tileDisplays = [];
        for (let tile of this.props.currentPlayerTiles) {
            tileDisplays.push(
                <TileDisplay key={tile.tileId}
                    tile={tile} />
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

class InputButtons extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let buttonEvents = [];

        if (this.props.currentGamePhase === 'draw') {
            buttonEvents = ['draw'];
        } else if (this.props.currentGamePhase === 'play/exchange') {
            buttonEvents = ['play', 'exchange'];
        } else if (this.props.currentGamePhase === 'place') {
            buttonEvents = ['place', 'cancel'];
        } else if (this.props.currentGamePhase === 'end') {
            buttonEvents = ['end'];
        }

        const buttons = buttonEvents.map((event) => {
            return (
                <button key={event}
                    onClick={() => {
                        this.props.inputButtonsCallback(event);
                    }}>
                    {event}
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

        playerSetupData.players.forEach((player, playerId, map) => {
            // player = this.drawTile(player);
            // // map.set(playerId, player);
        });

        this.state = {
            currentGamePhase: this.gamePhases[this.currentGamePhaseIndex],
            players: playerSetupData.players,
            squares: squareSetupData.squares,
            playedTileIds: new Map(),
            placedTileIds: new Map(),
            availableSquareCoordinates: new Set(),
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
            console.log(`${player.name} drew ${drawCount} tiles. ${this.undrawnTileIds.length} remains.`);
        }
    }

    exchangeTile({ player = this.state.players.get(this.state.currentPlayerId) } = {}) {
        console.log('exchanging tiles of current player to pool');

        while (player.tileIds.length > 0) {
            this.undrawnTileIds.push(player.tileIds.pop());
        }
        console.log(this.undrawnTileIds);
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
                console.log(`current game phase is ${this.state.currentGamePhase}`);
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
            // TO DO: put placed tiles back 

            this.setState(updatedStateProperties, () => {
                console.log('place cancelled');
            });
        } else {
            console.log('current game phase is not place');
        }
    }

    render() {
        const currentPlayer = this.state.players.get(this.state.currentPlayerId);
        const currentPlayerTiles = [];
        console.log(currentPlayer);
        for (let tileId of currentPlayer.tileIds) {
            console.log(`tile: ${tileId}`);
            currentPlayerTiles.push(this.tiles.get(tileId));
        }

        return (
            <div id="scrabble">
                <div id="scrabble__game" className="page">
                    <GameBoard currentGamePhase={this.state.currentGamePhase}
                        squares={this.state.squares}
                        squareOrder={this.squareOrder}
                        gameBoardCallback={(square, event) => {
                            if (event === 'placeTile') {
                                const squares = this.state.squares;
                                squares.set(square.coordinates, square);

                                this.setState({ squares: squares }, () => {
                                    console.log('tile placed. current squares is:');
                                    console.log(this.state.squares);
                                });
                            }
                        }} />
                    <CurrentPlayerStats currentGamePhase={this.state.currentGamePhase}
                        currentPlayer={currentPlayer}
                        turn={this.state.turn} />
                    <InputButtons currentGamePhase={this.state.currentGamePhase}
                        inputButtonsCallback={(event) => {
                            // Draw -> Play/exchange -> Place(skip if exchange) -> End

                            // Draw phase
                            if (event === 'draw') {
                                this.drawTile();
                                this.nextGamePhase();

                                // Play/exchange phase
                            } else if (event === 'play') {
                                this.nextGamePhase();
                            } else if (event === 'exchange') {
                                this.exchangeTile();
                                this.nextGamePhase({ skipNextPhase: true });

                                // Place phase (skip if player picked exchange)
                            } else if (event === 'place') {
                                this.nextGamePhase();
                            } else if (event === 'cancel') {
                                // TO DO: put all placed tiles back to player
                                this.cancelPlaceGamePhase();

                                // End Phase
                            } else if (event === 'end') {
                                this.nextGamePhase();
                            }
                        }} />
                    <CurrentPlayerTiles currentPlayerTiles={currentPlayerTiles} />
                </div>
                <ScoreBoard currentGamePhase={this.state.currentGamePhase}
                    players={this.state.players}
                    playerOrder={this.playerOrder}
                    scoreBoardCallback={(players) => {
                        this.setState({ players: players }, () => {
                            console.log(`ScoreBoard callback, player state of Scrabble is:`);
                            console.log(this.state.players);
                        });
                    }} />
            </div>
        );
    }
}

const loader = document.querySelector('#loader');
ReactDOM.render(<Scrabble />, loader);