

export function getPawnMoves(iIncrement, choosedFigure, gameSettingsData, isCheckChecking = false) {
    const temp = { moves: [], enemyPoint: [] };
    const newRow = choosedFigure.position.i + iIncrement;
    const leftColumn = choosedFigure.position.j - 1;
    const rightColumn = choosedFigure.position.j + 1;

    if (newRow >= 0 && newRow < 8) {
        const currentCell = gameSettingsData.chessBoard[newRow][choosedFigure.position.j];
        const currentFigure = gameSettingsData.figureMatrix[newRow][choosedFigure.position.j];

        if (leftColumn >= 0) {
            const leftCell = gameSettingsData.chessBoard[newRow][leftColumn];
            const leftFigure = gameSettingsData.figureMatrix[newRow][leftColumn];
            if (leftFigure.type && leftFigure.color !== choosedFigure.color) {
                temp.enemyPoint.push(leftCell.id);
            }
        }

        if (rightColumn < 8) {
            const rightCell = gameSettingsData.chessBoard[newRow][rightColumn];
            const rightFigure = gameSettingsData.figureMatrix[newRow][rightColumn];
            if (rightFigure.type && rightFigure.color !== choosedFigure.color) {
                temp.enemyPoint.push(rightCell.id);
            }
        }

        if (!currentFigure.type) {
            temp.moves.push(currentCell.id);
        } else {
            return temp;
        }
    }

    if (!choosedFigure.steps) {
        const doubleRow = newRow + iIncrement;
        if (doubleRow >= 0 && doubleRow < 8) {
            const doubleCell = gameSettingsData.chessBoard[doubleRow][choosedFigure.position.j];
            const currentFigure = gameSettingsData.figureMatrix[doubleRow][choosedFigure.position.j];

            if (!currentFigure.type) {
                temp.moves.push(doubleCell.id);
            }
        }
    }
    return temp;
}

export function getDiagonalMoves(choosedFigure, gameSettingsData, isCheckChecking = false) {
    const possibleMoves = [
        { i: -1, j: -1 },
        { i: -1, j: 1 },
        { i: 1, j: -1 },
        { i: 1, j: 1 },
    ]
    const temp = { moves: [], enemyPoint: [] };

    for (const move of possibleMoves) {
        let newRow = choosedFigure.position.i + move.i;
        let newCol = choosedFigure.position.j + move.j;
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const currentCell = gameSettingsData.chessBoard[newRow][newCol];
            const currentFigure = gameSettingsData.figureMatrix[newRow][newCol];
            temp.moves.push(currentCell.id);
            if (currentFigure.type) {
                if (currentFigure.color !== choosedFigure.color) {
                    if (choosedFigure.type === 'king' && isCheckChecking) {
                        // skip if on diagonal is knight or rook
                        if (currentFigure.type === 'knight' || currentFigure.type === 'rook') {
                            temp.moves.pop();
                            break;
                        }
                        if (currentFigure.type === 'pawn') {
                            if ((currentFigure.position.i === choosedFigure.position.i + move.i) && (currentFigure.position.j === choosedFigure.position.j + move.j)) {
                                if(choosedFigure.color === 'white') {
                                    if (currentFigure.position.i < choosedFigure.position.i) {
                                        temp.enemyPoint.push(currentCell.id)
                                        temp.moves.pop();
                                        break;
                                    }
                                } else {
                                    if (currentFigure.position.i > choosedFigure.position.i) {
                                        temp.enemyPoint.push(currentCell.id)
                                        temp.moves.pop();
                                        break;
                                    }
                                }
                            }
                            temp.moves.pop();
                            break;
                        }
                        if (currentFigure.type === 'king') {
                            if ((currentFigure.position.i === choosedFigure.position.i + move.i) && (currentFigure.position.j === choosedFigure.position.j + move.j)) {
                                temp.enemyPoint.push(currentCell.id)
                                temp.moves.pop();
                                break;
                            }
                            temp.moves.pop();
                            break;
                        }
                    }
                    temp.enemyPoint.push(currentCell.id)
                    temp.moves.pop();
                    break;
                } else {
                    temp.moves.pop();
                    break;
                }
            }

            newRow += move.i;
            newCol += move.j;
        }
    }
    return temp;
}

export function getHorizontalMoves(choosedFigure, gameSettingsData, isCheckChecking = false) {
    const possibleMoves = [
        { j: 1 },
        { j: -1 },
    ]
    const temp = { moves: [], enemyPoint: [] };

    for (const move of possibleMoves) {
        let newCol = choosedFigure.position.j + move.j;

        while (newCol >= 0 && newCol < 8) {
            const currentCell = gameSettingsData.chessBoard[choosedFigure.position.i][newCol];
            const currentFigure = gameSettingsData.figureMatrix[choosedFigure.position.i][newCol];
            temp.moves.push(currentCell.id);

            if (currentFigure.type) {
                if (currentFigure.color !== choosedFigure.color) {
                    if (choosedFigure.type === 'king' && isCheckChecking) {
                        if (currentFigure.type === 'knight' || currentFigure.type === 'bishop' || currentFigure.type === 'pawn') {
                            temp.moves.pop();
                            break;
                        }
                        if (currentFigure.type === 'king') {
                            if (currentFigure.position.j == choosedFigure.position.j + move.j) {
                                temp.enemyPoint.push(currentCell.id)
                                temp.moves.pop();
                                break;
                            }
                            break;
                        }
                    }
                    temp.enemyPoint.push(currentCell.id)
                    temp.moves.pop();
                    break;
                } else {
                    temp.moves.pop();
                    break;
                }
            }

            newCol += move.j;
        }
    }
    return temp;
}

