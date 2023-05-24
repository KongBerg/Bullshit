// Define variables
let score = 0;
let highScore = 0;
let currentSite = null;
let otherSite = null;
let shuffleInterval = null;
let currentIndex = 0;
let guess = '';
let sites = [];

fetchSites();

// Fetch the list of sites from the server
async function fetchSites() {
    try {
        const response = await fetch('http://localhost:3001/api/sites');
        sites = await response.json();
        if (sites && sites.length > 0) {
            updateUI();
        } else {
            console.error('No site data found');
        }
    } catch (err) {
        console.error(err);
    }
}

// Get a random site from the list of sites
function getRandSite(excludeSite) {
    let filteredSites = sites.filter(site => site !== excludeSite);
    let randIndex = Math.floor(Math.random() * filteredSites.length);
    return filteredSites[randIndex];
}

// Add ripple effect to buttons
const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
    button.addEventListener("click", function () {
        button.classList.add("clicked");
        setTimeout(() => {
            button.classList.remove("clicked");
        }, 500);
    });
});

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

buttons.forEach((button) => {
    button.addEventListener("click", createRipple);
});

// Slide out the current site and slide in the other site
function slideLeftAndReplace() {
    const currentSiteWrapper = document.getElementById("current-site-wrapper");
    const otherSiteWrapper = document.getElementById("other-site-wrapper");

    currentSiteWrapper.classList.add("slide-out-left");
    otherSiteWrapper.classList.add("slide-in-right");

    setTimeout(() => {
        // Update sites
        currentSite = otherSite;
        otherSite = getRandSite(currentSite);

        // Update UI for current site
        let convertToNumberC = currentSite.co2_per_year * 1;
        document.getElementById("site-name").innerText = currentSite.name;
        currentSiteWrapper.style.backgroundImage = `url('${currentSite.image_url}')`;
        document.getElementById("co2-per-year").innerText = convertToNumberC.toLocaleString() + " tons";

        // Update UI for other site
        document.getElementById("other-site-name").innerText = otherSite.name;
        otherSiteWrapper.style.backgroundImage = `url('${otherSite.image_url}')`;
        document.getElementById("other-site-co2").innerText = "";

        // Remove the slide-out and slide-in classes after the transition finishes
        currentSiteWrapper.classList.remove("slide-out-left");
        otherSiteWrapper.classList.remove("slide-in-right");

        // Re-enable buttons (Disabled during transition to prevent double-clicking-bug)
        document.getElementById("higher-btn").disabled = false;
        document.getElementById("lower-btn").disabled = false;
    }, 1000); // Adjust this time to match the transition duration in your CSS
}

// Update the UI with new data
function updateUI() {
    if (!sites || sites.length === 0) {
        console.error('Site data is missing or not loaded properly');
        return;
    }

    currentSite = getRandSite(otherSite);
    otherSite = getRandSite(currentSite);

    let convertToNumberC = currentSite.co2_per_year * 1;

    // Update UI for current site (left side)
    const siteNameElement = document.getElementById("site-name");
    const currentSiteWrapperElement = document.getElementById("current-site-wrapper");
    const co2PerYearElement = document.getElementById("co2-per-year");
    if (siteNameElement && currentSiteWrapperElement && co2PerYearElement) {
        siteNameElement.innerText = currentSite.name;
        currentSiteWrapperElement.style.backgroundImage = `url('${currentSite.image_url}')`;
        co2PerYearElement.innerText = convertToNumberC.toLocaleString() + " tons";
    } else {
        console.error('Unable to update UI elements');
    }

    // Update UI for other site (right side)
    const otherSiteNameElement = document.getElementById("other-site-name");
    const otherSiteWrapperElement = document.getElementById("other-site-wrapper");
    if (otherSiteNameElement && otherSiteWrapperElement) {
        otherSiteNameElement.innerText = otherSite.name;
        otherSiteWrapperElement.style.backgroundImage = `url('${otherSite.image_url}')`;
    } else {
        console.error('Unable to update UI elements for the other site');
    }
}

// Event listeners
function showResult() {
    clearInterval(shuffleInterval);
    document.getElementById("other-site-co2").innerText = otherSite.co2_per_year.toLocaleString() + " tons";
}

