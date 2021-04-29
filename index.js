const TITLE_SECTION = document.getElementById("main-section"), BUTTON_START = document.getElementById("start-button")
const GAME_STATUS = document.getElementById("game-status")
let newGame

const STARSHIP = document.getElementById("starShip"), STARSHIP_WIDTH = 50, STARSHIP_HEIGHT = 50
const BOARD_GAME = document.getElementById("boardGame"), borderRight = window.innerWidth - STARSHIP_WIDTH
const LASER_WIDTH = 8, LASER_HEIGHT = 40
const OVNI_WIDTH = 50, OVNI_HEIGHT = 40

const LIFES_CONTAINER = document.getElementById("lifes-container"), POINTS = document.getElementById("points")
const NEXT_LEVEL = document.getElementById("nextLevel"), SECONDARY_TITLE = document.getElementById("secondary-title")

let positionX
var arrayTouch = [], ovnis = []
var currentXAxis = STARSHIP.getBoundingClientRect().x, currentYAxis = STARSHIP.getBoundingClientRect().y
var ovniIndex = 0, expectedXAxis, speed = 150, enemyLaserSpeed = 15
var keyFlag

class EnemyLaser{
    constructor(object, enemyLaserSpeed){
        this.y = object.y
        this.x = object.x
        this.speed = enemyLaserSpeed
        this.createEnemyLaser()
    }

    createEnemyLaser(){
        this.laser = document.createElement("div")
        this.laser.classList.add("enemyLaserBeam")
        this.laser.style.top = this.y+`px`
        this.laser.style.left = ((this.x + (OVNI_WIDTH/2)) - LASER_WIDTH/2)+`px`
        BOARD_GAME.appendChild(this.laser)
        this.downwards()
    }

    downwards(){
        let starshipX = Number(STARSHIP.style.left.replace(`px`, ``))
        let starshipFinalX = starshipX + STARSHIP_WIDTH
        let thisX = Number(this.laser.style.left.replace(`px`,``))

        if(thisX >= starshipX && thisX <= starshipFinalX){
            let starshipY = (Number(STARSHIP.style.top.replace(`px`, ``)) - (STARSHIP_HEIGHT/2))
            if(this.y >= starshipY){
                BOARD_GAME.removeChild(this.laser)
                newGame.lifes--
                newGame.killStarship()
            }else{
                this.down()
            }
        }else{
            this.down()
        }
    }

    down(){
        if(this.y + LASER_HEIGHT >= window.innerHeight){
            BOARD_GAME.removeChild(this.laser)
        }else{
            setTimeout(() => {
                this.y+=2
                this.laser.style.top = this.y+`px`
                this.downwards()
            }, this.speed)
        }
    }
}

class Ovni{
    constructor(speed){
        this.speed = speed
        this.x = Math.floor(Math.random() * (window.innerWidth - OVNI_WIDTH))
        this.finalX = this.x + OVNI_WIDTH
        this.y = OVNI_HEIGHT
        this.ovni = document.createElement("div")
        this.index = ovniIndex
        this.alive = true
        ovniIndex++
        ovnis.push(this)
        this.displayOvni()
    }

    displayOvni(){
        this.ovni.classList.add("ovni")
        this.ovni.style.left = this.x+`px`
        this.ovni.style.top = (this.y - OVNI_HEIGHT)+`px`
        BOARD_GAME.appendChild(this.ovni)
        this.moveDownwards()
    }

    moveDownwards(){
        if(this.y >= window.innerHeight){
            if(this.alive === true){
                newGame.lifes--
                newGame.killStarship()
                BOARD_GAME.removeChild(this.ovni)
            }
        }else{
            this.y+=2
            setTimeout(() => {
                this.ovni.style.top = (this.y - OVNI_HEIGHT)+`px`

                this.moveDownwards()
                this.shots()
            }, this.speed)

        }
    }

    shots(){
        if(this.alive === true){
            let time = Math.ceil(Math.random() * 20)
            if(time === 20){
                let enemyLaser = new EnemyLaser(this, enemyLaserSpeed)
            }
        }
    }
}

class Laser {
    constructor(){
        this.x = ((Number(STARSHIP.style.left.replace(`px`, ``)) + (STARSHIP_WIDTH / 2)) - (LASER_WIDTH / 2))
        this.y = currentYAxis - LASER_HEIGHT
        this.laser = document.createElement("div")
        this.printLaser()
    }

    printLaser(){
        this.laser.classList.add("laserBeam")
        this.laser.style.top = this.y+`px`
        this.laser.style.left = this.x+`px`
        BOARD_GAME.appendChild(this.laser)

        this.isOvniAbove()
    }

    isOvniAbove(){
        if(ovnis.length === 0){
            this.moveUpwards()
        }else{
            let i = 0
            let j = Number(ovnis.length) - 1
            let flagg = false
            let indicator = false
            let target

            while(!flagg){
                if(this.x >= ovnis[i].x && this.x <= ovnis[i].finalX){
                    flagg = true
                    this.destroyOvni(i)
                }else{
                    if(i === j){
                        flagg = true
                        this.moveUpwards()
                    }else{
                        i++
                    }
                }
            }
        }
    }

    moveUpwards(){
        if(this.y <= 0){
            BOARD_GAME.removeChild(this.laser)
        }else{
            this.up()
        }
    }

