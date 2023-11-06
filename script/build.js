import { chesseBoardClickHandler } from './events.js'

export function initGame(sets, num, figure) {
    let container = document.createElement('div')
    container.classList.add('flex', 'center', 'column', 'color')

    let chesse = {
        topArea: document.createElement('div'),
        mainArea: document.createElement('div'),
        botArea: document.createElement('div'),
        rightArea: document.createElement('div'),
        middleArea: document.createElement('div'),
        leftArea: document.createElement('div'),
    };
    let figureMatrix = []
    let chessBoard = []

    for (let arena in chesse) {
        chesse[arena].style.display = 'flex'
        chesse[arena].style.justifyContent = chesse[arena].style.alignItems = 'center'
    }

    chesse.topArea.classList.add('color')
    chesse.botArea.classList.add('color')
    chesse.middleArea.style.flexDirection = chesse.leftArea.style.flexDirection = chesse.rightArea.style.flexDirection = 'column'

    for (let i = 0; i < num; i++) {
        let figureMatrixRow = []
        let chessBoardMatrixRow = []
        let topBorderLetters = borderSettings(sets.data.letter + i, `${sets.size.width}px`, `${sets.size.height / 2}px`)
        let botBorderLetters = borderSettings(sets.data.letter + i, `${sets.size.width}px`, `${sets.size.height / 2}px`)
        let chessRow = document.createElement('div')
        chessRow.classList.add('flex', 'center')
        let chesseLeftSide = document.createElement('div')
        let chesseRightSide = document.createElement('div')
        chesseLeftSide.innerHTML = chesseRightSide.innerHTML = num - i
        chesseLeftSide.classList.add('flex', 'center')
        chesseRightSide.classList.add('flex', 'center')
        chesseLeftSide.style.backgroundColor = chesseRightSide.style.backgroundColor = sets.color.border
        chesseLeftSide.style.width = chesseRightSide.style.width = `${sets.size.width / 2}px`
        chesseLeftSide.style.height = chesseRightSide.style.height = `${sets.size.height}px`
        for (let j = 0; j < num; j++) {
            let chessCell = document.createElement('div')
            chessCell.id = `${String.fromCharCode(sets.data.letter + j)}${num - i}`
            chessCell.classList.add('flex', 'center', 'chessCell', 'cell', 'font', ((i + j) % 2 === 0) ? 'black' : 'white')
            let figureMatrixObj = createChessFugur(chessCell.id, { i, j })          // figure obj
            let figureDiv = document.createElement('div')
            figureDiv.classList.add('flex', 'center', 'chessCell', 'cell', 'font')
            figureDiv.innerText = figureMatrixObj.symbol
            chessCell.appendChild(figureDiv)
            chessCell.dataset.coordinates = `${i}${j}`;
            chessCell.addEventListener('click', chesseBoardClickHandler)
            let chessBoardMatrixObj = chessCell                                      // board obj
            chessRow.appendChild(chessCell)
            figureMatrixRow.push(figureMatrixObj)
            chessBoardMatrixRow.push(chessBoardMatrixObj)
        }
        chesse.leftArea.appendChild(chesseLeftSide)
        chesse.rightArea.appendChild(chesseRightSide)
        chesse.topArea.appendChild(topBorderLetters)
        chesse.middleArea.appendChild(chessRow)
        chesse.botArea.appendChild(botBorderLetters)
        figureMatrix.push(figureMatrixRow)
        chessBoard.push(chessBoardMatrixRow)
    }

    function borderSettings(letterCode = 97, width = 50, height = 50) {
        let htmlTag = document.createElement('div')
        htmlTag.innerText = String.fromCharCode(letterCode)
        htmlTag.classList.add('flex', 'center')
        htmlTag.style.width = width
        htmlTag.style.height = height
        return htmlTag
    }

    function createChessFugur(id, position) {

        // on key down set position absolute and forward to mouse
        let figureObj = {
            symbol: '',
            position: position,
        }
        if (position?.i == 4 && id[0] === 'f') {
            figureObj.color = position?.i == 0 ? 'black' : 'black'
            figureObj.type = 'queen'
            figureObj.symbol = position?.i == 0 ? figure.black.queen : figure.black.queen
        }

        if ((position?.i == 6) || (position?.i == 1)) {
            // figureObj.color = position?.i == 1 ? 'black' : 'white'
            // figureObj.type = 'pawn'
            // figureObj.symbol = position?.i == 1 ? figure.black.pawn : figure.white.pawn
        } else if ((position?.i == 7) || (position?.i == 0)) {
            switch (id[0]) {
                case 'a':
                case 'h':
                    figureObj.color = position?.i == 0 ? 'black' : 'white'
                    figureObj.type = 'rook'
                    figureObj.symbol = position?.i == 0 ? figure.black.rook : figure.white.rook
                    break;
                case 'b':
                case 'g':
                    // figureObj.color = position?.i == 0 ? 'black' : 'white'
                    // figureObj.type = 'knight'
                    // figureObj.symbol = position?.i == 0 ? figure.black.knight : figure.white.knight
                    break;
                case 'c':
                case 'f':
                    // figureObj.color = position?.i == 0 ? 'black' : 'white'
                    // figureObj.type = 'bishop'
                    // figureObj.symbol = position?.i == 0 ? figure.black.bishop : figure.white.bishop
                    break;
                case 'd':
                    // figureObj.color = position?.i == 0 ? 'black' : 'white'
                    // figureObj.type = 'queen'
                    // figureObj.symbol = position?.i == 0 ? figure.black.queen : figure.white.queen
                    break;
                case 'e':
                    figureObj.color = position?.i == 0 ? 'black' : 'white'
                    figureObj.type = 'king'
                    figureObj.symbol = position?.i == 0 ? figure.black.king : figure.white.king
                    break;
                default:
                    break;
            }
        }

        if (figureObj.symbol) {
            figureObj.isSelected = false
            figureObj.isAlive = true
            figureObj.isCheck = false
            figureObj.steps = 0
            figureObj.killer = {}
        }

        return figureObj
    }


    chesse.mainArea.appendChild(chesse.leftArea);
    chesse.mainArea.appendChild(chesse.middleArea);
    chesse.mainArea.appendChild(chesse.rightArea);
    container.appendChild(chesse.topArea);
    container.appendChild(chesse.mainArea);
    container.appendChild(chesse.botArea);

    document.querySelector('#root').appendChild(createTopCtnr())
    document.querySelector('#root').appendChild(container);

    return {
        figureMatrix,
        chessBoard
    }
}

function createTopCtnr() {
    let topCtnr = document.createElement('div')



    return topCtnr
}