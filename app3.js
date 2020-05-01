// TODO: 

// - Corregir bug de primera palabra. Todo debe salir de available words. 
// - Agregar Input handler para escribir palabras
// - Determinar si lo que escribio el usuario es una palabra existente. 
// - Crear funcion que maneje que pasa si es la palabra correcta. 
// - 



// Set some variables
const WORDS = ["carro", "perro", "caro", "enorme", "peligro", "armadillo", "sueño", "ahora", "semana", "año", "hoy", "mañana", "ayer", "calendario", "hora", "minuto", "segundo", "reloj", "usar", "hacer", "ir", "poder", "venir", "reirse", "ver", "lejos", "cerca", "alto", "flaco", "erudito", "otoño", "aleman", "estaño", "helio", "alondra", "esternon", "prueba", "programa", "televisor", "aluminio", "plata", "oro", "enano", "gitante", "experto", "estructura"]
let visibleWords = []
let availableWords = []
let lastWordRow = 19
let gameHasEnded = false
let gridStartX = 200
let gridStartY = 200
let currentTicks = 0
let targetTicks = 15
let currentWord = null
let currentWordBeingGuessed = ""
let currentWordBeingGuessedText = undefined
let wordWasFound = false
let gameScene,
    gameOverScene
    

// just for now
let style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 15,
    fill: "black"
})
    


//Create a Pixi Application
let app = new PIXI.Application({
    width: window.innerWidth,         // default: 800
    height: window.innerHeight,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,       // default: 1
    forceCanvas: true
})

setup()
// Initialize the game sprites, set the game `state` to `play`
// and start the 'gameLoop'

// MAIN GAME FUNCTIONS

function setup(){
    // Creating Scenes
    gameScene = new PIXI.Container();
    app.stage.addChild(gameScene);

    gameOverScene = new PIXI.Container();
    app.stage.addChild(gameOverScene);
    gameOverScene.visible = false;


    // Set up app on DOM
    document.body.appendChild(app.view)

    // Set up renderer
    app.renderer.backgroundColor = 0xf65599
    app.renderer.view.style.position = "absolute"
    app.renderer.view.style.display = "block"
    app.renderer.autoResize = true
    app.renderer.resize(window.innerWidth, window.innerHeight)

    // Create title
    printTitle("Word Tetris!")

    // Print user input legend
    printUserInputLeyend()

    // Add the 'keydown' event listener to our document
    document.addEventListener('keyup', onKeyDown);

    // Create Grid square
    drawTetrisAreaSquare()

    // Create first template words
    let counter = 0
    for (i = WORDS.length; i > 0; i--) {
        if (WORDS[counter] != undefined){
            let squares = []
            for (j = 0; j < WORDS[counter].length; j++) {

                let square = {
                    props: { content: WORDS[counter][j], focus: false, visible: true },
                    pos: { x: gridStartX + j * 30, y: gridStartY - 30 },
                    rectangle: new PIXI.Graphics(),
                    style: style,
                    message: new PIXI.Text(WORDS[counter][j], style)

                }
                squares.push(square)
                //drawGridSquare(square)
            }
            availableWords.push({
                word: WORDS[counter],
                active: true,
                squares: squares,
                row: 0
            })
            counter++
        }
        
    }
    console.log(visibleWords)
    
    

    //set the game state to `play`
    state = play;

    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    
    
    
    //Update the current game state
    state(delta)
}

function play(delta) {
    //All the game logic goes here

    // Check if endgame
    verifyEndGame()
    
    //Runs the current game `state` in a loop and renders the sprites
    currentTicks++
    
    // Move all words down
    if (currentTicks % targetTicks == 0) {
        
        //console.log(currentWord)
        //console.log(lastWordRow)
        if (currentWord == null){
            currentWord = availableWords.pop()
            visibleWords.push(currentWord)
            console.log("Starting the game with : " + currentWord.word)
        }else {
            //console.log("updating position of: " + currentWord.word)
            if (currentWord.row - 1 >= lastWordRow) {
                lastWordRow--
                currentWord = availableWords.pop()
                visibleWords.push(currentWord)
            } else if (currentWord.row - 1 <= lastWordRow) {
                currentWord.squares = currentWord.squares.map((square) => {
                    square.rectangle.y = square.pos.y = square.pos.y + 30
                    if(currentWord.row == 0){
                        drawGridSquare(square)
                    }
                    if (square.props.visible){
                        printLetter(square)
                    }
                    return square
                })
                currentWord.row++
                currentTicks = 0

            }
        }
        
            
    }
    
    // On input handler
    wordWasFound = checkIfWordWasFound()
    printCurrentGuessingWordText(currentWordBeingGuessed)
    
    // Update Score
    if(wordWasFound){
        // Write Word outside 
        
        let letterIndex
        // remove squares
        
        

        // Update scores
        //updateScore(wordScore)
    }
}

