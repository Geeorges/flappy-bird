import { storeScore, loadHighestScore } from './localStorage';


document.addEventListener('DOMContentLoaded', () => {
  let bird = document.querySelector('.bird');
  let gameDisplay = document.querySelector('.game-container');
  let gameOverContainer = document.querySelector('.gameover-container');
  let restartBtn = document.querySelector('#restart-btn');
  
 
  let startGameContainer = document.querySelector(".startgame-container");


  let isGameOver = false;
  loadHighestScore();

  
   // Audio settings
   let settingsCta = document.querySelector("#settingsCta");
   let settingsCloseCta = document.querySelector("#settingsCloseCta");
   let settingsContainer = document.querySelector(".settings-container");

   const bgSound = new Audio('/bg-sound.mp3');
   bgSound.load();

   let sliderBgSound = document.querySelector("#sliderBgSound");
   let sliderEffectSound = document.querySelector("#sliderEffectSound");

   sliderBgSound.addEventListener("input", () => {
     let value = (sliderBgSound.value / 100 );
     bgSound.volume = value;
     console.log("bg music volume: " + value);
   });
   
   sliderEffectSound.addEventListener("input", () => {
     let value = (sliderEffectSound.value / 100 );
     bgSound.volume = value;
     console.log("effect music volume: " + value);
   });

   settingsCta.addEventListener('click', (event) => {
     event.preventDefault();
     let uiContainers = document.querySelectorAll(".ui-container");
     uiContainers.forEach(container => {
       container.classList.remove("active");
       settingsContainer.classList.toggle("active");
     });
   });

   settingsCloseCta.addEventListener('click', (event) => {
     event.preventDefault();
     let uiContainers = document.querySelectorAll(".ui-container");
     if (!isGameOver) {
       uiContainers.forEach(container => {
         container.classList.remove("active");
         startGameContainer.classList.add("active");
       });
     } else {
       uiContainers.forEach(container => {
         container.classList.remove("active");
         gameOverContainer.classList.add("active");
       });
     }
   });

  
  //start a new game when spacebar is pressed
  document.addEventListener('keydown', newGame);
  
  function newGame(e) {
    if (e.keyCode === 32) {
      document.removeEventListener('keydown', newGame);

      startGameContainer.classList.toggle("active");
    
      isGameOver = false;
      let birdLeft = 220;
      let birdBottom = 250;
      let gravity = 2.5;
      let gap = 540;
      let score = 0;
      let gameTimerId = 0;

      const flySound = new Audio('/jump.wav');
      flySound.load();
    
      const coinSound = new Audio('/coinSound.mp3');
      coinSound.load();
    
      const gameOverSound = new Audio('/gameOverSound.wav');
      gameOverSound.load();
    
      function startGame() {
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';
        bgSound.play();
      }

      if (!isGameOver) {
        gameTimerId = setInterval(startGame, 25);
      }
    
    
      function jump() {
        if (birdBottom < 500) {
            birdBottom += 50;
            bird.style.bottom = birdBottom + 'px';
          } 
        }

      function control(e) {
        if (e.keyCode === 32) {
          jump();
          flySound.play();
        }
      }
      
      document.addEventListener('keydown', control);
    

      function generateObstacle() {
        let obstacleLeft = 500;
        let randomHeight = Math.random() * 150;
        let obstacleBottom = randomHeight;
        const obstacle = document.createElement('div');
        const topObstacle = document.createElement('div');

        if (!isGameOver) {
          obstacle.classList.add('obstacle');
          topObstacle.classList.add('topObstacle');
          gameDisplay.appendChild(obstacle);
          gameDisplay.appendChild(topObstacle);
          obstacle.style.left = obstacleLeft + 'px';
          topObstacle.style.left = obstacleLeft + 'px';
          obstacle.style.bottom = obstacleBottom + 'px';
          topObstacle.style.bottom = obstacleBottom + gap + 'px';
        }
        
    
        function moveObstacle() {
          obstacleLeft -= 2;
          obstacle.style.left = obstacleLeft + 'px';
          topObstacle.style.left = obstacleLeft + 'px';
    
          if (!isGameOver) {
            if (obstacleLeft === 200) {
              score += 1;
              const scoreCounter = document.querySelectorAll('.score');
    
              scoreCounter.forEach(scoreText => {
                scoreText.textContent = score;
              });
    
              coinSound.play();
            }
          }
    
          // Safely remove elements when it leave gameDisplay
          // ( only if they exist in the DOM )
          if (obstacleLeft === -60) {
            clearInterval(timerId);
            if (obstacle.parentElement === gameDisplay) {
              gameDisplay.removeChild(obstacle);
              gameDisplay.removeChild(topObstacle);
            }
          }

          // CONDITION FOR GAME OVER
          function checkCollision() {
            if (!isGameOver &&
              (
                (obstacleLeft > 200 &&
                obstacleLeft < 280 &&
                birdLeft === 220 &&
                (birdBottom < obstacleBottom + 250 || birdBottom > obstacleBottom + gap - 198))
                || birdBottom === 0
              )
            ) {
              isGameOver = true;
              gameOver();
              clearInterval(timerId);
            }
          }

          checkCollision();
          
        }
    
        let timerId = setInterval(moveObstacle, 20);
        if (!isGameOver) {
          setTimeout(generateObstacle, 2500);
        }
      }
      
      generateObstacle();


      // GAME OVER
      function gameOver() {
        isGameOver = true;
        clearInterval(gameTimerId);
        console.log('game over');
        document.removeEventListener('keydown', control);
        gameOverSound.play();
        storeScore(score);
        loadHighestScore();
        bgSound.currentTime = 0;
        bgSound.pause();
    
        gameOverContainer.classList.add('active'); // Show game over container
      }
    
      // RESTART GAME
      function restartGame() {
        // Stop and reset sounds
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
      
        // Clear any existing game loop intervals
        clearInterval(gameTimerId);
      
        // Remove any obstacles from the screen
        const obstacles = document.querySelectorAll('.obstacle, .topObstacle');
        obstacles.forEach(obstacle => obstacle.remove());
      
        // Reset game variables
        birdLeft = 220;
        birdBottom = 250;
        gravity = 2.5;
        isGameOver = false;
        gap = 550;
        score = 0;
      
        // Reset bird position
        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';
      
        // Reset score display
        const scoreCounter = document.querySelectorAll('.score');
        scoreCounter.forEach(scoreText => {
          scoreText.textContent = score;
        });
      
        // Temporarily remove event listeners to prevent key press from starting a new game
        document.removeEventListener('keydown', control);
      
        // Add a small delay before restarting the game
        setTimeout(() => {
          // Reattach the event listener
          document.addEventListener('keydown', control);
      
          // Start generating obstacles
          gameTimerId = setInterval(startGame, 20);
          generateObstacle();
        }, 100);  // Short delay (100ms)
      }
      
      // Handle the restart button click
      restartBtn.addEventListener('click', () => {
        // Hide restart button and game over container
        gameOverContainer.classList.remove('active');

        setTimeout(() => console.log("3"), 1000);
        setTimeout(() => console.log("2"), 2000);
        setTimeout(() => console.log("1"), 3000);
        setTimeout((restartGame), 4000);
        
        // Call restart game function after the countdown
      });

    }
  }
});
