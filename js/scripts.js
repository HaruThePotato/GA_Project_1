const GameManager = {
    CURRENT_TILE_TYPES: 5,
    CURRENT_SCORE: 0,
    MAXIMUM_SCORE: 50,
    MOVES_TAKEN: 0,
    LEVEL: 1,
    TIMER: 60,
    COL: 5,
    ROW: 5,
    TILE_SIZE: 90,
    TILE_MARGIN: 5,
    MATCH_ENDED: false,
    GameScreen: "GameScreen"
};

const gameTimer = setInterval(timer, 1000);
let userSelected = "";
const icons = ["fox", "chinchilla", "duck", "bull", "red_panda", "panda", "sloth", "pig", "chicken"];
const color = ["ff8c00", "9932cc", "8b0000", "bdb76b", "e9967a", "483d8b", "2f4f4f", "556b2f", "8fbc8f"];
const grid = document.querySelector("#grid");
const grid_allocation = new Array(GameManager.ROW).fill(0).map(() => new Array(GameManager.COL).fill(0));

document.querySelector("#pauseScreen").classList.add("hide");

document.querySelector("#icon").addEventListener("mousedown", pauseButton);
document.querySelector("#back").addEventListener("mousedown", backToGame);

function onMouseDownSelect() {

    const temp = this.getAttribute("id").split("-");
    temp[0] = temp[0].replace("r", "");
    temp[1] = temp[1].replace("c", "");

    if(userSelected == "") {
        resetGridMouseDown();
        this.style.borderColor = "red";
        this.style.borderStyle = "solid";
    
        if(temp[0] >= 0 && temp[0] < (GameManager.ROW - 1)) {
            document.querySelector("#r" + (parseInt(temp[0]) + 1) + "-c" + parseInt(temp[1])).style.borderColor = "red";
            document.querySelector("#r" + (parseInt(temp[0]) + 1) + "-c" + parseInt(temp[1])).style.borderStyle = "solid";
        }
        if(temp[0] <= (GameManager.ROW - 1) && temp[0] > 0) {
            document.querySelector("#r" + (parseInt(temp[0]) - 1) + "-c" + parseInt(temp[1])).style.borderColor = "red";
            document.querySelector("#r" + (parseInt(temp[0]) - 1) + "-c" + parseInt(temp[1])).style.borderStyle = "solid";
        }
        if(temp[1] >= 0 && temp[1] < (GameManager.COL - 1)) {
            document.querySelector("#r" + (parseInt(temp[0])) + "-c" + (parseInt(temp[1]) + 1)).style.borderColor = "red";
            document.querySelector("#r" + (parseInt(temp[0])) + "-c" + (parseInt(temp[1]) + 1)).style.borderStyle = "solid";
        }
        if(temp[1] <= (GameManager.COL - 1) && temp[1] > 0) {
            document.querySelector("#r" + (parseInt(temp[0])) + "-c" + (parseInt(temp[1]) - 1)).style.borderColor = "red";
            document.querySelector("#r" + (parseInt(temp[0])) + "-c" + (parseInt(temp[1]) - 1)).style.borderStyle = "solid";
        }

        userSelected = this;
    }
    else {
        if((parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", "")) - 1) == temp[0] &&
        (parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", ""))) == temp[1]) {
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp, "up");
            setTimeout(userMatch, 1000, "up");
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", "")) + 1) == temp[0] &&
            (parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", ""))) == temp[1]) {
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp, "down");
            setTimeout(userMatch, 1000, "down");
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", "")) - 1) == temp[1] &&
        (parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", ""))) == temp[0]) {
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp, "left");
            setTimeout(userMatch, 1000, "left");
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", "")) + 1) == temp[1] &&
        (parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", ""))) == temp[0]) {
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp, "right");
            setTimeout(userMatch, 1000, "right");
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", ""))) == temp[1] &&
        (parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", ""))) == temp[0]) {
        }
        resetGridMouseDown();
        userSelected = "";
    }
}

function swapTiles(a, b, temp, direction) {
    grid_allocation[temp[0]][temp[1]] = a;
    grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")] = b;

    if(checkPattern() == "") {
        const t = document.getElementsByClassName("tiles");
        for (let i = 0; i < t.length; i++) {
            t[i].removeEventListener("mousedown", onMouseDownSelect);
        }
        setTimeout(swapBack, 1000, a, b, temp, direction);
    }

    render();
}

function swapBack(a, b, temp, direction) {
    grid_allocation[temp[0]][temp[1]] = b;

    switch (direction) {
        case "up":
            grid_allocation[parseInt(temp[0]) + 1][temp[1]] = a;
            break;
        case "down":
            grid_allocation[parseInt(temp[0]) - 1][temp[1]] = a;
            break;
        case "left":
            grid_allocation[temp[0]][parseInt(temp[1]) + 1] = a;
            break;
        case "right":
            grid_allocation[temp[0]][parseInt(temp[1]) - 1] = a;
            break;
        default:
            break;
    }

    if(GameManager.MATCH_ENDED == false) {
        const t = document.getElementsByClassName("tiles");
        for (let i = 0; i < t.length; i++) {
            t[i].addEventListener("mousedown", onMouseDownSelect);
        }
    }

    render();
}

function render() {
    /*for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            document.querySelector("#r" + a + "-c" + b).style.backgroundImage = "url('images/" + icons[grid_allocation[a][b]] + ".png')";
        }
    }*/

    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            document.querySelector("#r" + a + "-c" + b).style.backgroundColor = "#" + color[grid_allocation[a][b]];
        }
    }
    
    document.querySelector("#victory_score").innerHTML = "GOAL: " + GameManager.MAXIMUM_SCORE;
    document.querySelector("#score").innerHTML = "SCORE: " + GameManager.CURRENT_SCORE;
    document.querySelector("#timer").innerHTML = "TIMER: " + GameManager.TIMER;
    document.querySelector("#endScreenScore").innerHTML = "SCORE: " + GameManager.CURRENT_SCORE;
    document.querySelector("#endScreenGoal").innerHTML = "GOAL: " + GameManager.MAXIMUM_SCORE;
    //document.querySelector("#level").innerHTML = "LEVEL: " + GameManager.LEVEL;
}

