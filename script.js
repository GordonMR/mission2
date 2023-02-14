// Initialise variables
let pAttack = 10;
let pHealth = 100;

let eAttack = 12;
let eHealth = 100;

//DOM selecting classes from html

const playerName = document.querySelector('.name');
const monster = document.querySelector('monster');

const description = document.querySelector('.desc');
description.style.color = 'white';

const getPlayerAttack = document.querySelector('.pAttack');
const getPlayerHealth = document.querySelector('.pHealth');

const getEnemyAttack = document.querySelector('.eAttack');
const getEnemyHealth = document.querySelector('.eHealth');

const title = document.querySelector('.title');

// // title.stlye.animation = 'asdf';
// document.body.style.backgroundColor = 'black';

let interval;
let attackCount = 0;

//creating sounds using new Audio
const attackAudio = new Audio('audio/sword.mp3');
const healAudio = new Audio('audio/heal.mp3');

const aButton = document.querySelector('.attackButton');
const hButton = document.querySelector('.healButton');
const playButton = document.querySelector('.playButton');

//listening for click events, calling different functions
aButton.addEventListener('click', attack);
hButton.addEventListener('click', heal);
aButton.addEventListener('click', disableButton);
hButton.addEventListener('click', disableButtonLonger);

const dButton = document.querySelector('.dodgeButton');
dButton.addEventListener('click', dodge);

dButton.disabled = true;
let dodged = false;

// eventlistener - play audio on click using .play()
aButton.addEventListener('click', () => {
  attackAudio.play();
});

hButton.addEventListener('click', () => {
  healAudio.play();
});

//disable buttons initially
aButton.disabled = true;
hButton.disabled = true;

//Prompt window for user to type in a name
let gamePrompt = prompt('Please choose a Name:');

const pName = document.querySelector('.name');
pName.textContent = gamePrompt.toUpperCase(); //makes text upper case

//functions to disable target for a certain amount of time, then enable
function disableButton(e) {
  e.target.disabled = true;
  setTimeout(function () {
    e.target.disabled = false;
  }, 900);
}
function disableButtonLonger(e) {
  e.target.disabled = true;
  setTimeout(function () {
    e.target.disabled = false;
  }, 2200);
}
// weapon array
const weapons = ['Dagger🔪', 'Long Sword🗡️', 'Battle Axe🪓'];

// console.log(weapons);

// const playerStats = {
//   weapon: weapons[0],
//   potions: weapons[1],
//   armour: weapons[2],
// };
// console.log(playerStats.weapon);

const pWeapon = document.querySelector('.pWeapon');

//Getting a random integer between two values, inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

//function to start the game - changes the players/enemies attack and health to random numbers, title,
function playGame() {
  attackCount = 0;
  title.textContent = 'The Dungeon';
  pAttack = getRandomIntInclusive(7, 13);
  pHealth = getRandomIntInclusive(120, 200);
  eAttack = getRandomIntInclusive(10, 20);
  eHealth = getRandomIntInclusive(160, 310);
  //enable buttons
  aButton.disabled = false;
  hButton.disabled = false;
  // dButton.disabled = false;
  pWeapon.textContent = weapons[0];

  getPlayerAttack.textContent = pAttack;
  getPlayerHealth.textContent = pHealth;
  getEnemyAttack.textContent = eAttack;
  getEnemyHealth.textContent = eHealth;

  // document.querySelector('.block').style.backgroundImage =
  //   'url(img/corridor.png)';
  // document.querySelector('.block').style.backgroundSize = 'cover';

  document.querySelector('.block').style.backgroundColor = 'rgb(230, 230, 230)';
  getPlayerAttack.style.color = 'black';
  document.querySelector('.enemyPicture').style.border =
    '5px solid rgb(31, 31, 31)';

  //clear interval initally, then runs enemyAttack function every 1500ms
  clearInterval(interval);
  interval = setInterval(enemyAttack, 1500);

  //disable main Play button
  playButton.disabled = true;
}

function dodge() {
  dodged = true;
}
//Attack function when attack button clicked
// if player is alive and enemy is alive, attack enemy health with player attack
function attack() {
  if (eHealth >= 1 && pHealth > 0) {
    eHealth = eHealth - pAttack;
    getEnemyHealth.textContent = eHealth;
    description.style.color = 'black';

    getEnemyHealth.style.color = 'rgb(162, 42, 42)';
    setTimeout(function () {
      getEnemyHealth.style.color = 'black';
    }, 500);

    attackCount++;
    //increase player attack after 10 attacks
    if (attackCount === 10) {
      pAttack += 5;
      getPlayerAttack.style.color = 'rgb(222, 166, 0)';
      pWeapon.textContent = weapons[1];
    }
    if (attackCount === 20) {
      pAttack += 5;
    }
    getPlayerAttack.textContent = pAttack;
    description.textContent = `You Attacked ⚔️ [${attackCount}]`;

    //when enemy health is less than 100, increase how often enemy attacks
    if (eHealth <= 100) {
      clearInterval(interval);
      interval = setInterval(enemyAttack, 800);
      document.querySelector('.enemyPicture').style.border =
        '5px solid rgb(194, 0, 0)';
    }
    //game win condition
    if (eHealth < 1) {
      clearInterval(interval);
      description.textContent = 'You win!! 👑';
      playButton.disabled = false; //enable button when win
    }
  }
}
// for (let i = 0; i < 1; i++) {
// eAttack += 1;
// getEnemyAttack.textContent = eAttack;
// }

//enemy attack function,
function enemyAttack() {
  let randomNum = getRandomIntInclusive(1, 4); //generates random number, if it is 1 then dodge button is enabled and player has a chance to dodge
  console.log(randomNum);
  if (randomNum === 1) {
    dButton.disabled = false;
    setTimeout(function () {
      dButton.disabled = true;
    }, 800);
  }
  //if player doesn't dodge, lose health
  if (dodged === false) {
    pHealth = pHealth - eAttack;
    getPlayerHealth.textContent = pHealth;
  } else if (dodged === true) {
    //if player dodges, gain some health
    pHealth += 5;
    getPlayerHealth.textContent = pHealth;
    getPlayerHealth.style.color = 'grey';
    setTimeout(function () {
      getPlayerHealth.style.color = 'black';
    }, 500);
    dodged = false;
  }
  //if player health reaches below 1, player dies and loses
  if (pHealth < 1) {
    description.style.color = 'black';
    description.textContent = 'You Died! ☠️';
    document.querySelector('.block').style.backgroundColor = 'rgb(115, 52, 52)';

    clearInterval(interval); //stop enemy attack function running
    playButton.disabled = false; //enable play button when lose
  }
}
//heal function, heals player by 15
function heal() {
  if (pHealth < 200 && pHealth > 0) {
    pHealth += 15;
    getPlayerHealth.textContent = pHealth;
    //changes text colour to green then after 500ms change text color is black
    getPlayerHealth.style.color = 'green';
    setTimeout(function () {
      getPlayerHealth.style.color = 'black';
    }, 500);
  }
}
