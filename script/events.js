import { gameSettingsData } from './index.js'
import { getDiagonalMoves, getHorizontalMoves, getKingMoves, getPawnMoves, getVerticalMoves, knightMoves } from './waypoints.js'


let activeFigure = ''
let kingFigures = {
    white: '',
    black: '',
}
let choosedFigure = {}

let posibleStepsCells = []      // reserver for checkmate checking
let errorMesages = []           // game errors array maybe need add some window 4 errors
let wayPoint = []               // user choosed figure waypoint (green)
let enemyPoint = []             // user enemy attached waypoint (red)
let checkPoint = {
    white: {
        horizonal: [], vertical: [], diagonal: [], knight: []
    }, black: {
        horizonal: [], vertical: [], diagonal: [], knight: []
    }
}
let killedFigures = []
let checkers = {
    check: false, checkMate: false, gameTurn: true,
}


export function chesseBoardClickHandler(event) {

    let targetObject = gameSettingsData.figureMatrix[event.currentTarget.dataset.coordinates[0]][event.currentTarget.dataset.coordinates[1]]
    let targetChessBoard = gameSettingsData.chessBoard[event.currentTarget.dataset.coordinates[0]][event.currentTarget.dataset.coordinates[1]]

    if (!kingFigures.white) {
        kingFigures.white = gameSettingsData.figureMatrix[7][4]
        kingFigures.black = gameSettingsData.figureMatrix[0][4]
    }

    if (activeFigure == targetChessBoard.querySelector('div')) {
        clearCache()
        return
    }

    if (targetObject?.type) {
        if (activeFigure) activeFigure.classList.remove('selected')
        activeFigure = targetChessBoard.querySelector('div')
        if (((targetObject?.color === 'white') && checkers.gameTurn) || ((targetObject?.color === 'black') && !checkers.gameTurn)) {
            setWayPoints(targetObject)
        } else {
            mainTakingLogic(event, targetObject, targetChessBoard)
        }
    } else {
        if (choosedFigure) {
            let choosedCell = gameSettingsData.chessBoard[targetObject.position.i][targetObject.position.j].id
            if (wayPoint.includes(choosedCell)) {
                mainMovementLogic(event)
            } else {
                clearCache()
                return
            }
        }
        // this path idk maybe need to be deleted v 0.2.14
        choosedFigure = {}
        if (activeFigure) {
            activeFigure.classList.remove('selected')
            clearWayPoint()
        }
    }
}

function setWayPoints(playerchoosedFigure) {
    clearWayPoint()
    choosedFigure = playerchoosedFigure
    if (activeFigure) {
        activeFigure.classList.add('selected')
    }

    switch (playerchoosedFigure.type) {
        case 'pawn':
            checkers.gameTurn ? whitePawnLogic(playerchoosedFigure) : blackPawnLogic(playerchoosedFigure)
            break;
        case 'rook':
            rookLogic(playerchoosedFigure)
            break;
        case 'knight':
            knightLogic(playerchoosedFigure)
            break;
        case 'bishop':
            bishopLogic(playerchoosedFigure)
            break;
        case 'queen':
            queenLogic(playerchoosedFigure)
            break;
        case 'king':
            kingLogic(playerchoosedFigure)
            break;
        default:
            errorMesages.push('out of type error');
            break;
    }
    drawWayPoint()
}




// CHECK PATH

function checkWayPointLogic(king, mainArr, mainKing) {
    const horizonalSteps = getHorizontalMoves(mainKing[king], mainArr, true)
    const verticalSteps = getVerticalMoves(mainKing[king], mainArr, true)
    const diagonalSteps = getDiagonalMoves(mainKing[king], mainArr, true)
    const knightSteps = knightMoves(mainKing[king], mainArr, true)
    checkPoint[king].horizonal.push(...horizonalSteps.enemyPoint);
    checkPoint[king].knight.push(...knightSteps.enemyPoint);
    checkPoint[king].vertical.push(...verticalSteps.enemyPoint);
    checkPoint[king].diagonal.push(...diagonalSteps.enemyPoint);
    if (horizonalSteps.enemyPoint.length || verticalSteps.enemyPoint.length || diagonalSteps.enemyPoint.length || knightSteps.enemyPoint.length) {
        return true
    }
    return false
}

