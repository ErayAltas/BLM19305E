if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("sw registered!");
        console.log(registration);
    }).catch(err => {
        console.log("sw failed!");
        console.log(err);
    })
}

const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const copyIcon = document.querySelector(".input-box span");
const moodIcon = document.querySelector(".pass-strength span");
const passwordInput = document.querySelector(".input-box input");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");

var passStrengthValue = 0;

const updateCbCount = () => {
    options.forEach(option => {
        option.addEventListener('change', function () {
            if (this.checked) {
                passStrengthValue += 10;
                updatePassIndicator();
                generatePassword();
            } else {
                passStrengthValue -= 10;
                updatePassIndicator();
                generatePassword();
            }
        });
    });
}

updateCbCount();

const characters = { // object of letters, numbers & symbols
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "^!$%&|[](){}:;.,*+-#@<>~"
}

const generatePassword = () => {
    let staticPassword = "";
    let randomPassword = "";
    let excludeDuplicate = false;
    let passLength = lengthSlider.value;

    options.forEach(option => { // looping through each options checkbox
        if (option.checked) {
            // if checkbox id isn't exc-duplicate && spaces
            if (option.id !== "exc-duplicate" && option.id !== "spaces") {
                // adding particular key value from character object to staticPassword
                staticPassword += characters[option.id];
            } else if (option.id === "spaces") {
                staticPassword += `  ${staticPassword}  `; // adding space at the beginning & end of staticPassword
            } else {
                excludeDuplicate = true;
            }
        }
    });

    for (let i = 0; i < passLength; i++) {
        // getting random character from the static password
        let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
        if (excludeDuplicate) { // if excludeDuplicate is true
            !randomPassword.includes(randomChar) || randomChar == " " ? randomPassword += randomChar : i--;
        } else { // else add random character to randomPassword
            randomPassword += randomChar;
        }
    }
    passwordInput.value = randomPassword;
}

const updatePassIndicator = () => {
    console.log("id :" + passIndicator.id);
    console.log("value :" + lengthSlider.value);
    console.log("strength :" + passStrengthValue);

    if (passStrengthValue < 36) {
        passIndicator.id = "weak";
        moodIcon.innerText = "sentiment_dissatisfied";
    }
    if (passStrengthValue >= 36 && passStrengthValue <= 50) {
        passIndicator.id = "medium";
        moodIcon.innerText = "sentiment_neutral";

    }
    if (passStrengthValue > 50) {
        passIndicator.id = "strong";
        moodIcon.innerText = "sentiment_satisfied";

    }

}

const updateSlider = () => {
    // passing slider value
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    passStrengthValue = lengthSlider.value * 2;
    generatePassword();
    updatePassIndicator();
}

updateSlider();
updatePassIndicator();

const copyPassword = () => {
    var textArea = document.createElement("textarea");
    textArea.value = passwordInput.value;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
    copyIcon.innerText = "check"; // changing copy icon to tick
    copyIcon.style.color = "#4285F4";
    setTimeout(() => { // after 1500 ms, changing tick icon back to copy
        copyIcon.innerText = "copy_all";
        copyIcon.style.color = "#707070";
    }, 1500);
}

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);