// Display game over screen
function showGameOver() {
    if (score > highScore) {
        highScore = score;
        document.getElementById("high-score").innerText = "High Score: " + highScore;
    }

    let difference = Math.abs(currentSite.co2_per_year - otherSite.co2_per_year);
    let moreOrLess = parseFloat(currentSite.co2_per_year) > parseFloat(otherSite.co2_per_year) ? "less" : "more";

    let convertToNumber = otherSite.co2_per_year * 1; // to get decimals cuz shits not working

    document.getElementById("result").innerHTML = `Sorry, that's incorrect. Game over.<br><br>
                                                   ${otherSite.name} has <span class="highlight">${convertToNumber.toLocaleString()} tons</span> of CO2 emissions per year, 
                                                   which is <span class="highlight ${moreOrLess === 'more' ? 'red-text' : ''}">${difference.toLocaleString()} tons</span> ${moreOrLess} than the website on the left.`;
    document.getElementById("higher-btn").style.display = "none";
    document.getElementById("lower-btn").style.display = "none";
    document.getElementById("try-again-btn").style.display = "block";
    document.getElementById("result").classList.add('endgame-text');
}

// Shuffle the co2 number
function shuffleSiteCo2() {
    let shuffledCo2 = Math.floor(Math.random() * (otherSite.co2_per_year * 1.5));
    document.getElementById("other-site-co2").innerText = shuffledCo2.toLocaleString() + " tons";
}

// Stop the shuffle and show the final co2 number
function stopShuffleAndShowFinalCo2() {
    let convertToNumber = otherSite.co2_per_year * 1; // to get decimals cuz shits not working
    clearInterval(shuffleInterval);
    document.getElementById("other-site-co2").innerText = convertToNumber.toLocaleString() + " tons";
}

// Event handlers
function higherClicked() {
    // Disable buttons (Disabled during transition to prevent double-clicking-bug)
    document.getElementById("higher-btn").disabled = true;
    document.getElementById("lower-btn").disabled = true;
    shuffleInterval = setInterval(shuffleSiteCo2, 100);
    setTimeout(() => {
        stopShuffleAndShowFinalCo2();
        if (parseFloat(otherSite.co2_per_year) > parseFloat(currentSite.co2_per_year)) {
            score++;
            document.getElementById("score").innerText = "Score: " + score;
            document.getElementById("result").innerText = "Correct!";
            hideResult();
            slideLeftAndReplace();
        } else {
            showGameOver();
        }
    }, 1200);
}

// Event handlers
function lowerClicked() {
    // Disable buttons (Disabled during transition to prevent double-clicking-bug)
    document.getElementById("higher-btn").disabled = true;
    document.getElementById("lower-btn").disabled = true;

    // Shuffle the sites
    shuffleInterval = setInterval(shuffleSiteCo2, 100);

    // Show the result
    setTimeout(() => {
        stopShuffleAndShowFinalCo2();
        if (parseFloat(otherSite.co2_per_year) < parseFloat(currentSite.co2_per_year)) {
            score++;
            document.getElementById("score").innerText = "Score: " + score;
            document.getElementById("result").innerText = "Correct!";
            hideResult();
            slideLeftAndReplace();
        } else {
            showGameOver();
        }
    }, 1200);
}

// Reset the game
function tryAgainClicked() {
    // Re-enable buttons (Disabled during transition to prevent double-clicking-bug)
    document.getElementById("higher-btn").disabled = false;
    document.getElementById("lower-btn").disabled = false;
    score = 0;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("result").innerText = "";
    document.getElementById("result").classList.remove('endgame-text');
    document.getElementById("higher-btn").style.display = "block";
    document.getElementById("lower-btn").style.display = "block";
    document.getElementById("try-again-btn").style.display = "none";
    document.getElementById("other-site-co2").innerText = "";
    updateUI();
}

// Hide the result text after 1 second
function hideResult() {
    setTimeout(() => {
        document.getElementById("result").innerText = "";
    }, 1000);
}


// Main code
updateUI();
document.getElementById("high-score").innerText = "High Score: " + highScore;

document.getElementById("higher-btn").addEventListener("click", higherClicked);
document.getElementById("lower-btn").addEventListener("click", lowerClicked);
document.getElementById("try-again-btn").addEventListener("click", tryAgainClicked);