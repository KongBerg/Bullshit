// Define variables
let score = 0;
let currentSiteIndex = 0;
let sites = [
  {
    name: "Google",
    image: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    co2PerMonth: 250000
  },
  {
    name: "Twitter",
    image: "https://abs.twimg.com/responsive-web/client-web-legacy/icon-ios.8ea219d2.png",
    co2PerMonth: 120000
  },
  {
    name: "Netflix",
    image: "https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.png",
    co2PerMonth: 1000000
  },
  {
    name: "Amazon",
    image: "https://d1.awsstatic.com/logos/aws-logo-lockups/poweredbyaws/PB_AWS_logo_RGB_stacked_REV_SQ.91cd4af8fc844e15b0d16fcf60f6e49b6c385e6c.png",
    co2PerMonth: 440000
  }
];

// Define functions
function getRandSite() {
  let randIndex = Math.floor(Math.random() * sites.length);
  return sites[randIndex];
}

function updateUI() {
  let currentSite = sites[currentSiteIndex];
  let otherSite = getRandSite();
  let co2PerYear = currentSite.co2PerMonth * 12;
  
  // Update UI for current site
  document.getElementById("site-name").innerText = currentSite.name;
  document.getElementById("site-image").src = currentSite.image;
  document.getElementById("co2-per-year").innerText = co2PerYear.toLocaleString() + " tons";
  
  // Update UI for other site
  document.getElementById("other-site-image").src = otherSite.image;
}

function higherClicked() {
  let currentSite = sites[currentSiteIndex];
  let otherSite = getRandSite();
  
  if (currentSite.co2PerMonth > otherSite.co2PerMonth) {
    score++;
    currentSiteIndex++;
    updateUI();
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("result").innerText = "Correct!";
  } else {
    score = 0;
    currentSiteIndex = 0;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("result").innerText = "Sorry, that's incorrect. Game over.";
  }
}

function lowerClicked() {
  let currentSite = sites[currentSiteIndex];
  let otherSite = getRandSite();
  
  if (currentSite.co2PerMonth < otherSite.co2PerMonth) {
    score++;
    currentSiteIndex++;
    updateUI();
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("result").innerText = "Correct!";
  } else {
    score = 0;
    currentSiteIndex = 0;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("result").innerText = "Sorry, that's incorrect. Game over.";
  }
}

// Main code
updateUI();

document.getElementById("higher-btn").addEventListener("click", higherClicked);
document.getElementById("lower-btn").addEventListener("click", lowerClicked);