(function () {
    "use strict";

    const DIFFICULTIES = [
        { label: "Slow", duration: 2000, digits: 3 },
        { label: "Lazy", duration: 2000, digits: 4 },
        { label: "Basic", duration: 1500, digits: 4 },
        { label: "Active", duration: 1000, digits: 5 },
        { label: "Clever", duration: 1500, digits: 6 },
        { label: "Smart", duration: 1200, digits: 7 },
    ];

    const AUTO_NEXT_DELAY = 500;

    const dom = {
        difficultyLabel: document.getElementById("difficulty"),
        difficultyIndicator: document.getElementById("difficulty_indicator"),
        digits: document.getElementById("digits"),
        touchInput: document.getElementById("touch_input"),
        statusIcon: document.getElementById("status_icon"),
        progressIndicator: document.getElementById("progress_indicator"),
        btnStart: document.getElementById("btn_start"),
        prevDifficulty: document.getElementById("prev_difficulty"),
        nextDifficulty: document.getElementById("next_difficulty"),
    };

    let currentDifficulty = 2;
    let watchingDuration = 0;
    let puzzle = [];
    let digitCursor = 0;
    let animationId = null;

    function wrapIndex(index, length) {
        return ((index % length) + length) % length;
    }

    function setDifficulty(index) {
        currentDifficulty = wrapIndex(index, DIFFICULTIES.length);
        const config = DIFFICULTIES[currentDifficulty];

        dom.difficultyLabel.textContent = config.label;
        watchingDuration = config.duration;

        generateDigitSlots(config.digits);
        generateStars(currentDifficulty + 1);
    }

    function generateDigitSlots(count) {
        dom.digits.innerHTML = "";

        for (let i = 0; i < count; i++) {
            const slot = document.createElement("h1");
            slot.textContent = "?";
            dom.digits.appendChild(slot);
        }
    }

    function generateStars(count) {
        dom.difficultyIndicator.innerHTML = "";

        for (let i = 0; i < count; i++) {
            dom.difficultyIndicator.appendChild(document.createElement("div"));
        }
    }

    function getDigitSlots() {
        return dom.digits.querySelectorAll("h1");
    }

    function getInputButtons() {
        return Array.from(dom.touchInput.children).filter(
            (el) => !el.id
        );
    }

    function setInputEnabled(enabled) {
        const buttons = getInputButtons();
        const color = enabled ? "white" : "rgb(90, 90, 90)";

        for (const button of buttons) {
            if (enabled) {
                button.addEventListener("click", handleDigitInput);
            } else {
                button.removeEventListener("click", handleDigitInput);
            }
            button.style.color = color;
        }
    }

    function checkAnswer(slotIndex, inputValue) {
        const slots = getDigitSlots();
        const correctAnswer = (puzzle[slotIndex] + 1) % 10;

        slots[slotIndex].textContent = inputValue;
        slots[slotIndex].classList.toggle("correct", inputValue === correctAnswer);
        slots[slotIndex].classList.toggle("wrong", inputValue !== correctAnswer);
    }

    function handleDigitInput(e) {
        const inputValue = parseInt(e.target.textContent, 10);
        const slots = getDigitSlots();

        checkAnswer(digitCursor, inputValue);
        digitCursor++;

        if (digitCursor >= slots.length) {
            setInputEnabled(false);
            setTimeout(startNewGame, AUTO_NEXT_DELAY);
        }
    }

    function cancelAnimation() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function startNewGame() {
        cancelAnimation();

        dom.btnStart.src = "images/reload.svg";

        const slots = getDigitSlots();
        digitCursor = 0;
        puzzle = [];

        setInputEnabled(false);

        for (const slot of slots) {
            const randomDigit = Math.floor(Math.random() * 10);
            puzzle.push(randomDigit);
            slot.textContent = randomDigit;
            slot.className = "";
        }

        dom.statusIcon.src = "images/eye.svg";
        dom.progressIndicator.style.width = "0";

        const startTime = performance.now();

        function animate(now) {
            const elapsed = now - startTime;

            if (elapsed >= watchingDuration) {
                dom.statusIcon.src = "images/keyboard.svg";
                dom.progressIndicator.style.width = "0";

                for (const slot of slots) {
                    slot.textContent = "-";
                }

                setInputEnabled(true);
                animationId = null;
                return;
            }

            dom.progressIndicator.style.width =
                Math.round((elapsed / watchingDuration) * 100) + "%";
            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }

    dom.prevDifficulty.addEventListener("click", function () {
        setDifficulty(currentDifficulty - 1);
        startNewGame();
    });

    dom.nextDifficulty.addEventListener("click", function () {
        setDifficulty(currentDifficulty + 1);
        startNewGame();
    });

    dom.btnStart.closest("div").addEventListener("click", function () {
        startNewGame();
    });

    setDifficulty(currentDifficulty);
})();