function checkPattern() {
    let match_times = 0;
    const direction = []; // UP DOWN LEFT RIGHT
    const tempArray = [];

    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            if(a < GameManager.ROW - 1) {
                if(grid_allocation[a][b] == grid_allocation[a + 1][b]) {
                    direction[1] = true;
                    match_times++;
                }
            }
            if(a > 0) {
                if(grid_allocation[a][b] == grid_allocation[a - 1][b]) {
                    direction[0] = true;
                    match_times++;
                }
            }
            if(b < GameManager.COL - 1){
                if(grid_allocation[a][b] == grid_allocation[a][b + 1]) {
                    direction[3] = true;
                    match_times++;
                }
            }
            if(b > 0){
                if(grid_allocation[a][b] == grid_allocation[a][b - 1]) {
                    direction[2] = true;
                    match_times++;
                }
            }

            if(match_times > 1) {
                
                tempArray.push(a + ", " + b);
                if(a < GameManager.ROW - 1) {
                    if(grid_allocation[a][b] == grid_allocation[a + 1][b]) {
                        if(direction[1]) {
                            tempArray.push((a + 1) + ", " + b);
                        }
                    }
                }
                if(a > 0) {
                    if(grid_allocation[a][b] == grid_allocation[a - 1][b]) {
                        if(direction[0]) {
                            tempArray.push((a - 1) + ", " + b);
                        }
                    }
                }
                if(b < GameManager.COL - 1) {
                    if(grid_allocation[a][b] == grid_allocation[a][b + 1]) {
                        if(direction[3]) {
                            tempArray.push(a + ", " + (b + 1));
                        }
                    }
                }
                if(b > 0) {
                    if(grid_allocation[a][b] == grid_allocation[a][b - 1]) {
                        if(direction[2]) {
                            tempArray.push(a + ", " + (b - 1));
                        }
                    }
                }     
                for (let i = 0; i < direction.length; i++){
                    direction[i] = false;
                }
            }
            match_times = 0;
        }
    }
    return tempArray.filter(returnUnique);
}


function timer() {
        if(GameManager.TIMER > 1)
            GameManager.TIMER = GameManager.TIMER - 1;
        else {
            GameManager.TIMER = GameManager.TIMER - 1;
            clearInterval(gameTimer);
            checkWinCondition();
        }

        render();
}