function end() {
    //All the code that should run at the end of the game
    gameScene.visible = false
    gameOverScene.visible = true
    
}



// TOOLS

function drawTetrisAreaSquare(){
    let rectangle = new PIXI.Graphics()
    rectangle.lineStyle(1, 0x000000, 1)
    rectangle.drawRect(200, 200, 300, 600)

    gameScene.addChild(rectangle)
}

function drawGridSquare(square){
    if(square.props.content != ""){
        let rectangle = square.rectangle
        rectangle.lineStyle(4, 0xFF3300, 1)
        rectangle.beginFill(0x66CCFF)
        if (square.props.focus) { rectangle.beginFill(0x33FFDD)}
        rectangle.drawRect(0, 0, 30, 30)
        rectangle.endFill()
        rectangle.x = square.pos.x
        rectangle.y = square.pos.y
        gameScene.addChild(rectangle)
        
        //print the letter inside
        printLetter(square)
    }
}

function removeSquaresForever(squares){
    console.log(squares)
    squares.map(square => {
        gameScene.removeChild(square.rectangle)
        printLetter(square, true)
        square.props.visible = false
    })
}


function printTitle(text){
    let style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "white",
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowAngle: Math.PI / 2,
        dropShadowDistance: 2,
    });
    let message = new PIXI.Text(text, style);
    gameScene.addChild(message);
    message.position.set(250, 120);
}

function printUserInputLeyend(){
    let style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "white",
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowAngle: Math.PI / 2,
        dropShadowDistance: 2,
    });
    let message = new PIXI.Text("Estas escribiendo: ", style);
    gameScene.addChild(message);
    message.position.set(650, 420);
}

function printLetter(square, remove){
    let style = square.style
    let message = square.message
    if(!remove){
        gameScene.addChild(message);
        message.position.set(square.pos.x + 10, square.pos.y + 7);
    }else{
        gameScene.removeChild(message);
    }
    
}


function verifyEndGame(){
    // logic to test if game has ended. 
    
    
    // Update gameHasEnded Global
    gameHasEnded = false
    
    // update state
    if (gameHasEnded) { state = end}
}

function updateScore(wordScore){
    score = + wordScore
    if(gameHasEnded){score = 0}
}

function checkIfWordWasFound(currentWordBeingGuessed){
    //console.log(currentWordBeingGuessed)
    // Check valid letter
    let wordsFound = visibleWords.filter( ( word ) => {
        return word.word == currentWordBeingGuessed
    })
    if(wordsFound.length > 0){
        //console.log(wordsFound[0])
        removeSquaresForever(wordsFound[0].squares)
        printCurrentGuessingWordText("")
        return true
    }
    
    // Check if currentWord + letter is found in words starting with currentWord + letter. (memoized)
    // Check if letter is in board
    
    
    return false
}


function onKeyDown(key){
    console.log(key.key)
    
    // Handle all text
    if ("abcdefghijklmnñopqrstuvwxyz".includes(key.key)){
        currentWordBeingGuessed += key.key
        //console.log(currentWordBeingGuessed)
    }

    wordWasFound = checkIfWordWasFound(currentWordBeingGuessed)

    // Handle Space for Speed
    if(key.key == " "){
        // Push the word to the bottom
        currentWord.squares = currentWord.squares.map((square) => {
            square.pos.y = square.pos.y + 30 * (lastWordRow +1 - currentWord.row)
            drawGridSquare(square)
            return square
        })
        currentWord.row = lastWordRow
        // Got to the next word
        lastWordRow--
        currentWord = availableWords.pop()
        visibleWords.push(currentWord)
    }

    // Handle Enter for new Input
    if(key.key == "Enter"){
        currentWordBeingGuessed = ""
        
    }
    // Handle Scape for Pause
    if(key.key == "Scape"){ state = (state == pause) ? play : pause }

}

function printCurrentGuessingWordText(text){
    if (currentWordBeingGuessedText != undefined) {
        gameScene.removeChild(currentWordBeingGuessedText)
    }
    if(text != ""){
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 28,
            fill: "white",
        })
        currentWordBeingGuessedText = new PIXI.Text(text, style)
        gameScene.addChild(currentWordBeingGuessedText)
        currentWordBeingGuessedText.position.set(650, 520)
    }
     
}