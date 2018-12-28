/*
 * Create a list that holds all of your cards
 */
 
 // Get a "NodeList"
const deck = document.querySelector('.deck');
console.log(deck);


/*
* Event handler, where execution taking place.
*/
//Target               Type   Listener
deck.addEventListener('click', event => {
    // clickEvent >>> targetContents
    // In this case [li.card....] is our contents
    const clickTarget = event.target;
    // Toggle card if it's clicked, and set the maximum length of clicked cards less than 2 cards
    if (
        clickTarget.classList.contains('card') && 
        !clickTarget.classList.contains('match') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget)
        ){

        toggleCard(clickTarget);
        addToggledCard(clickTarget);

        if(timerToggle){
            timer();
            // Somehow I need to make it false after invoking timer function? Otherwise weird thing happened..
            timerToggle = false;
        }
    }

    if(toggledCards.length === 2){
        checkMatching();
        countMove();
        starDisplaying();
    }
});

/*
* Flip over the selected card and show its icon
*/
function toggleCard(clickTarget){
    clickTarget.classList.toggle('open');
    clickTarget.classList.toggle('show');
}

/*
* Store the eventTargets into array
*/
// Create an empty array
let toggledCards = [];
function addToggledCard(clickTarget){
    toggledCards.push(clickTarget);
}

/*
* Check if the two selected cards are matched
*/
let matchs = 0;
function checkMatching(){
    if(
        toggledCards[0].firstElementChild.className 
        ===
        toggledCards[1].firstElementChild.className
    ){
        console.log('yes!');
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards = []
        matchs++;
        console.log('matchs: '+ matchs);

        //Game over
        if(matchs == 8){
            switchModal();
            modalInfo();
            stopTimer();
        }
    }else{
        console.log('nope');
        // Set a TimeOut to see the second unmatched card in a short time frame
        setTimeout(() => {
            toggledCards[0].classList.toggle('open');
            toggledCards[0].classList.toggle('show');
            toggledCards[1].classList.toggle('open');
            toggledCards[1].classList.toggle('show');
            toggledCards = []
        }, 500)   
    }
}

/*
* Create a card array from DOM, and shuffle it 
*/
function shuffleDeck(){
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    console.log(cardsToShuffle);
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards){
        // number of content won't increase, although I append it. Nodes would reference the original object and only change its order.
        deck.appendChild(card);
    }
}
shuffleDeck();

/*
* Count numner of moves
*/
let moves = 0;
function countMove(){
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * Number of stars displaying
 */
function starDisplaying(){
    if (moves === 10 || moves === 20){
        removeStar();
    }
}

/*
 * Remove star from score panel
 */
function removeStar(){
    const starNodeList = document.querySelectorAll('.stars li');
    for(star of starNodeList){
        if(star.style.display != 'none'){
            star.style.display = 'none';
            // Break can ensure it only removes ONE star at a time
            break;
        }
    }
}

/*
 * Count stars
 */
function countStars(){
    let iniStar = 0;
    const starNodeList = document.querySelectorAll('.stars li');
    for(star of starNodeList){
        if(star.style.display != 'none'){
            iniStar++
        }
    }
    return iniStar
}

/*
 * Make a timer
 */
let timerToggle = true;
let iniTimer;
function timer(){
    time = 0;
    iniTimer = setInterval(() => {
        time++
        const timerText = document.querySelector('.timer');
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if(seconds < 10){
            timerText.innerHTML = `${minutes}:0${seconds}`;
        }
        else{
            timerText.innerHTML = `${minutes}:${seconds}`;
        }    
    }, 1000);
}

/*
 * Stop timer
 */
function stopTimer(){
    clearInterval(iniTimer);
}


/*
 * Switch modal
 */
function switchModal(){
    const switchModal = document.querySelector('.modal-background');
    switchModal.classList.toggle('switch');
}

/*
 * Show modal info
 */
function modalInfo(){
    // Timer
    const modalTime = document.querySelector('.modal-time');
    const infoTimer = document.querySelector('.timer').innerHTML;

    modalTime.innerHTML = `Time : ${infoTimer}`;

    //Level
    const modalLevel = document.querySelector('.modal-level')
    const counts = countStars();
    if(counts === 3){
        modalLevel.innerHTML = `Level : ${'Expert'}`;
    }
    if(counts === 2){
        modalLevel.innerHTML = `Level : ${'Professional'}`;
    }
    if(counts === 1){
        modalLevel.innerHTML = `Level : ${'Beginner'}`;
    }

    //Moves
    const modalMove = document.querySelector('.modal-moves');
    const infoMove = document.querySelector('.moves').innerHTML;
    modalMove.innerHTML = `Moves : ${infoMove}`;
}

/*
 * Reset game
 */
document.querySelector('.modal-cancel').addEventListener('click', switchModal);

document.querySelector('.modal-replay').addEventListener('click', resetGameForReplayButton);

document.querySelector('.restart').addEventListener('click', resetGameForReplayIcon);

/*
 * Reset game
 */
function resetGameForReplayButton(){
    resetGame();
    switchModal();
}

function resetGameForReplayIcon(){
    resetGame();
}

function resetGame(){
        // Clearing the left card. Scenario: it only one card is selected before pressing restart button.
        toggledCards = [];
        matchs = 0;
    
        stopTimer();
        const timerText = document.querySelector('.timer');
        timerText.innerHTML = '00:00';
    
        timerToggle = true;
        // Reset moves on score panel
        moves = 0;
        document.querySelector('.moves').innerHTML= moves;
        // Reset stars on score panel
        iniStar = 0;
        const starNodeList = document.querySelectorAll('.stars li');
        for( star of starNodeList){
            star.style.display = 'inline';
        }
        resetCards();   
}

/*
 * Flip all the cards to back side
 */
function resetCards(){
    const cards = document.querySelectorAll('.deck li');
    for(card of cards){
        card.className = 'card';
    }
}
