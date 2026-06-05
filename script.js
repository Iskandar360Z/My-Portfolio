document.addEventListener("DOMContentLoaded", function() {

    const themeToggleBtn = document.getElementById("theme-toggle");
    
    // Check browser memory to see if user previously set a preference
    const savedTheme = localStorage.getItem("portfolio-theme");

    // Default site style is Light Mode. If memory says "dark", turn on Dark Mode.
    if (savedTheme === "dark") {
        document.documentElement.classList.add("dark-mode");
        if (themeToggleBtn) {
            themeToggleBtn.textContent = "Toggle Light Mode";
        }
    } else {
        if (themeToggleBtn) {
            themeToggleBtn.textContent = "Toggle Dark Mode";
        }
    }

    // Monitor when the button is clicked to flip the themes dynamically
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function() {
            // Toggle the .dark-mode class on the html element to match inline check
            document.documentElement.classList.toggle("dark-mode");

            // Update button labels and save the choice in localStorage memory
            if (document.documentElement.classList.contains("dark-mode")) {
                themeToggleBtn.textContent = "Toggle Light Mode";
                localStorage.setItem("portfolio-theme", "dark");  // Remember Dark Theme
            } else {
                themeToggleBtn.textContent = "Toggle Dark Mode";
                localStorage.setItem("portfolio-theme", "light"); // Remember Light Theme
            }
        });
    }

    const greetingElement = document.getElementById("greeting");
    const dateTimeElement = document.getElementById("date-time-display");
    
    if (greetingElement && dateTimeElement) {
        // 1. Run the greeting calculation ONCE so it doesn't waste processing cycles repeating every second
        const now = new Date();
        const hours = now.getHours();
        let dynamicGreeting = "Good evening";

        if (hours < 12) {
            dynamicGreeting = "Good morning";
        } else if (hours < 18) {
            dynamicGreeting = "Good afternoon";
        }

        greetingElement.textContent = `${dynamicGreeting}! Welcome to my portfolio!`;

        // 2. 🕒 START THE LIVE TICKING LOOP FOR THE TIME STRING (Updates every 1000ms = 1 second)
        setInterval(function() {
            const liveNow = new Date();
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const currentDateString = liveNow.toLocaleDateString('en-US', options);
            
            // Keeps the individual seconds values incrementing live right on the viewport header card
            const currentTimeString = liveNow.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });

            dateTimeElement.textContent = `${currentDateString} at ${currentTimeString}`;
        }, 1000);
    }

    // ==========================================================================
    // WEEK 6: RANDOMIZED CODE CRACKER (WORDLE-STYLE) MINI-GAME SYSTEM
    // ==========================================================================

    let secretCode = [];
    let remainingAttempts = 5;
    const maxAttempts = 5;

    // Grab Core Document Control Nodes for Game Presence Interaction
    const submitGuessBtn = document.getElementById("submit-guess-btn");
    const attemptsLogHolder = document.getElementById("attempts-log-holder");

    // Initialize the Game module variables safely ONLY if we are standing on the interactive page UI
    if (submitGuessBtn && attemptsLogHolder) {
        
        // Contextually locate domestic nodes inside the conditional safety gate
        const digit1Input = document.getElementById("digit-1");
        const digit2Input = document.getElementById("digit-2");
        const digit3Input = document.getElementById("digit-3");
        const restartGameBtn = document.getElementById("restart-game-btn");
        const attemptsCounter = document.getElementById("attempts-left-counter");
        const gameStatusMsg = document.getElementById("game-status-message");

        initializeNewGame();
        
        // Setup Submit Event Listener Click
        submitGuessBtn.addEventListener("click", processUserGuessAttempt);

        // Setup Restart Event Listener Click
        restartGameBtn.addEventListener("click", initializeNewGame);

        // Quality of Life: Automatically skip focus to next text box when typing digits
        [digit1Input, digit2Input, digit3Input].forEach((inputField, index, array) => {
            inputField.addEventListener("input", () => {
                if (inputField.value.length === 1 && index < array.length - 1) {
                    array[index + 1].focus();
                }
            });
        });

        function initializeNewGame() {
            // 1. Generate Randomized Unique 3-Digit Sequence Array
            secretCode = [];
            let digitPool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            
            for (let i = 0; i < 3; i++) {
                let randomIndex = Math.floor(Math.random() * digitPool.length);
                secretCode.push(digitPool[randomIndex]);
                digitPool.splice(randomIndex, 1); // Splices selected out to assure uniqueness
            }

            // Debug logging to help console tracking if needed
            console.log("System Initialized. Secret combination bypass code:", secretCode);

            // 2. Clear out historical DOM states and metrics dashboard
            remainingAttempts = maxAttempts;
            attemptsLogHolder.innerHTML = "";
            attemptsCounter.textContent = `Attempts Remaining: ${remainingAttempts} / ${maxAttempts}`;
            gameStatusMsg.textContent = "Terminal Standby";
            gameStatusMsg.style.color = "#64748b";
            gameStatusMsg.style.background = "none"; // Clears the badge color for the new round
            gameStatusMsg.style.padding = "0";

            // Reset text boxes and enable inputs
            [digit1Input, digit2Input, digit3Input].forEach(field => {
                field.value = "";
                field.disabled = false;
            });

            submitGuessBtn.disabled = false;
            restartGameBtn.style.display = "none";
        }

        function processUserGuessAttempt() {
            // Grab values inside inputs, parse to base 10 integers
            const val1 = parseInt(digit1Input.value.trim());
            const val2 = parseInt(digit2Input.value.trim());
            const val3 = parseInt(digit3Input.value.trim());

            // Evaluation Validation Check: Assure inputs are valid numerical states
            if (isNaN(val1) || isNaN(val2) || isNaN(val3) || val1 < 0 || val1 > 9 || val2 < 0 || val2 > 9 || val3 < 0 || val3 > 9) {
                gameStatusMsg.textContent = "⚠️ Error: Enter valid digits (0-9)";
                gameStatusMsg.style.color = "#ef4444";
                return;
            }

            const currentGuessArray = [val1, val2, val3];
            remainingAttempts--;

            // Build a dynamic Wordle layout history log wrapper row element
            const attemptRowDiv = document.createElement("div");
            attemptRowDiv.className = "attempt-row";

            let correctPlacementsCount = 0;

            // Core Matrix Algorithmic Loop evaluating digits against answer array
            for (let i = 0; i < 3; i++) {
                const currentDigitEvaluated = currentGuessArray[i];
                const tileElement = document.createElement("div");
                tileElement.className = "tile";
                tileElement.textContent = currentDigitEvaluated;

                if (currentDigitEvaluated === secretCode[i]) {
                    // Condition A: Number exists and matches matching index slot
                    tileElement.classList.add("correct");
                    correctPlacementsCount++;
                } else if (secretCode.includes(currentDigitEvaluated)) {
                    // Condition B: Number exists somewhere else inside system combination
                    tileElement.classList.add("misplaced");
                } else {
                    // Condition C: Number is absent from system key array completely
                    tileElement.classList.add("wrong");
                }

                attemptRowDiv.appendChild(tileElement);
            }

            // Output row container block to historical tracker
            attemptsLogHolder.appendChild(attemptRowDiv);
            attemptsCounter.textContent = `Attempts Remaining: ${remainingAttempts} / ${maxAttempts}`;

            // Check overall Game System Status Conditions
            if (correctPlacementsCount === 3) {
                // Victory State Reached!
                gameStatusMsg.textContent = "🔓 Access Granted! Terminal Cracked!";
                // Style as a clean, highly visible badge
                gameStatusMsg.style.background = "#10b981";
                gameStatusMsg.style.color = "#ffffff";
                gameStatusMsg.style.padding = "6px 12px";
                gameStatusMsg.style.borderRadius = "4px";
                endGameSession();
            } else if (remainingAttempts === 0) {
                // Failure Game Over State Reached
                gameStatusMsg.textContent = `🔒 Locked! Code was: ${secretCode.join(" - ")}`;
                // Style as a clean red failure badge
                gameStatusMsg.style.background = "#ef4444";
                gameStatusMsg.style.color = "#ffffff";
                gameStatusMsg.style.padding = "6px 12px";
                gameStatusMsg.style.borderRadius = "4px";
                endGameSession();
            } else {
                // Keep going loop state response
                gameStatusMsg.textContent = "Data Analyzed. Try again.";
                gameStatusMsg.style.color = "#f59e0b";
                
                // Flush out inputs and focus first index box for rapid interaction flow
                [digit1Input, digit2Input, digit3Input].forEach(field => field.value = "");
                digit1Input.focus();
            }
        }

        function endGameSession() {
            [digit1Input, digit2Input, digit3Input].forEach(field => field.disabled = true);
            submitGuessBtn.disabled = true;
            restartGameBtn.style.display = "block";
        }
    }

}); // <-- THIS IS THE VERY LAST END OF YOUR DOMContentLoaded BLOCK