function createGrid() {
    grid.style.height = (GameManager.ROW * GameManager.TILE_SIZE + (10 * GameManager.ROW)) + "px";
    grid.style.width = (GameManager.COL * GameManager.TILE_SIZE + (10 * GameManager.COL)) + "px";
    
    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            const temp = grid.appendChild(document.createElement("div"));
            temp.setAttribute("id", "r" + a + "-c" + b);
            temp.setAttribute("class", "tiles");
            temp.style.height = GameManager.TILE_SIZE + "px";
            temp.style.width = GameManager.TILE_SIZE + "px";
            temp.style.margin = GameManager.TILE_MARGIN + "px";
            temp.addEventListener("mousedown", onMouseDownSelect);
        }
    }
}

function pauseButton() {
    const t = document.getElementsByClassName("tiles");
    if(GameManager.GameScreen == "GameScreen") {
        

        document.querySelector("#pauseScreen").classList.remove("hide");
        const t = document.getElementsByClassName("tiles");
        for (let i = 0; i < t.length; i++) {
            t[i].removeEventListener("mousedown", onMouseDownSelect);
        }
        GameManager.GameScreen = "PauseScreen";
    }
}

function backToGame() {
    const t = document.getElementsByClassName("tiles");

    if(GameManager.GameScreen == "PauseScreen") {

        
        document.querySelector("#pauseScreen").classList.add("hide");
        for (let i = 0; i < t.length; i++) {
            t[i].addEventListener("mousedown", onMouseDownSelect);
        }
        GameManager.GameScreen = "GameScreen";
    }
}

function resetGridMouseDown() {
    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            document.querySelector("#r" + a + "-c" + b).style.borderStyle = "none";
        }
    }
}

function returnUnique(value, index, array) {
    return array.indexOf(value) === index;
}

function fillGrid() {
    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            const temp = random(GameManager.CURRENT_TILE_TYPES)
            grid_allocation[a][b] = temp;
            document.querySelector("#r" + a + "-c" + b).style.backgroundColor = "#" + color[grid_allocation[a][b]];
            //document.querySelector("#r" + a + "-c" + b).style.backgroundImage = "url('images/" + icons[temp] + ".png')";
            document.querySelector("#r" + a + "-c" + b).style.backgroundRepeat = "no-repeat";
            document.querySelector("#r" + a + "-c" + b).style.backgroundPosition = "center";
            document.querySelector("#r" + a + "-c" + b).style.backgroundSize = "70%";
            document.querySelector("#r" + a + "-c" + b).style.boxSizing = "border-box";
            document.querySelector("#r" + a + "-c" + b).style.borderWidth = "5px";
        }
    }
    while(checkPattern() != "") {
        refillGrid(checkPattern());
    }
}

function refillGrid(cp) {
    for (let i = 0; i < cp.length; i++) {
       grid_allocation[cp[i].split(", ")[0]][cp[i].split(", ")[1]] = random(GameManager.CURRENT_TILE_TYPES);
    }
    render();
}

function userMatch(direction) {
    GameManager.CURRENT_SCORE += checkPattern().length;
    let temp = [];
    temp = checkPattern();

    while(checkPattern() != "") {
        refillGrid(temp);
    }

    if(temp == "") {
        return true;
    }

    render();
    checkWinCondition();
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function Start() {
    createGrid();
    fillGrid();
}

function checkWinCondition() {
    if(GameManager.MATCH_ENDED == false) {
        const t = document.getElementsByClassName("tiles");

        if(GameManager.CURRENT_SCORE >= GameManager.MAXIMUM_SCORE) {
            console.log("You win!");
    
            for (let i = 0; i < t.length; i++) {
                t[i].removeEventListener("mousedown", onMouseDownSelect);
            }
            GameManager.MATCH_ENDED = true;
        }
        else if(GameManager.TIMER == 0) {
            console.log("You lose!");
    
            for (let i = 0; i < t.length; i++) {
                t[i].removeEventListener("mousedown", onMouseDownSelect);
            }
            GameManager.MATCH_ENDED = true;
        }
    }
}

Start();

// PSEUDO CODE
// 3. RESET PATTERN TO PREVIOUS BOARD
// 5. LOSE CONDITION: TIMER RUNS OUT OF TIME - PLAYER TERMINATES GAME