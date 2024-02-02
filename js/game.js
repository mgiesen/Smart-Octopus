var game_mode = "compare";
var game_difficulty = 3;
var watching_duration = -1;

var puzzle = [];
var digit_cursor = 0;
var input_enabled = false;

set_difficulty(3);

function generate_stars(count)
{
    var container = document.getElementById("difficulty_indicator");

    container.innerHTML = "";

    for (let i = 0; i < count; i++)
    {
        var digit = document.createElement("div");
        container.append(digit);
    }
}

function set_difficulty(difficulty)
{
    let label = document.getElementById("difficulty");

    if (difficulty < 1)
    {
        difficulty = 6;
    }
    else if (difficulty > 6)
    {
        difficulty = 1;
    }

    switch (difficulty)
    {
        case 1:
            label.innerText = "Slow";
            watching_duration = 2000;
            generate_digits(3);
            break;
        case 2:
            label.innerText = "Lazy";
            watching_duration = 2000;
            generate_digits(4);
            break;
        case 3:
            label.innerText = "Basic";
            watching_duration = 1500;
            generate_digits(4);
            break;
        case 4:
            label.innerText = "Active";
            watching_duration = 1000;
            generate_digits(5);
            break;
        case 5:
            label.innerText = "Clever";
            watching_duration = 1500;
            generate_digits(6);
            break;
        case 6:
            label.innerText = "Smart";
            watching_duration = 1200;
            generate_digits(7);
            break;
        default:
            alert("Unvalid difficulty level!");
    }

    generate_stars(difficulty);

    game_difficulty = difficulty;

}

function generate_digits(count)
{

    var container = document.getElementById("digits");

    container.innerHTML = "";

    for (let i = 0; i < count; i++)
    {
        var digit = document.createElement("h1");
        digit.innerText = "?";
        container.append(digit);
    }

}

document.getElementById("prev_difficulty").addEventListener("click", function ()
{
    set_difficulty(game_difficulty - 1);
    start_new_game();
});

document.getElementById("next_difficulty").addEventListener("click", function ()
{
    set_difficulty(game_difficulty + 1);
    start_new_game();
});

function check_digit(input)
{
    var digits = document.getElementById("digits").getElementsByTagName("h1");
    digits[digit_cursor].innerText = input.innerText;

    let correct_answer = puzzle[digit_cursor] == 9 ? 0 : puzzle[digit_cursor] + 1;

    if (input.innerText == correct_answer)
    {
        digits[digit_cursor].className = "correct";
    }
    else
    {
        digits[digit_cursor].className = "wrong";
    }

}

var touch_click = function (e)
{
    var digits = document.getElementById("digits").getElementsByTagName("h1");
    var input_digit = e.target;

    check_digit(input_digit);

    digit_cursor++;

    if (digit_cursor == digits.length)
    {
        setTimeout(function ()
        {
            start_new_game();
        }, 500);
    }
};

function enable_digit_events(trigger)
{

    var inputs = document.getElementById("touch_input").getElementsByTagName("div");

    for (input of inputs)
    {

        if (input.id != "")
        {
            continue;
        }

        if (trigger == true)
        {

            input.addEventListener('click', touch_click, true);
            input.style.color = "white";

        } else
        {

            input.removeEventListener("click", touch_click, true);
            input.style.color = "rgb(90, 90, 90)";

        }

    }

    input_enabled = trigger;

}

function start_new_game()
{

    document.getElementById("btn_start").src = "images/reload.svg";

    var digits = document.getElementById("digits").getElementsByTagName("h1");

    var start_button = document.getElementById("status_icon");
    var start_button_indicator = document.getElementById("progress_indicator");

    digit_cursor = 0;
    puzzle = [];

    enable_digit_events(false);

    for (var i = 0; i < digits.length; i++)
    {
        var rnd_digit = Math.floor(Math.random() * 10);
        puzzle.push(rnd_digit);
        digits[i].innerText = rnd_digit;
        digits[i].className = "";
    }

    start_button.src = "images/eye.svg";

    var start = new Date();
    var animate = setInterval(function ()
    {

        var now = new Date();
        var past_duration = now.getTime() - start.getTime();

        if (past_duration >= watching_duration)
        {

            clearInterval(animate);
            start_button.src = "images/keyboard.svg";
            start_button_indicator.style.width = "0px";

            for (var i = 0; i < digits.length; i++)
            {
                digits[i].innerText = "-";
            }

            enable_digit_events(true);

        } else
        {
            start_button_indicator.style.width = parseInt(past_duration / watching_duration * 100) + "%";
        }

    }, 1);

}

var digit_objects = document.getElementById("digit_container");
var correct_digits = [];


var input_allowed = false;

function start_game()
{
    var button = document.getElementById("btn_main");
    button.classList.remove("button_effects");
    button.onclick = "";

    document.getElementById("icon_mouse").style.display = "none";

    start_new_set();
}

function start_new_set()
{

    input_allowed = false;

    reset_digit_correction();

    document.getElementById("icon_watch").style.display = "block";
    document.getElementById("icon_keyboard").style.display = "none";
    document.getElementById("progress_indicator").style.display = "block";

    //Generiere neue Zahlen
    for (var digit = 0; digit < digit_objects.childElementCount; digit++)
    {

        var rnd_number = Math.floor(Math.random() * 9);
        digit_objects.children[digit].innerHTML = rnd_number;

        var sum = rnd_number + 0;
        correct_digits[digit] = (sum <= 9 ? sum : sum - 8);
    }

    //Starte Interval
    var start = new Date();
    var animate = setInterval(function ()
    {
        var now = new Date();
        var past_duration = now.getTime() - start.getTime();
        if (past_duration >= watching_duration)
        {
            clearInterval(animate);
            start_new_input();
        } else
        {
            document.getElementById("progress_indicator").style.width = parseInt(past_duration / watching_duration * 100) + "%";
        }
    }, 1);

}

function start_new_input()
{

    input_allowed = true;

    document.getElementById("icon_watch").style.display = "none";
    document.getElementById("icon_keyboard").style.display = "block";
    document.getElementById("progress_indicator").style.display = "none";

    //Setze Eingabefelder zurück
    for (var digit = 0; digit < digit_objects.childElementCount; digit++)
    {
        digit_objects.children[digit].innerHTML = "_";
    }

}

function reset_digit_correction()
{
    for (var digit = 0; digit < digit_objects.childElementCount; digit++)
    {
        digit_objects.children[digit].classList.remove("wrong");
        digit_objects.children[digit].classList.remove("correct");
    }
}

window.addEventListener("keypress", (event) =>
{
    if (input_allowed)
    {
        for (var digit = 0; digit < digit_objects.childElementCount; digit++)
        {

            if (digit_objects.children[digit].innerHTML == "_")
            {
                digit_objects.children[digit].innerHTML = event.key;
                if (event.key == correct_digits[digit])
                {
                    digit_objects.children[digit].classList.remove("wrong");
                    digit_objects.children[digit].classList.add("correct");
                } else
                {
                    digit_objects.children[digit].classList.add("wrong");
                    digit_objects.children[digit].classList.remove("correct");
                }

                if (digit_objects.children[digit_objects.childElementCount - 1].innerHTML != "_")
                {
                    setTimeout(function ()
                    {
                        start_new_set();
                    }, 500);
                }

                return;
            }

        }

        if (event.key == 8)
        {

            for (var digit = 0; digit < digit_objects.childElementCount; digit++)
            {

                if (digit_objects.children[digit].innerHTML == "_")
                {
                    digit_objects.children[digit - 1].innerHTML = "_";
                }

            }
        }
    }
});

