const GameManager = {
    CURRENT_TILE_TYPES: 5,
    CURRENT_SCORE: 0,
    MAXIMUM_SCORE: 20,
    TIMER: 20,
    COL: 5,
    ROW: 5,
    TILE_SIZE: 90,
    TILE_MARGIN: 5,
    MATCH_ENDED: false,
    GameScreen: "GameScreen"
};

let gameTimer = "";
let userSelected = "";
const icons = ["fox", "chinchilla", "duck", "bull", "red_panda", "panda", "sloth", "pig", "chicken"];
const color = ["ff8c00", "9932cc", "8b0000", "bdb76b", "e9967a", "483d8b", "2f4f4f", "556b2f", "8fbc8f"];
const grid = document.querySelector("#grid");
const grid_tiles = document.querySelector("#grid_tiles");
let grid_allocation = "";

showWinLoseScreen(false, false, false, false);
showStartMenu(true);
document.querySelector("#grid").classList.add("hide");
document.querySelector("#menuScreen").classList.add("hide");
document.querySelector("#icon").addEventListener("mousedown", menuButton);
document.querySelector("#back").addEventListener("mousedown", backToGame);
document.querySelector("#play").addEventListener("mousedown", playButton);
document.querySelector("#replay").addEventListener("mousedown", replayButton);
document.querySelector("#reset").addEventListener("mousedown", resetButton);

renderMenuUI();

function replayButton() {
    document.querySelector("#startMenu").classList.remove("hide");
    document.querySelector("#grid").classList.add("hide");
    GameManager.MATCH_ENDED = false;
    GameManager.CURRENT_SCORE = 0;
    showWinLoseScreen(false, false, false, false);
    grid_allocation = "";
    document.querySelector("#grid_tiles").replaceChildren();
    document.querySelector("#icon").addEventListener("mousedown", menuButton);
    document.querySelector("#menuScreen").classList.add("hide");
    GameManager.GameScreen = "GameScreen";
    clearInterval(gameTimer);
}

function resetButton() {
    document.querySelector("#startMenu").classList.remove("hide");
    document.querySelector("#grid").classList.add("hide");
    GameManager.MATCH_ENDED = false;
    GameManager.CURRENT_SCORE = 0;
    showWinLoseScreen(false, false, false, false);
    grid_allocation = "";
    document.querySelector("#grid_tiles").replaceChildren();
    document.querySelector("#icon").addEventListener("mousedown", menuButton);
    document.querySelector("#menuScreen").classList.add("hide");
    GameManager.GameScreen = "GameScreen";
    clearInterval(gameTimer);
}

function playButton() {
    document.querySelector("#startMenu").classList.add("hide");
    document.querySelector("#grid").classList.remove("hide");
    document.querySelector("#icon").addEventListener("mousedown", menuButton);

    GameManager.CURRENT_TILE_TYPES = parseInt(document.querySelector("#tiles_menu_output").value);
    GameManager.MAXIMUM_SCORE = parseInt(document.querySelector("#maxscore_menu_output").value);
    GameManager.TIMER = parseInt(document.querySelector("#timer_menu_output").value);
    GameManager.COL = parseInt(document.querySelector("#column_menu_output").value);
    GameManager.ROW = parseInt(document.querySelector("#row_menu_output").value);
    Start();
}

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
}

