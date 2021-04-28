const STARSHIP = document.getElementById("starShip"), STARSHIP_WIDTH = 50, STARSHIP_HEIGHT = 50
const BOARD_GAME = document.getElementById("boardGame"), borderRight = window.innerWidth - STARSHIP_WIDTH
const LASER_WIDTH = 8, LASER_HEIGHT = 40
const OVNI_WIDTH = 50, OVNI_HEIGHT = 40

let positionX
var arrayTouch = [], ovnis = []
var currentXAxis = STARSHIP.getBoundingClientRect().x, currentYAxis = STARSHIP.getBoundingClientRect().y
var ovniIndex = 0, expectedXAxis

class EnemyLaser{
    constructor(object){
        this.y = object.y
        this.x = object.x
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
            }, 0)
        }
    }
}

class Ovni{
    constructor(){
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
        let shot = new EnemyLaser(this)
    }

    moveDownwards(){
        if(this.y >= window.innerHeight){
            if(this.alive === true){
                console.log(`Floor reached`)
            }
        }else{
            this.y+=2
            setTimeout(() => {
                this.ovni.style.top = (this.y - OVNI_HEIGHT)+`px`

                this.moveDownwards()
                // this.shots()
            }, 100)

        }
    }

    shots(){
        if(this.alive === true){
            let time = Math.ceil(Math.random() * 20)
            if(time === 20){
                let enemyLaser = new EnemyLaser(this)
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
                    // indicator = true
                    // target = Number(i)
                    this.destroyOvni(i)
                }else{
                    i++
                    if(i === j){
                        flagg = true
                        this.moveUpwards()
                    }
                }
            }

            // if(indicator){
            //     this.destroyOvni(target)
            // }else{
            //     this.moveUpwards()
            // }
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
        }else{
            this.up()
        }
    }

    up(){
        setTimeout(() => {
            this.y -= 2
            this.laser.style.top = this.y+`px`
            this.isOvniAbove()
        }, 0)
    }
}

function createOvnis(){
    let time = Math.ceil(Math.random() * 9)
    if(time % 3 === 0){
        setTimeout(() => {
            let ovni = new Ovni()
            createOvnis()
        }, time * 1000)
    }else{
        createOvnis()
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

window.onload = () => {
    STARSHIP.style.left = currentXAxis+`px`
    STARSHIP.style.top = currentYAxis+`px`
    // createOvnis()

    BOARD_GAME.addEventListener("touchstart", evt => {
        arrayTouch.push(evt.touches[0].screenX)
    })
    BOARD_GAME.addEventListener("touchmove", evt => {
        arrayTouch.push(evt.changedTouches[0].screenX)
        direction()
    })
    BOARD_GAME.addEventListener("touchend", () => {
        isTap()
        arrayTouch = []
    })
}