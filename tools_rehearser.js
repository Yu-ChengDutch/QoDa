/* Create an empty dictionary */

let division_questions = {};
let parts_questions = {};

let question_dict = {
    "Question 1": {},
    "Question 2": {},
    "Question 3": {},
    "Question 4": {},
    "Question 5": {}
};

/* Load the database (for now still hardcoded) */

fetch('./data_anatomy_skeletal_bones.json')
            .then(function(response){
                console.log("File found and accessed");
                return response.json();
            })
            .then(function(data){
                console.log("Accesing file: " + data.Name);
                createQuestions(data);
                chooseQuestions();
                setQuestion("Question 1");
            })

function createQuestions(data){
    
    console.log("Starting analysis:")

    let traversable = [data]

    while (traversable.length > 0){

        let current_item = traversable[0]

        /* console.log(current_item.Name) */
        
        if ("Division" in current_item) {

            next_item = current_item.Division

            if (Array.isArray(next_item)) {
                traversable = traversable.concat(next_item)

                let temp_array = []

                for (let i = 0; i < next_item.length; i++) {
                    temp_array.push(next_item[i].Name)
                  }

                  division_questions[current_item.Name] = temp_array

            } else {
                traversable.push(next_item)
                division_questions[current_item.Name] = next_item.Name
            }
        }

        if ("Parts" in current_item) {

            next_item = current_item.Parts

            if (Array.isArray(next_item)) {
                traversable = traversable.concat(next_item)

                let temp_array = []

                for (let i = 0; i < next_item.length; i++) {
                    temp_array.push(next_item[i].Name)
                  }

                  parts_questions[current_item.Name] = temp_array

            } else {
                traversable.push(next_item)
                parts_questions[current_item.Name] = next_item.Name
            }

        }

        traversable.splice(0, 1)
    }

    console.log("Finished analysis...")

    console.log("The division questions are: " + division_questions)
    console.log("The parts questions are: " + parts_questions)

}

function chooseQuestions(){
    let key_array = Object.keys(division_questions)

    for (let i = 0; i < Object.keys(question_dict).length; i++){

        let answer = key_array[rand(key_array.length)]
        let question_data = division_questions[answer][rand(division_questions[answer].length)]
        let question = "What group does " + question_data + " belong to?"
        
        question_dict[Object.keys(question_dict)[i]] = [answer, question]
    }

}

function setQuestion(question_title){

    console.log("Setting up question: " + question_title)

    q_and_a = question_dict[question_title];

    document.getElementById('question-title').innerText = question_title;
    document.getElementById('question-description').innerText = q_and_a[1];



}

function rand(length){
    return Math.floor(Math.random() * length);
}

/* Define the functions */

function checkAnswer(){

    const title_text = document.getElementById('question-title').innerText;

    const textfield = document.getElementById('text-field');
    const given_answer = textfield.value;

    console.log("For " + title_text + ":");

    console.log("The given answer is: " + given_answer);

    let right_answer = question_dict[title_text][0]

    if (given_answer == right_answer) {
        console.log("The answer is correct");
        textfield.value = "";

        let next_int = Object.keys(question_dict).indexOf(title_text) + 1;
        
        console.log(next_int);

        if (next_int <= Object.keys(question_dict).length - 1) {
            console.log("To question: " + Object.keys(question_dict)[next_int])
            setQuestion(Object.keys(question_dict)[next_int])
        } else {
            document.getElementById('question-title').innerText = "Done!";
            document.getElementById('question-description').innerText = "";
        };

        console.log("Set up new question");

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
