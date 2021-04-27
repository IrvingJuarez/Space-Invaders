const BOARD_GAME = document.getElementById("boardGame"), STARSHIP = document.getElementById("starShip")
const STARSHIP_WIDTH = 50, RAY_WIDTH = 8, RAY_HEIGHT = 40
const borderRight = window.innerWidth - STARSHIP_WIDTH
const OVNI_WIDTH = 50, OVNI_HEIGHT = 40
var arrayTouch = [], currentXAxis = STARSHIP.getBoundingClientRect().x, expectedXAxis
var currentYAxis = STARSHIP.getBoundingClientRect().y
let positionX
var ovniIndex = 0, ovnis = []

class Ovni{
    constructor(){
        this.x = Math.floor(Math.random() * (window.innerWidth - OVNI_WIDTH))
        this.finalX = this.x + OVNI_WIDTH
        this.y = 0
        this.ovni = document.createElement("div")
        this.index = ovniIndex
        ovniIndex++

        this.addOvni()
        this.displayOvni()
    }

    addOvni(){
        let ovniObject = {
            x: this.x,
            finalX: this.finalX,
            y: this.y,
            index: this.index,
            divObject: this.ovni
        }
        ovnis.push(ovniObject)

        console.log(ovnis)
    }

    displayOvni(){
        this.ovni.classList.add("ovni")
        this.ovni.style.left = this.x+`px`
        this.ovni.style.top = this.y+`px`

        BOARD_GAME.appendChild(this.ovni)
    }
}

class Laser {
    constructor(){
        this.x = ((Number(STARSHIP.style.left.replace(`px`, ``)) + (STARSHIP_WIDTH / 2)) - (RAY_WIDTH / 2))
        this.y = currentYAxis - RAY_HEIGHT
        this.laser = document.createElement("div")

        this.printLaser()
    }

    printLaser(){
        this.laser.classList.add("laserBeam")
        this.laser.style.top = this.y+`px`
        this.laser.style.left = this.x+`px`

        BOARD_GAME.appendChild(this.laser)

        this.moveUpwards()
    }

    moveUpwards(){
        if(ovnis.length === 0){
            if(this.y <= 0){
                BOARD_GAME.removeChild(this.laser)
            }else{
                setTimeout(() => {
                    this.y-=2
                    this.laser.style.top = this.y+`px`
        
                    this.moveUpwards()
                }, 0)
            }
        }else{
            for(let i = 0; i < ovnis.length; i++){
                if(this.x >= ovnis[i].x && this.x <= ovnis[i].finalX){
                    if(this.y <= ovnis[i].y + OVNI_HEIGHT){
                        BOARD_GAME.removeChild(this.laser)
                        BOARD_GAME.removeChild(ovnis[i].divObject)
                        ovnis.splice(ovnis[i].index, 1)

                        console.log(ovnis)
                    }else{
                        setTimeout(() => {
                            this.y-=2
                            this.laser.style.top = this.y+`px`
                
                            this.moveUpwards()
                        }, 0)
                    }
                }else{
                    console.log(`No target`)
                }
            }
        }
        

    }
}

direction = () => {
    let index = arrayTouch.length - 1

    if(arrayTouch[index] > arrayTouch[index - 1]){
        //Right
        if(STARSHIP.style.left == borderRight+`px`){

        }else{
            expectedXAxis = currentXAxis + 1
            STARSHIP.style.left = expectedXAxis+`px`
        }
    }else{
        //Left
        if(STARSHIP.style.left == `0px`){
            
        }else{
            expectedXAxis = currentXAxis - 1
            STARSHIP.style.left = expectedXAxis+`px`
        }
    }

    currentXAxis = expectedXAxis
}

isTap = () => {
    let lastTouch = arrayTouch.length - 1
    if(arrayTouch[lastTouch] === arrayTouch[0]){
        let laser = new Laser()
    }
}

window.onload = () => {
    STARSHIP.style.left = currentXAxis+`px`

    setTimeout(() => {
        let ovni = new Ovni()
    }, 2000)

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