export function getVerticalMoves(choosedFigure, gameSettingsData, isCheckChecking = false) {
    const possibleMoves = [
        { i: 1 },
        { i: -1 },
    ]
    const temp = { moves: [], enemyPoint: [] };

    for (const move of possibleMoves) {
        let newRow = choosedFigure.position.i + move.i;

        while (newRow >= 0 && newRow < 8) {
            const currentCell = gameSettingsData.chessBoard[newRow][choosedFigure.position.j];
            const currentFigure = gameSettingsData.figureMatrix[newRow][choosedFigure.position.j];
            temp.moves.push(currentCell.id);

            if (currentFigure.type) {
                if (currentFigure.color !== choosedFigure.color) {
                    if (choosedFigure.type === 'king' && isCheckChecking) {
                        if (currentFigure.type === 'knight' || currentFigure.type === 'bishop' || currentFigure.type === 'pawn') {
                            temp.moves.pop();
                            break;
                        }
                        if (currentFigure.type === 'king') {
                            if (currentFigure.position.i == choosedFigure.position.i + move.i) {
                                temp.enemyPoint.push(currentCell.id)
                                temp.moves.pop();
                                break;
                            }
                            break;
                        }
                    }
                    temp.enemyPoint.push(currentCell.id)
                    temp.moves.pop();
                    break;
                } else {
                    temp.moves.pop();
                    break;
                }
            }

            newRow += move.i;
        }
    }


    return temp;
}

export function knightMoves(choosedFigure, gameSettingsData, isCheckChecking = false) {
    const possibleMoves = [
        { i: -2, j: -1 },
        { i: -2, j: 1 },
        { i: -1, j: -2 },
        { i: -1, j: 2 },
        { i: 1, j: -2 },
        { i: 1, j: 2 },
        { i: 2, j: -1 },
        { i: 2, j: 1 },
    ];
    const temp = { moves: [], enemyPoint: [] };
    for (const move of possibleMoves) {
        const newRow = choosedFigure.position.i + move.i;
        const newColumn = choosedFigure.position.j + move.j;

        if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8) {
            const currentCell = gameSettingsData.chessBoard[newRow][newColumn];
            const currentFigure = gameSettingsData.figureMatrix[newRow][newColumn];
            if (!currentFigure.type) {
                temp.moves.push(currentCell.id)
            } else if (currentFigure.color !== choosedFigure.color) {
                if (choosedFigure.type === 'king' && isCheckChecking) {
                    if (currentFigure.type === 'knight') {
                        temp.enemyPoint.push(currentCell.id)
                        temp.moves.pop();
                        break;
                    }
                    temp.moves.pop();
                    break;
                }
                temp.enemyPoint.push(currentCell.id)
                temp.moves.pop();
            }
        }
    }
    return temp;
}

export function getKingMoves(choosedFigure, gameSettingsData, isCheckChecking = false) {
    const temp = { moves: [], enemyPoint: [] };
    const kingSteps = choosedFigure.steps

    const possibleMoves = [
        { i: -1, j: -1 },
        { i: -1, j: 0 },
        { i: -1, j: 1 },
        { i: 0, j: -1 },
        { i: 0, j: 1 },
        { i: 1, j: -1 },
        { i: 1, j: 0 },
        { i: 1, j: 1 },
    ];


    for (const move of possibleMoves) {
        const newRow = choosedFigure.position.i + move.i;
        const newColumn = choosedFigure.position.j + move.j;

        if (newRow >= 0 && newRow < 8 && newColumn >= 0 && newColumn < 8) {
            const currentCell = gameSettingsData.chessBoard[newRow][newColumn];
            const currentFigure = gameSettingsData.figureMatrix[newRow][newColumn];
            if (!currentFigure.type) {
                temp.moves.push(currentCell.id);
            } else if (currentFigure.color !== choosedFigure.color) {
                temp.enemyPoint.push(currentCell.id)
            }
        }
    }

    if (kingSteps === 0 && !gameSettingsData.figureMatrix[choosedFigure.position.i][0].steps) {
        let emptyBetween = true
        for (let j = 1; j < choosedFigure.position.j; j++) {
            if (gameSettingsData.figureMatrix[choosedFigure.position.i][j].type) {
                emptyBetween = false;
                break;
            }
        }
        if (emptyBetween) {
            temp.moves.push(gameSettingsData.chessBoard[choosedFigure.position.i][choosedFigure.position.j - 2].id);
        }
    }

    if (kingSteps === 0 && !gameSettingsData.figureMatrix[choosedFigure.position.i][7].steps) {
        let emptyBetween = true;
        for (let j = choosedFigure.position.j + 1; j < 7; j++) {
            if (gameSettingsData.figureMatrix[choosedFigure.position.i][j].type) {
                emptyBetween = false;
                break;
            }
        }
        if (emptyBetween) {
            temp.moves.push(gameSettingsData.chessBoard[choosedFigure.position.i][choosedFigure.position.j + 2].id);
        }
    }

    return temp
}