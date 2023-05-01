let question_dict = {
    "Question 1": "Test",
    "Question 2": "Test",
    "Question 3": "Test",
    "Question 4": "Test",
    "Question 5": "Test",
};

function checkAnswer(){

    const title_text = document.getElementById('question-title');

    console.log(title_text);

    const title = title_text.innerText;

    console.log(title);

    const textfield = document.getElementById('text-field');
    const given_answer = textfield.value;

    console.log("Talking about: " + title_text);

    console.log("The given answer is: " + given_answer);

    let right_answer = question_dict[title_text]

    if (given_answer == right_answer) {
        console.log("The answer is correct");
        textfield.value = "";
    } else {
        console.log("The answer was incorrect, the correct answer is: " + right_answer);
    };

};

function setProgress(){
    const ogham = document.getElementById('saille')

    console.log("Check this")

    var ogham_class = ogham.className;

    console.log(ogham_class);

    if (ogham_class == "ogham-zero") {
        ogham.style.height = "6vh";
    };
};
