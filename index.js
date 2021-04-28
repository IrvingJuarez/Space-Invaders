const BOARD_GAME = document.getElementById("boardGame"), STARSHIP = document.getElementById("starShip")
const STARSHIP_WIDTH = 50, RAY_WIDTH = 8, RAY_HEIGHT = 40
const borderRight = window.innerWidth - STARSHIP_WIDTH
const OVNI_WIDTH = 50, OVNI_HEIGHT = 40
var arrayTouch = [], currentXAxis = STARSHIP.getBoundingClientRect().x, expectedXAxis
var currentYAxis = STARSHIP.getBoundingClientRect().y
let positionX
var ovnis = [], ovniIndex = 0

class Ovni{
    constructor(){
        this.x = Math.floor(Math.random() * (window.innerWidth - OVNI_WIDTH))
        this.finalX = this.x + OVNI_WIDTH
        this.y = OVNI_HEIGHT
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
            divObject: this.ovni,
            index: this.index
        }
        ovnis.push(ovniObject)
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
            console.log(`Floor reached`)
        }else{
            this.y+=2
            ovnis = ovnis.filter(ovni => {
                if(ovni.index === this.index){
                    ovni.y = this.y
                }
            })

            setTimeout(() => {
                this.ovni.style.top = (this.y - OVNI_HEIGHT)+`px`

                this.moveDownwards()
            }, 500)
        }
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

        this.isOvniAbove()
    }

    isOvniAbove(){
        if(ovnis.length === 0){
            this.moveUpwards()
        }else{
            let indicator = false, target, i = 0

            for(let i = 0; i < ovnis.length; i++){
                if(this.x >= ovnis[i].x && this.x <= ovnis[i].finalX){
                    indicator = true
                    target = ovnis[i]
                }
            }

            console.log(target.y)

            if(indicator){
                this.destroyOvni(target)
                // console.log(`Target`)
            }else{
                this.moveUpwards()
                // console.log(`No target`)
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
        if(this.y <= target.y){
            BOARD_GAME.removeChild(this.laser)
            BOARD_GAME.removeChild(target.divObject)
            ovnis = ovnis.filter(ovni => {
                if(ovni.index == target.index){

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

createOvni = () => {
    let time = Math.ceil(Math.random() * 9)

    if(time % 3 === 0){
        setTimeout(() => {
            let ovni = new Ovni()
            createOvni()
        }, time * 1000)
    }else{
        createOvni()
    }
}

isTap = () => {
    let lastTouch = arrayTouch.length - 1
    if(arrayTouch[lastTouch] === arrayTouch[0]){
        let laser = new Laser()
    }
}

direction = () => {
    let index = arrayTouch.length - 1

    if(arrayTouch[index] > arrayTouch[index - 1]){
        //Right
        if(Number(STARSHIP.style.left.replace(`px`, ``)) >= borderRight){

        }else{
            expectedXAxis = currentXAxis + 2
            STARSHIP.style.left = expectedXAxis+`px`
        }
    }else{
        //Left
        if(Number(STARSHIP.style.left.replace(`px`, ``)) <= 0){
            
        }else{
            expectedXAxis = currentXAxis - 2
            STARSHIP.style.left = expectedXAxis+`px`
        }
    }

    currentXAxis = expectedXAxis
}

window.onload = () => {
    STARSHIP.style.left = currentXAxis+`px`

    let ovni = new Ovni()

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