// working on figurs clone and detect check
function checkChecker(startPositions, targetPositions, mainArr) {
    clearCheckPoint()
    checkPoint = {
        white: {
            horizonal: [], vertical: [], diagonal: [], knight: []
        }, black: {
            horizonal: [], vertical: [], diagonal: [], knight: []
        }
    }
    let checkDetected = false

    // preWalking check detect
    let emptyFigureObj = {
        symbol: '',
        position: { i: choosedFigure.position.i, j: choosedFigure.position.j },
    }

    // get doublicate of main matrix
    let settingsData = JSON.parse(JSON.stringify(mainArr))
    settingsData.chessBoard = [...gameSettingsData.chessBoard]
    settingsData.figureMatrix[targetPositions.i][targetPositions.j] = settingsData.figureMatrix[startPositions.i][startPositions.j]
    settingsData.figureMatrix[targetPositions.i][targetPositions.j].position = targetPositions
    settingsData.figureMatrix[startPositions.i][startPositions.j] = emptyFigureObj

    // need send {white, black}
    let isKingFigure = settingsData.figureMatrix[targetPositions.i][targetPositions.j].type === 'king'
    let kingData = JSON.parse(JSON.stringify(kingFigures))
    kingData[checkers.gameTurn ? 'white' : 'black'] = { ...settingsData.figureMatrix[targetPositions.i][targetPositions.j] }
    let movedKing = isKingFigure ? kingData : kingFigures
    for (let king in kingFigures) {
        let kingStatus = checkWayPointLogic(king, settingsData, movedKing)
        if (kingStatus) {
            kingFigures[king].isCheck = kingStatus
            drawCheckPoint(kingFigures[king])
            if ((checkers.gameTurn ? 'white' : 'black') === king) {
                checkDetected = true
                checkers.check = true
            }
        }
    }

    return checkDetected
}




// ------ FIGURS MOVEMENT PATH ------

function mainMovementLogic(event) {

    let startPositions = { i: Number(choosedFigure.position.i), j: Number(choosedFigure.position.j) }
    let targetPositions = { i: Number(event.currentTarget.dataset.coordinates[0]), j: Number(event.currentTarget.dataset.coordinates[1]) }

    if (!checkChecker(startPositions, targetPositions, gameSettingsData)) {
        figureMoveLogic(startPositions, targetPositions)
        // kingClastingLogic
        if (choosedFigure.type === 'king' && Math.abs(Math.abs(startPositions.j) - Math.abs(targetPositions.j)) === 2) kingClastingLogic(startPositions, targetPositions)
        if (!Object.values(checkPoint[checkers.gameTurn ? 'white' : 'black']).some(array => array.length > 0)) { checkers.gameTurn = !checkers.gameTurn }
    }
    clearCache()
}

function figureMoveLogic(startPositions, targetPositions) {
    let emptyFigureObj = {
        symbol: '',
        position: { i: choosedFigure.position.i, j: choosedFigure.position.j },
    }

    // move obj to new place
    let figureSymbol = gameSettingsData.chessBoard[startPositions.i][startPositions.j].innerText
    gameSettingsData.chessBoard[startPositions.i][startPositions.j].querySelector('div').innerHTML = ''
    gameSettingsData.chessBoard[targetPositions.i][targetPositions.j].querySelector('div').innerHTML = figureSymbol
    // move fugure to new place
    gameSettingsData.figureMatrix[targetPositions.i][targetPositions.j] = gameSettingsData.figureMatrix[startPositions.i][startPositions.j]
    gameSettingsData.figureMatrix[targetPositions.i][targetPositions.j].position = targetPositions
    gameSettingsData.figureMatrix[targetPositions.i][targetPositions.j].steps += 1
    gameSettingsData.figureMatrix[startPositions.i][startPositions.j] = emptyFigureObj

    // Update king new position when king is moved
    if (choosedFigure.type === 'king') {
        if (choosedFigure.color === 'white') {
            kingFigures.white = { ...choosedFigure }
        } else {
            kingFigures.black = { ...choosedFigure }
        }
    }
}

function kingClastingLogic(startPositions, targetPositions) {
    let rookClastingPosition = { i: targetPositions.i, j: 0 }
    let rookStartPosition = { i: startPositions.i, j: 0 }
    if (startPositions.j < targetPositions.j) {
        rookClastingPosition.j = targetPositions.j - 1
        rookStartPosition.j = 7
    } else {
        rookClastingPosition.j = targetPositions.j + 1
        rookStartPosition.j = 0
    }
    figureMoveLogic(rookStartPosition, rookClastingPosition)
}








