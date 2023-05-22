const GameManager = {
    CURRENT_TILE_TYPES: 8,
    CURRENT_SCORE: 0,
    MAXIMUM_SCORE: 10,
    MOVES_TAKEN: 0,
    LEVEL: 1,
    TIMER: 100,
    COL: 8,
    ROW: 8,
    TILE_SIZE: 90,
    TILE_MARGIN: 5
};

let userSelected = "";
const icons = ["fox", "chinchilla", "duck", "bull", "red_panda", "panda", "sloth", "pig", "chicken"];
const color = ["9F8170", "C51E3A", "FFBF00", "FDBCB4", "7BA05B", "0D98BA", "9966CC", "AB274F", "BA160C"];
const grid = document.querySelector("#grid");
const grid_allocation = new Array(GameManager.ROW).fill(0).map(() => new Array(GameManager.COL).fill(0));

function onMouseDownSelect() {

    const temp = this.getAttribute("id").split("-");
    temp[0] = temp[0].replace("r", "");
    temp[1] = temp[1].replace("c", "");

    if(userSelected == "") {
        resetGridMouseDown();
        //this.style.backgroundColor = "orange";
    
        if(temp[0] >= 0 && temp[0] < (GameManager.ROW - 1)) {
            //document.querySelector("#r" + (parseInt(temp[0]) + 1) + "-c" + parseInt(temp[1])).style.backgroundColor = "green";
        }
        if(temp[0] <= (GameManager.ROW - 1) && temp[0] > 0) {
            //document.querySelector("#r" + (parseInt(temp[0]) - 1) + "-c" + parseInt(temp[1])).style.backgroundColor = "green";
        }
        if(temp[1] >= 0 && temp[1] < (GameManager.COL - 1)) {
            //document.querySelector("#r" + (parseInt(temp[0])) + "-c" + (parseInt(temp[1]) + 1)).style.backgroundColor = "green";
        }
        if(temp[1] <= (GameManager.COL - 1) && temp[1] > 0) {
            //document.querySelector("#r" + (parseInt(temp[0])) + "-c" + (parseInt(temp[1]) - 1)).style.backgroundColor = "green";
        }

        userSelected = this;
    }
    else {
        if((parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", "")) + 1) == temp[0] &&
            (parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", ""))) == temp[1]) {
            console.log("DOWN");
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp);
            userMatch();
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", "")) - 1) == temp[0] &&
        (parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", ""))) == temp[1]) {
            console.log("UP");
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp);
            userMatch();
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", "")) + 1) == temp[1] &&
        (parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", ""))) == temp[0]) {
            console.log("RIGHT");
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp);
            userMatch();
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", "")) - 1) == temp[1] &&
        (parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", ""))) == temp[0]) {
            console.log("LEFT");
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp);
            userMatch();
        }
        if((parseInt(userSelected.getAttribute("id").split("-")[1].replace("c", ""))) == temp[1] &&
        (parseInt(userSelected.getAttribute("id").split("-")[0].replace("r", ""))) == temp[0]) {
            console.log("MIDDLE");
            swapTiles(grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")], grid_allocation[temp[0]][temp[1]], temp);
        }
        resetGridMouseDown();
        userSelected = "";
    }
}

function swapTiles(a, b, temp) {
    grid_allocation[temp[0]][temp[1]] = a;
    grid_allocation[userSelected.getAttribute("id").split("-")[0].replace("r", "")][userSelected.getAttribute("id").split("-")[1].replace("c", "")] = b;
    render();
}

function render() {
    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            document.querySelector("#r" + a + "-c" + b).style.backgroundImage = "url('images/" + icons[grid_allocation[a][b]] + ".png')";
        }
    }

    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            document.querySelector("#r" + a + "-c" + b).style.backgroundColor = "#" + color[grid_allocation[a][b]];
        }
    }

    document.querySelector("#score").innerHTML = "SCORE: " + GameManager.CURRENT_SCORE;
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
                //console.log(a + ", " + b + " - A");

                if(a < GameManager.ROW - 1) {
                    if(grid_allocation[a][b] == grid_allocation[a + 1][b]) {
                        if(direction[1]) {
                            tempArray.push((a + 1) + ", " + b);
                            //console.log((a + 1) + ", " + b + " - B");
                        }
                    }
                }

                if(a > 0) {
                    if(grid_allocation[a][b] == grid_allocation[a - 1][b]) {
                        if(direction[0]) {
                            tempArray.push((a - 1) + ", " + b);
                            //console.log((a - 1) + ", " + b + " - C");
                        }
                    }
                }

                if(b < GameManager.COL - 1) {
                    if(grid_allocation[a][b] == grid_allocation[a][b + 1]) {
                        if(direction[3]) {
                            tempArray.push(a + ", " + (b + 1));
                            //console.log(a + ", " + (b + 1) + " - D");
                        }
                    }
                }

                if(b > 0) {
                    if(grid_allocation[a][b] == grid_allocation[a][b - 1]) {
                        if(direction[2]) {
                            tempArray.push(a + ", " + (b - 1));
                            //console.log(a + ", " + (b - 1) + " - E");
                        }
                    }
                }     

                for (let i = 0; i < direction.length; i++)
                    direction[i] = false;
            }
            match_times = 0;
        }

    }
    //console.log(tempArray.filter(returnUnique) + "\n\n\n");
    return tempArray.filter(returnUnique);
}



//function onMouseUp() {
//    this.style.backgroundColor = "purple";
//}

//function onHoverEnter() {
//    this.style.backgroundColor = "purple";
//}

//function onHoverOut() {
//    this.style.backgroundColor = "red";
//}

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
            //temp.addEventListener("mouseup", onMouseUp);
            //temp.addEventListener("mouseenter", onHoverEnter);
            //temp.addEventListener("mouseout", onHoverOut);
        }
    }
}

function resetGridMouseDown() {
    for (let a = 0; a < GameManager.ROW; a++) {
        for (let b = 0; b < GameManager.COL; b++) {
            //document.querySelector("#r" + a + "-c" + b).style.backgroundColor = "red";
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
            document.querySelector("#r" + a + "-c" + b).style.backgroundImage = "url('images/" + icons[temp] + ".png')";
            document.querySelector("#r" + a + "-c" + b).style.backgroundRepeat = "no-repeat";
            document.querySelector("#r" + a + "-c" + b).style.backgroundPosition = "center";
            document.querySelector("#r" + a + "-c" + b).style.backgroundSize = "70%";
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

function userMatch() {
    GameManager.CURRENT_SCORE += checkPattern().length;
    let temp = [];
    temp = checkPattern();

    console.log(temp);

    while(checkPattern() != "") {
        refillGrid(temp);
    }

    if(temp == "")
        return true;

    render();
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function Start() {
    createGrid();
    fillGrid();
}

Start();

// PSEUDO CODE
// 1. MOVE TILES LEFT AND RIGHT TO CHECK FOR POSSIBLE PATTERN
// 2. CHECK FOR PATTERNS ACROSS THE BOARD
// 3. RESET PATTERN TO PREVIOUS BOARD
// 4. SPAWN TILES FROM THE TOP AND DROPS THEM DOWN INTO ARRAY

// 5. LOSE CONDITION: TIMER RUNS OUT OF TIME - NO MORE PATTERNS - PLAYER TERMINATES GAME
// 6. WIN CONDITION: MAXIMUM SCORE REACHED
// 7. POINTS: 1 POINT EACH