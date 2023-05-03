// Define variables
let score = 0;
let highScore = 0;
let currentSite = null;
let otherSite = null;
let sites = [
	{
		name: "Google",
		image: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
		co2PerYear: 250000
	},
	{
		name: "Twitter",
		image: "https://abs.twimg.com/responsive-web/client-web-legacy/icon-ios.8ea219d2.png",
		co2PerYear: 120000
	},
	{
		name: "Netflix",
		image: "https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.png",
		co2PerYear: 1000000
	},
	{
		name: "Amazon",
		image: "https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQ.91cd4af8fc844e15b0d16fcf60f6e49b6c385e6c.png",
		co2PerYear: 440000
	},
	{
		name: "Wikipedia",
		image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png",
		co2PerYear: 70000
	},
	{
		name: "Etsy",
		image: "https://www.etsy.com/assets/press/etsy_logo_250x200-486db6a02a01232b4f0bca9912299db4.png?cb=20210317173353",
		co2PerYear: 30000
	}
];

// Define functions
function getRandSite(excludeSite) {
    let filteredSites = sites.filter(site => site !== excludeSite);
    let randIndex = Math.floor(Math.random() * filteredSites.length);
    return filteredSites[randIndex];
}

function updateUI() {
    currentSite = getRandSite(otherSite);
    otherSite = getRandSite(currentSite);

    // Update UI for current site
    document.getElementById("site-name").innerText = currentSite.name;
    document.getElementById("current-site-wrapper").style.backgroundImage = `url('${currentSite.image}')`;
    document.getElementById("co2-per-year").innerText = currentSite.co2PerYear.toLocaleString() + " tons";

    // Update UI for other site
    document.getElementById("other-site-name").innerText = otherSite.name;
    document.getElementById("other-site-wrapper").style.backgroundImage = `url('${otherSite.image}')`;
}

function showGameOver() {
    if (score > highScore) {
        highScore = score;
        document.getElementById("high-score").innerText = "High Score: " + highScore;
    }
    
    let difference = Math.abs(currentSite.co2PerYear - otherSite.co2PerYear);
    let moreOrLess = currentSite.co2PerYear > otherSite.co2PerYear ? "less" : "more";
    let funFacts = [
        "That's the same amount of CO2 emitted by driving around the Earth 100 times!",
        "That's equivalent to the yearly emissions of a small island country!",
        "That's as much CO2 as 10,000 cows emit in a year!"
    ];
    let randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];

    document.getElementById("result").innerHTML = `Sorry, that's incorrect. Game over.<br><br>
                                                   The website on the right has <span class="highlight">${otherSite.co2PerYear.toLocaleString()} tons</span> of CO2 emissions per year, 
                                                   which is <span class="highlight">${difference.toLocaleString()} tons</span> ${moreOrLess} than the website on the left.<br><br>
                                                   ${randomFunFact}`;
    document.getElementById("higher-btn").style.display = "none";
    document.getElementById("lower-btn").style.display = "none";
    document.getElementById("try-again-btn").style.display = "block";
}

function higherClicked() {
    if (currentSite.co2PerYear > otherSite.co2PerYear) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        document.getElementById("result").innerText = "Correct!";
        updateUI();
    } else {
        showGameOver();
    }
}

function lowerClicked() {
    if (currentSite.co2PerYear < otherSite.co2PerYear) {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        document.getElementById("result").innerText = "Correct!";
        updateUI();
    } else {
        showGameOver();
    }
}

function tryAgainClicked() {
    score = 0;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("result").innerText = "";
    document.getElementById("higher-btn").style.display = "block";
    document.getElementById("lower-btn").style.display = "block";
    document.getElementById("try-again-btn").style.display = "none";
    updateUI();
}

// Main code
updateUI();
document.getElementById("high-score").innerText = "High Score: " + highScore;

document.getElementById("higher-btn").addEventListener("click", higherClicked);
document.getElementById("lower-btn").addEventListener("click", lowerClicked);
document.getElementById("try-again-btn").addEventListener("click", tryAgainClicked);