// ------ FIGURS TAKING PATH ------
function mainTakingLogic(event, targetObject, targetChessBoard) {

    if (choosedFigure) {
        if (enemyPoint.includes(targetChessBoard.id)) {

            let startPositions = { i: Number(choosedFigure.position.i), j: Number(choosedFigure.position.j) }
            let targetPositions = { i: Number(event.currentTarget.dataset.coordinates[0]), j: Number(event.currentTarget.dataset.coordinates[1]) }

            let emptyFigureObj = {
                symbol: '',
                position: { i: choosedFigure.position.i, j: choosedFigure.position.j },
            }

            // clear enemy obj in new place
            gameSettingsData.chessBoard[targetPositions.i][targetPositions.j].querySelector('div').innerHTML = ''

            // move fugure to new place
            gameSettingsData.figureMatrix[targetPositions.i][targetPositions.j].isAlive = false
            gameSettingsData.figureMatrix[targetPositions.i][targetPositions.j].killer = { ...choosedFigure }
            killedFigures.push(gameSettingsData.figureMatrix[targetPositions.i][targetPositions.j])
            gameSettingsData.figureMatrix[targetPositions.i][targetPositions.j] = emptyFigureObj

            figureMoveLogic(startPositions, targetPositions)
            if (!Object.values(checkPoint[checkers.gameTurn ? 'white' : 'black']).some(array => array.length > 0)) { checkers.gameTurn = !checkers.gameTurn }
            clearCache()
        }
    }
}








// CACHE PATH

function clearCache() {
    if (activeFigure)
        if (activeFigure?.classList.contains('selected')) { activeFigure.classList.remove('selected') }
    clearWayPoint()
    activeFigure = ''
    choosedFigure = {}
    errorMesages = []
    killedFigures = []
}

function clearWayPoint() {
    wayPoint.map((way) => {
        if (document.querySelector(`#${way}`).classList.contains('wayPoint')) {
            document.querySelector(`#${way}`).classList.remove('wayPoint')
        }
    })
    enemyPoint.map((enemy) => {
        if (document.querySelector(`#${enemy}`).classList.contains('enemyPoint')) {
            document.querySelector(`#${enemy}`).classList.remove('enemyPoint')
        }
    })
    wayPoint = []
    enemyPoint = []
}

function clearCheckPoint() {
    for (let king in kingFigures) {
        let kingId = gameSettingsData.chessBoard[kingFigures[king].position.i][kingFigures[king].position.j].id
        if (document.querySelector(`#${kingId}`).classList.contains('checkPoint')) {
            document.querySelector(`#${kingId}`).classList.remove('checkPoint')
        }
        kingFigures[king].isCheck = false
    }
    checkers.check = false
}






// VISUAL PATH

function drawWayPoint() {
    wayPoint.map((way) => {
        document.querySelector(`#${way}`).classList.add('wayPoint')
    })
    enemyPoint.map((enemy) => {
        document.querySelector(`#${enemy}`).classList.add('enemyPoint')
    })
}

function drawCheckPoint(king) {
    let kingId = gameSettingsData.chessBoard[king.position.i][king.position.j].id
    document.querySelector(`#${kingId}`).classList.add('checkPoint')
}








// LOGICAL PATH

function whitePawnLogic() {
    const pawnWays = getPawnMoves(-1, choosedFigure, gameSettingsData)
    wayPoint.push(...pawnWays.moves)
    enemyPoint.push(...pawnWays.enemyPoint)
}

function blackPawnLogic() {
    const pawnWays = getPawnMoves(1, choosedFigure, gameSettingsData)
    wayPoint.push(...pawnWays.moves)
    enemyPoint.push(...pawnWays.enemyPoint)
}

function rookLogic() {
    const horizonalSteps = getHorizontalMoves(choosedFigure, gameSettingsData)
    const verticalSteps = getVerticalMoves(choosedFigure, gameSettingsData)
    wayPoint.push(...horizonalSteps.moves, ...verticalSteps.moves)
    enemyPoint.push(...horizonalSteps.enemyPoint, ...verticalSteps.enemyPoint)
}

function knightLogic() {
    const knightSteps = knightMoves(choosedFigure, gameSettingsData)
    wayPoint.push(...knightSteps.moves)
    enemyPoint.push(...knightSteps.enemyPoint)
}

function bishopLogic() {
    const diagonalSteps = getDiagonalMoves(choosedFigure, gameSettingsData);
    wayPoint.push(...diagonalSteps.moves)
    enemyPoint.push(...diagonalSteps.enemyPoint)
}

function queenLogic() {
    const horizonalSteps = getHorizontalMoves(choosedFigure, gameSettingsData)
    const verticalSteps = getVerticalMoves(choosedFigure, gameSettingsData)
    const diagonalSteps = getDiagonalMoves(choosedFigure, gameSettingsData)
    wayPoint.push(...diagonalSteps.moves, ...horizonalSteps.moves, ...verticalSteps.moves);
    enemyPoint.push(...diagonalSteps.enemyPoint, ...horizonalSteps.enemyPoint, ...verticalSteps.enemyPoint)
}

function kingLogic() {
    const kingMoves = getKingMoves(choosedFigure, gameSettingsData)
    wayPoint.push(...kingMoves.moves)
    enemyPoint.push(...kingMoves.enemyPoint)
}