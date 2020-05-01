// Take html element pool (array of nodes)

// Just to make it safe and easy to understand
let poolOfLetters = "abcdefghijklmnñopqrstuvwxyz"
let currentPool = ""
// Grid of 10x10
// if you want to acces a place you call it by a point of coordinates (x, y)
// where x is the row, and y is the column. 
// So grid[0][5] is row 1, column 5
let grid = [
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""]
]



// Insert a letter into  the grid.
function insertLetter(letter, row, column) {
    let col = column || Math.round(Math.random(0, 9)*10)
    grid[row][col] = letter;
 }

// Removes a letter from the grid. 
function removeLetter(letter, row, column) {
    grid[row][column] = ""
 }

// Return content of slot
function checkLetter(row, column) {
    return grid[row][column]
 }

// Pick a letter from pool
function pickALetter(pool) { 
    return poolOfLetters[Math.round(Math.random(0, poolOfLetters.length - 1)*10)] 
}

// Add letter to currentPool
function addToCurrentPool(letter){ 
    currentPool =+ letter 
}

// Removes letter from currentPool
function removeLetterFromCurrentPool(letter) {
    let pos = currentPool.lastIndexOf(letter);
    currentPool = currentPool.substring(0, pos) + "" + currentPool.substring(pos + 1) 
}

// create dom element with text in some location
function createAbsoluteText(letter, pos){
    camera.updateMatrixWorld()
    let text = document.createElement('div');
    let vector = toXYCoords(pos)
    text.style.position = 'absolute';
    //text.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    text.style.width = 100;
    text.style.height = 100;
    text.style.backgroundColor = "transparent";
    text.style.color = "white";
    text.style.textTransform = "uppercase";
    text.innerHTML = letter;
    text.style.top = vector.x + 'px';
    text.style.left = vector.y + 'px';
    document.body.appendChild(text);
}

// Manage coordinates for html elements
function toXYCoords(pos) {
    console.log(camera)
    let vector = raycaster.setFromCamera((pos.clone, camera))
    vector.x = (vector.x + 1) / 2 * window.innerWidth;
    vector.y = -(vector.y - 1) / 2 * window.innerHeight;
    return vector;
}




// Testing // to-refactor-code

// Pick a random letter from pool
let letter = pickALetter(poolOfLetters)

// Add letter to currentPool (since this should be ordered, it should be async)
addToCurrentPool(letter) 

// introduce this letter into a random column in the first row of the grid
insertLetter(letter, 0, null)

console.table(grid)



// Three js code
let renderer = new THREE.WebGLRenderer();
var raycaster = new THREE.Raycaster(); // create once
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);

let scene = new THREE.Scene();

//create a blue LineBasicMaterial
let material = new THREE.LineBasicMaterial({ color: 0x0000ff });


for(i=0; i < 9; i++){
    for(j = 0; j < 9; j++) {
        let points = [];
        points.push(new THREE.Vector3(-25 + (i * 5), -25 + (j * 5), 0))
        points.push(new THREE.Vector3(-25 + (i * 5) + 5, -25 + (j * 5), 0))
        points.push(new THREE.Vector3(-25 + (i * 5) + 5, -25 + (j * 5) + 5, 0))
        points.push(new THREE.Vector3(-25 + (i * 5), -25 + (j * 5) + 5, 0))
        points.push(new THREE.Vector3(-25 + (i * 5), -25 + (j * 5), 0))
        
        let center = new THREE.Vector3(-25 + (i * 5) + 2.5, -25 + (j * 5) + 2.5, 0)
        
        if(checkLetter(i, j) != ""){
            console.log(grid[i][j])
            
            createAbsoluteText(grid[i][j], center)
        }
        
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(geometry, material);

        scene.add(line);
    }
}


renderer.render(scene, camera);