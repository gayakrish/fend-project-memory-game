/*
 * Create a list that holds all of your cards
 */
let cardsArray = [];
let openCards = [];
let openCardNames = [];
let matchCount = 0;
let moveCount = 0;

// to change the star rating according to the moves
const superStar = 16;
const avgStar = 24;
let starCount = 3;

//variables to start, reset and display timer
let timer;
let isTimer = false;
let timerValue;

resetBoard();

/*
 * Adds click event listener to each card on the deck
 */
function setUpListener() {
    for (let i = 0; i < cardsArray.length; i++) {
        $(cardsArray[i]).one("click", clickCard);
    }
}

/*
 * This function initializes the deck, resets all previous game variables
 * and associates appropriate listener to the cards and re-start icon.
 */
function resetBoard() {
    cardsArray.length = 0;
    var output = '';
    matchCount = 0;

    resetMoveCount();
    resetStar();
    resetTimer();

    cardsArray = shuffle($(".deck").children().toArray());
    for (let i = 0; i < cardsArray.length; i++) {
        var className = $(cardsArray[i]).children().attr("class");
        output += `<li class = "card"> <i class = "${className}"> </i> </li>`;
    }

    $(".deck").html(output);
    cardsArray = $(".deck").children().toArray();
    setUpListener();

    $('.restart').on("click", resetBoard);
}

/*
 * This is the action event called upon each card click. It checks if there are two cards to be matched
 * and whether the cards match. Appropriate animation, moves and card classes are added/removed.
 */
function clickCard(event) {

    startTimer();
    event.stopPropagation();

    if (openCards.length < 2 && openCardNames.length < 2) {

        setMoveCount();
        setStar();

        openCards.push($(event.target));
        openCardNames.push($(event.target).children().attr('class').substring(3));
        $(event.target).toggleClass('open show');

        if (openCards.length === 2) {

            var card1 = openCards[0];
            var card2 = openCards[1];

            if (openCardNames[0] === openCardNames[1]) {
                console.log("matched");
                setCardMatch(card1, card2);
                checkBoardWin();
                clearOpenCards();
            } else {
                // console.log("cards do not match");
                setCardMismatch(card1, card2);
                clearOpenCards();
                setTimeout(function() {
                    $(card1).removeClass('open show mismatch');
                    $(card2).removeClass('open show mismatch');
                }, 400);
            }
        }
    } else {
        clearOpenCards();
    }
}

/*
 * Increments the move counter and displays it
 */
function setMoveCount() {
    moveCount += 1;
    $('.moves').text(moveCount);
}

/*
 * Resets the move counter and displays it
 */
function resetMoveCount() {
    moveCount = 0;
    $('.moves').text('');
}

/*
 * Calculates the number of stars to be displayed based on the star rating guidelines and the number of moves.
 */
function setStar() {
    if (moveCount > superStar) {
        if ((moveCount < avgStar) && (starCount === 3)) {
            starCount = 2;
            $('#star1').hide();
        } else if ((moveCount > avgStar) && (starCount === 2)) {
            starCount = 1;
            $('#star2').hide();
        }
    }
}

/*
 * Resets the star count to 3 and displays all the 3 stars
 */
function resetStar() {
    starCount = 3;
    $('#star1').show();
    $('#star2').show();
}

/*
 * Start the timer
 */
function startTimer() {
    if (!isTimer) {
        isTimer = true;
        let startTime = new Date().getTime();

        //this is to ensure that timer starts immediately first time
        displayTimer(startTime);

        //console.log("time is "+ startTime.getHours() +":" + startTime.getMinutes() + ":" + startTime.getSeconds());
        timer = setInterval(function() {
            // console.log("set interval");
            displayTimer(startTime);
        }, 1000);

        // console.log("timer returned by setInterval "+ timer);
    }
}

/*
 * Display timer information on the game screen
 */
function displayTimer(startTime) {
    // console.log("display timer");
    let currentTime = new Date().getTime();
    let ms = currentTime - startTime;

    let currentHours = Math.floor(ms / 1000 / 60 / 60);
    ms -= currentHours * 1000 * 60 * 60;

    let currentMins = Math.floor(ms / 1000 / 60);
    ms -= currentMins * 1000 * 60;

    let currentSecs = Math.floor(ms / 1000);
    ms -= currentSecs * 1000;

    currentHours = (currentHours < 10) ? "0" + currentHours : currentHours;
    currentMins = (currentMins < 10) ? "0" + currentMins : currentMins;
    currentSecs = (currentSecs < 10) ? "0" + currentSecs : currentSecs;
    timerValue = `${currentHours}:${currentMins}:${currentSecs}`;
    // console.log("timer value " + timerValue);
    $(".timer").text(timerValue);
}

/*
 * Resets the timer
 */
function resetTimer() {
    if (isTimer) {
        // console.log("inside clear interval " + timer);
        clearInterval(timer);
        timerValue = "00:00:00";
        $(".timer").text("00:00:00");
        isTimer = false;
    }
}

/*
 * If the cards match, appropriate 'match' animation in css is called and all event listeners are
 * removed so that the user can't click these gain.
 */
function setCardMatch(card1, card2) {
    matchCount += 2;
    $(card1).addClass('match');
    $(card2).addClass('match');
    $(card1).parent().off();
    $(card2).parent().off();
}

/*
 * If all the cards are flipped and matched, the winning page is displayed with number of moves, stars and timer
 * values.
 */
function checkBoardWin() {
    setTimeout(function() {
        if (matchCount === cardsArray.length) {
            //alert("Congratulations!!! You've cleared the board.");
            window.location.href = `win.html?moves=${moveCount}&stars=${starCount}&timer=${timerValue}`;
            resetTimer();
        }
    }, 400);
}

/*
 * If the cards do not match, appropriate 'mismatch'class animation in css is called and click event listener
 * is registered back with these two cards.
 */
function setCardMismatch(card1, card2) {
    $(card1).addClass('mismatch');
    $(card2).addClass('mismatch');
    $(card1).one('click', clickCard);
    $(card2).one('click', clickCard);
}

/*
 * Hides the cards and clears the temporary arrays holding the two cards stored for matching purposes.
 */
function hideCards() {
    $(openCards[0]).removeClass('open show mismatch');
    $(openCards[1]).removeClass('open show mismatch');
    clearOpenCards();
}

/*
 * Clears the arrays holding the two open cards and their names.
 */
function clearOpenCards() {
    openCards.length = 0;
    openCardNames.length = 0;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/245097'
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}