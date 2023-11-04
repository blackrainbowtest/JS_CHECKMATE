// Գլոբալ փոփոխականներ
export const sets = {
    color: {
        board: '#c4c4c4',       // -----
        white: '#FFF4E1',       // #fff
        black: '#524939',       // #000
        border: '#857485',      // #c2c2c2
        container: '#FFB533',   // -----
    },
    size: {
        test: '500px',      
        width: 50,          // շախմատի վանդակի երկարությունը
        height: 50,         // շախմատի վանդակի բարձրությունը
        font: 40,           // ֆիգուրների չափը
    },
    data: {
        letter: 97,         // տառի համարակալման սկիզբը
    }

};

export const num = 8;       // Շախմատի դաշտերի քանակը

// ՍՊԻՏԱԿ ԽԱՂԱՔԱՐԵՐ
export const figure = {
    white: {
        pawn: '\u2659',      // զինվոր
        knight: '\u2658',    // ձի
        bishop: '\u2657',    // փիղ
        rook: '\u2656',      // նավակ
        queen: '\u2655',     // թագուհի
        king: '\u2654',      // թագավոր
    },
    black: {
        pawn: '\u265F',      // զինվոր
        knight: '\u265E',    // ձի
        bishop: '\u265D',    // փիղ
        rook: '\u265C',      // նավակ
        queen: '\u265B',     // թագուհի
        king: '\u265A',      // թագավոր
    },
}