function renderMenuUI() {
    const value_tiles = document.querySelector("#tiles_menu_output")
    const input_tiles = document.querySelector("#tiles_menu")
    value_tiles.textContent = input_tiles.value
    input_tiles.addEventListener("input", (event) => {
        value_tiles.textContent = event.target.value
    })
    
    const value_maxscore = document.querySelector("#maxscore_menu_output")
    const input_maxscore = document.querySelector("#maxscore_menu")
    value_maxscore.textContent = input_maxscore.value
    input_maxscore.addEventListener("input", (event) => {
        value_maxscore.textContent = event.target.value
    })
    
    const value_timer = document.querySelector("#timer_menu_output")
    const input_timer = document.querySelector("#timer_menu")
    value_timer.textContent = input_timer.value
    input_timer.addEventListener("input", (event) => {
        value_timer.textContent = event.target.value
    })
    
    const value_column = document.querySelector("#column_menu_output")
    const input_column = document.querySelector("#column_menu")
    value_column.textContent = input_column.value
    input_column.addEventListener("input", (event) => {
        value_column.textContent = event.target.value
    })
    
    const value_row = document.querySelector("#row_menu_output")
    const input_row = document.querySelector("#row_menu")
    value_row.textContent = input_row.value
    input_row.addEventListener("input", (event) => {
        value_row.textContent = event.target.value
    })
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

function showWinLoseScreen(menu, rp, l, w) {
    if(menu)
        document.querySelector("#winloseScreen").classList.remove("hide");
    else
        document.querySelector("#winloseScreen").classList.add("hide");

    if(rp)
        document.querySelector("#replay").classList.remove("hide");
    else 
        document.querySelector("#replay").classList.add("hide");

    if(l)
        document.querySelector("#lose").classList.remove("hide");
    else 
        document.querySelector("#lose").classList.add("hide");

    if(w)
        document.querySelector("#win").classList.remove("hide");
    else 
        document.querySelector("#win").classList.add("hide");
}

function showStartMenu(menu) {
    if(menu)
        document.querySelector("#startMenu").classList.remove("hide");
    else
        document.querySelector("#startMenu").classList.add("hide");
}

function createGrid() {
    grid_allocation = new Array(GameManager.ROW).fill(0).map(() => new Array(GameManager.COL).fill(0))

    grid.style.height = (GameManager.ROW * GameManager.TILE_SIZE + (10 * GameManager.ROW)) + "px";
    grid.style.width = (GameManager.COL * GameManager.TILE_SIZE + (10 * GameManager.COL)) + "px";
    
    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            const temp = grid_tiles.appendChild(document.createElement("div"));
            temp.setAttribute("id", "r" + a + "-c" + b);
            temp.setAttribute("class", "tiles");
            temp.style.height = GameManager.TILE_SIZE + "px";
            temp.style.width = GameManager.TILE_SIZE + "px";
            temp.style.margin = GameManager.TILE_MARGIN + "px";
            temp.addEventListener("mousedown", onMouseDownSelect);
        }
    }
}

function menuButton() {
    const t = document.getElementsByClassName("tiles");
    if(GameManager.GameScreen == "GameScreen") {
        document.querySelector("#menuScreen").classList.remove("hide");
        const t = document.getElementsByClassName("tiles");
        for (let i = 0; i < t.length; i++) {
            t[i].removeEventListener("mousedown", onMouseDownSelect);
        }
        GameManager.GameScreen = "MenuScreen";
    }
}

function backToGame() {
    const t = document.getElementsByClassName("tiles");
        if(GameManager.GameScreen == "MenuScreen") {
            document.querySelector("#menuScreen").classList.add("hide");
            if(GameManager.MATCH_ENDED == false) {
                for (let i = 0; i < t.length; i++) {
                    t[i].addEventListener("mousedown", onMouseDownSelect);
                }
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

function changeStartProperties(tot, ms, timer, c, r) {
    if(tot >= 3 && tot <= 8)
        return true;
    else {
        console.log("Wrong tile type amount");
        return true;
    }
    
    if(ms >= 3 && ms <= 8)
        return true;
    else {
        console.log("Wrong tile type amount");
        return true;
    }
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
    gameTimer = setInterval(timer, 1000);
}

function checkWinCondition() {
    if(GameManager.MATCH_ENDED == false) {
        const t = document.getElementsByClassName("tiles");

        if(GameManager.CURRENT_SCORE >= GameManager.MAXIMUM_SCORE) {
            console.log("You win!");

            showWinLoseScreen(true, true, false, true)
    
            for (let i = 0; i < t.length; i++) {
                t[i].removeEventListener("mousedown", onMouseDownSelect);
            }
            clearInterval(gameTimer);
            document.querySelector("#menuScreen").classList.add("hide");
            document.querySelector("#icon").removeEventListener("mousedown", menuButton);
            GameManager.MATCH_ENDED = true;
        }
        else if(GameManager.TIMER == 0) {
            console.log("You lose!");

            showWinLoseScreen(true, true, true, false)
    
            for (let i = 0; i < t.length; i++) {
                t[i].removeEventListener("mousedown", onMouseDownSelect);
            }
            clearInterval(gameTimer);
            document.querySelector("#menuScreen").classList.add("hide");
            document.querySelector("#icon").removeEventListener("mousedown", menuButton);
            document.querySelector("#replay").addEventListener("mousedown", replayButton);
            GameManager.MATCH_ENDED = true;
        }
    }
}