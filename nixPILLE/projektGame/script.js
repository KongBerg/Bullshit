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

  console.log("Script.js loaded and executed");


// Define functions
function getRandSite(excludeSite) {
    let filteredSites = sites.filter(site => site !== excludeSite);
    let randIndex = Math.floor(Math.random() * filteredSites.length);
    return filteredSites[randIndex];
}

function updateUI() {
    if (!sites || sites.length === 0) {
        console.error('Site data is missing or not loaded properly');
        return;
    }

    currentSite = getRandSite(otherSite);
    otherSite = getRandSite(currentSite);

    // Update UI for current site
    const siteNameElement = document.getElementById("site-name");
    const currentSiteWrapperElement = document.getElementById("current-site-wrapper");
    const co2PerYearElement = document.getElementById("co2-per-year");
    if (siteNameElement && currentSiteWrapperElement && co2PerYearElement) {
        siteNameElement.innerText = currentSite.name;
        currentSiteWrapperElement.style.backgroundImage = `url('${currentSite.image_url}')`;
        co2PerYearElement.innerText = currentSite.co2_per_year.toLocaleString() + " tons";
    } else {
        console.error('Unable to update UI elements');
    }

    // Update UI for other site
    const otherSiteNameElement = document.getElementById("other-site-name");
    const otherSiteWrapperElement = document.getElementById("other-site-wrapper");
    if (otherSiteNameElement && otherSiteWrapperElement) {
        otherSiteNameElement.innerText = otherSite.name;
        otherSiteWrapperElement.style.backgroundImage = `url('${otherSite.image_url}')`;
    } else {
        console.error('Unable to update UI elements for the other site');
    }
}


function showResult() {
    clearInterval(shuffleInterval);
    document.getElementById("other-site-co2").innerText = otherSite.co2_per_year.toLocaleString() + " tons";
}

function slideLeftAndReplace() {
    document.getElementById("current-site-wrapper").classList.add("slide-out-left");
    document.getElementById("other-site-wrapper").classList.add("slide-out-left");
    setTimeout(() => {
        document.getElementById("current-site-wrapper").classList.remove("slide-out-left");
        document.getElementById("other-site-wrapper").classList.remove("slide-out-left");
        currentSite = otherSite;
        otherSite = getRandSite(currentSite);

        // Update UI for current site
        document.getElementById("site-name").innerText = currentSite.name;
        document.getElementById("current-site-wrapper").style.backgroundImage = `url('${currentSite.image_url}')`;
        document.getElementById("co2-per-year").innerText = currentSite.co2_per_year.toLocaleString() + " tons";

        // Update UI for other site
        document.getElementById("other-site-name").innerText = otherSite.name;
        document.getElementById("other-site-wrapper").style.backgroundImage = `url('${otherSite.image_url}')`;
        document.getElementById("other-site-co2").innerText = "";
    }, 1000);
}

function showGameOver() {
    if (score > highScore) {
        highScore = score;
        document.getElementById("high-score").innerText = "High Score: " + highScore;
    }
    
    let difference = Math.abs(currentSite.co2_per_year - otherSite.co2_per_year);
    let moreOrLess = currentSite.co2_per_year > otherSite.co2_per_year ? "less" : "more";
	let funFacts = [
		"That's the same amount of CO2 emitted by driving around the Earth 100 times!",
		"That's equivalent to the yearly emissions of a small island country!",
		"That's as much CO2 as 10,000 cows emit in a year!",
		"That's equivalent to the CO2 emissions of a coal-fired power plant running for a week!",
		"That's the same as the emissions produced by 50,000 loads of laundry!",
		"That's like burning 1 million pounds of coal!",
		"That's the amount of CO2 a forest of 100,000 trees can absorb in a year!",
		"That's the same as the CO2 emitted by charging 200 million smartphones!",
		"That's the equivalent of flying a jumbo jet halfway around the world!",
		"That's as much CO2 as the yearly emissions of 1,000 cars!",
		"That's equivalent to the CO2 emissions of 50,000 propane-powered barbecues!",
		"That's the same as the CO2 emitted by 500,000 train rides!",
		"That's like the emissions of a rocket launch to the International Space Station!"
	];
	
    let randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];

    document.getElementById("result").innerHTML = `Sorry, that's incorrect. Game over.<br><br>
                                                   The website on the right has <span class="highlight">${otherSite.co2_per_year.toLocaleString()} tons</span> of CO2 emissions per year, 
                                                   which is <span class="highlight">${difference.toLocaleString()} tons</span> ${moreOrLess} than the website on the left.<br><br>
                                                   ${randomFunFact}`;
    document.getElementById("higher-btn").style.display = "none";
    document.getElementById("lower-btn").style.display = "none";
    document.getElementById("try-again-btn").style.display = "block";
}

function shuffleSiteCo2() {
    let shuffledCo2 = Math.floor(Math.random() * (otherSite.co2_per_year * 1.2));
    document.getElementById("other-site-co2").innerText = shuffledCo2.toLocaleString() + " tons";
}

function stopShuffleAndShowFinalCo2() {
    clearInterval(shuffleInterval);
    document.getElementById("other-site-co2").innerText = otherSite.co2_per_year.toLocaleString() + " tons";
}

function higherClicked() {
    shuffleInterval = setInterval(shuffleSiteCo2, 100);
    setTimeout(() => {
        stopShuffleAndShowFinalCo2();
        if (currentSite.co2_per_year > otherSite.co2_per_year) {
            score++;
            document.getElementById("score").innerText = "Score: " + score;
            document.getElementById("result").innerText = "Correct!";
            slideLeftAndReplace();
        } else {
            showGameOver();
        }
    }, 2000);
}

function lowerClicked() {
    shuffleInterval = setInterval(shuffleSiteCo2, 100);
    setTimeout(() => {
        stopShuffleAndShowFinalCo2();
        if (currentSite.co2_per_year < otherSite.co2_per_year) {
            score++;
            document.getElementById("score").innerText = "Score: " + score;
            document.getElementById("result").innerText = "Correct!";
            slideLeftAndReplace();
        } else {
            showGameOver();
        }
    }, 2000);
}

function tryAgainClicked() {
    score = 0;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("result").innerText = "";
    document.getElementById("higher-btn").style.display = "block";
    document.getElementById("lower-btn").style.display = "block";
    document.getElementById("try-again-btn").style.display = "none";
    document.getElementById("other-site-co2").innerText = "";
    updateUI();
}


// Main code
updateUI();
document.getElementById("high-score").innerText = "High Score: " + highScore;

document.getElementById("higher-btn").addEventListener("click", higherClicked);
document.getElementById("lower-btn").addEventListener("click", lowerClicked);
document.getElementById("try-again-btn").addEventListener("click", tryAgainClicked);