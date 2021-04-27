const BOARD_GAME = document.getElementById("boardGame"), STARSHIP = document.getElementById("starShip")
const STARSHIP_WIDTH = 50
const borderRight = window.innerWidth - STARSHIP_WIDTH
var arrayTouch = [], currentXAxis = STARSHIP.getBoundingClientRect().x, expectedXAxis

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

window.onload = () => {

    BOARD_GAME.addEventListener("touchstart", evt => {
        arrayTouch.push(evt.touches[0].screenX)
    })

    BOARD_GAME.addEventListener("touchmove", evt => {
        arrayTouch.push(evt.changedTouches[0].screenX)
        direction()
    })

    BOARD_GAME.addEventListener("touchend", () => {
        arrayTouch = []
    })
}