    destroyOvni(target){
        if(this.y <= ovnis[target].y){
            this.ovniKilled(target)    
        }else{
            this.up()
        }
    }

    ovniKilled(target){
        BOARD_GAME.removeChild(this.laser)
        BOARD_GAME.removeChild(ovnis[target].ovni)
        ovnis[target].alive = false

        ovnis = ovnis.filter(ovni => {
            if(ovni.index == ovnis[target].index){
                //Nothing happen
            }else{
                return ovni
            }
        })

        newGame.points+=2.5
        newGame.displayPoints()
    }

    up(){
        setTimeout(() => {
            this.y -= 2
            this.laser.style.top = this.y+`px`
            this.isOvniAbove()
        }, 0)
    }
}

function isTap(){
    let lastTouch = arrayTouch.length - 1
    if(arrayTouch[lastTouch] === arrayTouch[0]){
        let laser = new Laser()
    }
}

function direction(){
    let index = arrayTouch.length - 1

    if(arrayTouch[index] > arrayTouch[index - 1]){
        if(Number(STARSHIP.style.left.replace(`px`, ``)) >= borderRight){
            //Right
        }else{
            expectedXAxis = currentXAxis + 2
            STARSHIP.style.left = expectedXAxis+`px`
        }
    }else{
        if(Number(STARSHIP.style.left.replace(`px`, ``)) <= 0){
            //Left
        }else{
            expectedXAxis = currentXAxis - 2
            STARSHIP.style.left = expectedXAxis+`px`
        }
    }
    currentXAxis = expectedXAxis
}

function keyConstrols(evt){
    switch(evt.keyCode){
        case 39:
            while(keyFlag){
                console.log(`True`)
                // expectedXAxis = currentXAxis + 2
                // if(Number(STARSHIP.style.left.replace(`px`, ``)) >= borderRight){
                //     Do nothing
                // }else{
                //     STARSHIP.style.left = expectedXAxis+`px`
                // }
            }
        break;
        case 37:
            console.log(`Left`)
        break;
        case 32:
            console.log(`Spacebar`)
        break;
    }
}

class Game{
    constructor(){
        this.points = 0
        this.level = 1
        this.lifes = 2
        this.stop = false

        this.hideTitle()
        this.setStarship()
        this.controls()
        this.displayStatus()
        // this.createOvnis()
    }

    hideTitle(){
        TITLE_SECTION.style.display = "none"
    }

    setStarship(){
        STARSHIP.style.opacity = 1
        STARSHIP.style.left = currentXAxis+`px`
        STARSHIP.style.top = currentYAxis+`px`
    }

    controls(){
        BOARD_GAME.addEventListener("touchstart", evt => {
            arrayTouch.push(evt.touches[0].screenX)
        })
        BOARD_GAME.addEventListener("touchend", () => {
            isTap()
            arrayTouch = []
        })
        BOARD_GAME.addEventListener("touchmove", evt => {
            arrayTouch.push(evt.changedTouches[0].screenX)
            direction()
        })
    }

    displayLifes(){
        for(let i = 0; i < this.lifes; i++){
            let life = document.createElement("img")
            life.src = "./assets/icons/spaceship.svg"
            life.alt = "Spaceship"

            LIFES_CONTAINER.appendChild(life)
        }
    }

    displayPoints(){
        if(this.points === 0){
            POINTS.innerHTML = this.points
        }else{
            if(this.points % 100 === 0){
                POINTS.innerHTML = this.points
                this.nextLevel()
            }else{
                POINTS.innerHTML = this.points
            }
        }
    }

    nextLevel(){
        SECONDARY_TITLE.innerHTML = "Next level..."
        NEXT_LEVEL.style.opacity = 1
        this.level++
        this.changesOfLevel()

        this.cleanScreen()

        setTimeout(() => {
            NEXT_LEVEL.style.opacity = 0
            SECONDARY_TITLE.innerHTML = ""
        }, 2000)
    }

    changesOfLevel(){
        if(this.level % 2 === 0){
            this.createOvnis()
        }else{
            if(speed != 50){
                speed-=50
            }
        }
    }

    displayStatus(){
        GAME_STATUS.style.opacity = 1
        this.displayLifes()
        this.displayPoints()
    }

    createOvnis(){
        if(this.stop){

        }else{
            let time = Math.ceil(Math.random() * 10)
            if(time % 2 === 0){
                setTimeout(() => {
                    let ovni = new Ovni(speed)
                    this.createOvnis()
                }, time * 1000)
            }else{
                this.createOvnis()
            }
        }
    }

    killStarship(){
        if(this.lifes <= -1){
            this.cleanScreen()
            this.loser()
        }else{
            LIFES_CONTAINER.removeChild(LIFES_CONTAINER.childNodes[this.lifes])
        }
    }

    loser(){
        STARSHIP.style.opacity = 0
        this.stop = true
        SECONDARY_TITLE.innerHTML = "Game over"
        NEXT_LEVEL.style.opacity = 1

        setTimeout(() => {
            location.reload()
        }, 3000)
    }

    cleanScreen(){
        ovnis.forEach(item => {
            BOARD_GAME.removeChild(item.ovni)
            item.alive = false
        })
        ovnis = []
    }
}

function startGame(){
    newGame = new Game()
}