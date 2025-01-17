// Store the highest score in localStorage
export function storeScore(value) {
    // Retrieve the current highest score from localStorage or initialize it to 0
    let currentHighestScore = localStorage.getItem("highestScore")
        ? JSON.parse(localStorage.getItem("highestScore"))
        : 0;

    // Update the stored highest score if the new value is greater
    if (value > currentHighestScore) {
        localStorage.setItem("highestScore", JSON.stringify(value));
        console.log(`New highest score ${value} saved`);
    } else {
        console.log(`Score ${value} is not higher than the current highest score ${currentHighestScore}`);
    }
}

// Load the highest score from localStorage
export function loadHighestScore() {
    // Retrieve the highest score from localStorage or default to 0
    let highestScore = localStorage.getItem("highestScore")
        ? JSON.parse(localStorage.getItem("highestScore"))
        : 0;

    console.log("Highest score:", highestScore);

    // Display the highest score in the DOM
    let highestScoreElement = document.querySelectorAll(".highest-scores--local > span");
    
    highestScoreElement.forEach( localHighest => {
        if (localHighest) {
            localHighest.textContent = highestScore;
        }
    });


    //return highestScore; // Rturn it if needed elsewhere
}
