/* Create an empty dictionary */

let question_texts = {
    "Division": "The body consists of groups of bones. Of what group is the following a part? ",
    "Parts": "Structures may be divided in parts. Of what structure is the following a part? ",
    "Branches": "Structures may branch off. Of what structure did the following branch off? ",
    "Continues": "Structures may take a different name at some point. What is this structure called further upstream? ",
    "Branches at": "Branching occurs at a certain point. At what point does this structure branch off? "
};

let possible_questions = {
    "Division": {},
    "Parts": {},
    "Branches": {},
    "Continues": {},
    "Branches at": {}
}

let final_questions = {
    "Question 1": {},
    "Question 2": {},
    "Question 3": {},
    "Question 4": {},
    "Question 5": {}
};

let current_database = ""
let questions = [];

let databases = {
    "Skeletal System - Bones": {"Database": './data_anatomy_skeletal_bones.json', "Questions": ["Division", "Parts"]},
    "Circulatory System - Arteries": {"Database": './data_anatomy_circulatory_arterial.json', "Questions": ["Division", "Parts"]}
};

let locations = {
    "Division": {}
};

/* Check what database to load */ 

function setUp(subject){

    let subject_title = document.getElementById('true-title').innerText

    current_database = databases[subject_title]["Database"];
    questions = databases[subject_title]["Questions"];

    fetch(current_database)
            .then(function(response){
                console.log("File found and accessed at " + current_database);
                return response.json();
            })
            .then(function(data){
                console.log("Accesing file: " + data.Name);
                createQuestions(data, questions);
                chooseQuestions();
                setQuestion("Question 1");
            })

}

/* Load the database (for now still hardcoded) */


function createQuestions(data, questions){
    
    console.log("Starting analysis:")

    let traversable = [data]

    while (traversable.length > 0){

        let current_item = traversable[0]

        /* console.log(current_item.Name) */

        for (let i =0; i < questions.length; i++){
            if (questions[i] in current_item){

                next_item = current_item[questions[i]]

                if (Array.isArray(next_item)) {
                    traversable = traversable.concat(next_item)
    
                    let temp_array = []
    
                    for (let i = 0; i < next_item.length; i++) {
                        temp_array.push(next_item[i].Name)
                      }
    
                      possible_questions[questions[i]][current_item.Name] = temp_array
    
                } else {
                    traversable.push(next_item)
                    possible_questions[questions[i]][current_item.Name] = next_item.Name
                }

            }
        }

        traversable.splice(0, 1)
    }

    console.log("Finished analysis...")

    console.log(possible_questions["Division"])
    console.log(possible_questions["Parts"])

}

function chooseQuestions(){

    let question_types = Object.keys(question_texts);
    let current_array = [];

    for (let i = 0; i < Object.keys(final_questions).length; i++){

        let current_type = question_types[rand(question_types.length)];

        if (current_type == 'Division') {

            current_array = possible_questions["Division"];

        } else if (current_type == 'Parts') {

            current_array = possible_questions["Parts"];

        };

        let key_array = Object.keys(current_array);

        let answer = "";

        let passable = false;

        while (passable == false){

            answer = key_array[rand(key_array.length)];

            console.log(answer);

            for (let i = 0; i < Object.keys(final_questions); i++){
                if (answer in final_questions[Object.keys(final_questions[i])]) {
                    console.log("Found a duplicate!");
                } 
            };

            passable = true;

        };
        
        let question_data = current_array[answer][rand(current_array[answer].length)];
        let question = question_texts[current_type] + question_data;
        
        final_questions[Object.keys(final_questions)[i]] = [answer, question];

        console.log(final_questions);
    };

}

function setQuestion(question_title){

    console.log("Setting up question: " + question_title)

    q_and_a = final_questions[question_title];

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

    let right_answer = final_questions[title_text][0]

    if (given_answer == right_answer) {
        console.log("The answer is correct");
        textfield.value = "";

        let next_int = Object.keys(final_questions).indexOf(title_text) + 1;
        
        console.log(next_int);

        if (next_int <= Object.keys(final_questions).length - 1) {
            console.log("To question: " + Object.keys(final_questions)[next_int])
            setQuestion(Object.keys(final_questions)[next_int])
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
