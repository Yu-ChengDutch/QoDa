/* Create an empty dictionary */

let question_texts = {
    "Division": ["The body consists of groups of bones. Of what group is <", "> a part?"],
    "Parts": ["Structures may be divided in parts. Of what structure is <", "> a part?"],
    "Branches": ["Structures may branch off. Of what structure did <", "> branch off?"],
    "Continues": ["Structures may take a different name at some point. What is <", "> called further upstream?"],
    "Branches at": ["Branching occurs at a certain point. At what point does <", "> branch off?"],
    "Branches to": ["Branching occurs in a certain direction. What direction does<", "> branch to?"]
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
    "Circulatory System - Arteries": {"Database": './data_anatomy_circulatory_arteries.json', "Questions": ["Branches", "Parts", "Continues", "Branches at", "Branches to"]}
};

/* Check what database to load */ 

function setUp(){

    let subject_title = document.getElementById('true-title').innerText;

    console.log("Fetching: " + subject_title);

    current_database = databases[subject_title]["Database"];

    console.log("From database: " + current_database);

    questions = databases[subject_title]["Questions"];

    fetch(current_database)
            .then(function(response){
                console.log("File found and accessed at " + current_database);
                return response.json();
            })
            .then(function(data){
                console.log("Accesing file: " + data.Name);
                createQuestions(data, questions);
                chooseQuestions(questions);
                setQuestion("Question 1");
            })

}

/* Load the database (for now still hardcoded) */


function createQuestions(data, questions){
    
    console.log("Starting analysis:")

    let traversable = [data]

    while (traversable.length > 0){

        let current_item = traversable[0]

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
    
                } else if (typeof next_item === 'string' || next_item instanceof String) {
                    
                    possible_questions[questions[i]][next_item] = current_item

                } else {

                    for (let j =0; j < questions.length; j++) {
                        if (questions[j] in next_item){
                            traversable = traversable.concat(next_item)
                        }
                    }

                    possible_questions[questions[i]][current_item.Name] = next_item.Name

                }

            }
        }

        traversable.splice(0, 1)
    }

    console.log("Finished analysis...")

    console.log(possible_questions["Division"]);
    console.log(possible_questions["Parts"]);
    console.log(possible_questions["Continues"]);
    console.log(possible_questions["Branches"]);

}

function chooseQuestions(questions){

    let current_array = [];

    /* Iterate through all final questions*/

    for (let i = 0; i < Object.keys(final_questions).length; i++){

        /* Assign to current_type a random question type */ 

        let current_type = questions[rand(questions.length)];

        /* Assign to current array all possible questions of that type */

        current_array = possible_questions[current_type]

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
        
        /* From all possible questions of this type, take the one matching the answer. From there, take a random instance */

        let question_data = ""
        
        if (Array.isArray(current_array[answer])) {
            question_data = current_array[answer][rand(current_array[answer].length)];
        } else {
            question_data = current_array[answer];
        }        
        
        let question = question_texts[current_type][0] + question_data + question_texts[current_type][1];
        
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
