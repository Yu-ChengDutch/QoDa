/* Create an empty dictionary */

let question_texts = {
    "Division": ["The body consists of groups of bones. Of what group is <", "> a part?"],
    "Parts": ["Structures may be divided in parts. Of what structure is <", "> a part?"],
    "Branches": ["Structures may branch off. Of what structure did <", "> branch off?"],
    "Continues": ["Structures may take a different name at some point. What is <", "> called further upstream?"],
    "Branches at": ["Branching occurs at a certain point. At what point does <", "> branch off?"],
    "Branches to": ["Branching occurs in a certain direction. What direction does <", "> branch to?"]
};

let possible_questions = {
    "Division": {},
    "Parts": {},
    "Branches": {},
    "Continues": {},
    "Branches at": {},
    "Branches to": {}
}

let side_questions = {
    "Division": {},
    "Parts": {},
    "Branches": {},
    "Continues": {},
    "Branches at": {},
    "Branches to": {}
}

let final_questions = {};

let current_database = ""
let questions = [];

let databases = {
    "Skeletal System - Bones": {"Database": './data_anatomy_skeletal_bones.json', "Questions": ["Division", "Parts"]},
    "Circulatory System - Arteries": {"Database": './data_anatomy_circulatory_arteries.json', "Questions": ["Branches", "Parts", "Continues", "Branches at", "Branches to"]}
};

/* Check what database to load */ 

function setUp(){

    let subject_title = document.getElementById('true-title').innerText;
    let side_db = {};

    console.log("Welcome!");
    console.log("");

    current_database = databases[subject_title]["Database"];

    console.log("Fetching main DB at: " + current_database);

    questions = databases[subject_title]["Questions"];

    fetch(current_database)
    .then(function(response){
        console.log("- > File found and accessed at " + current_database);
        return response.json();
    })
    .then(function(data){
        console.log("- > Accesing file: " + data.Name);
        createQuestions(data, questions, possible_questions);
        chooseQuestions(["Branches at"]);
        setQuestion("Question 1");
    })

    console.log("- > Generated the following main questions: ");
    console.log(final_questions);
    console.log("")

    for (let i = 0; i < Object.keys(databases).length; i++) {

        /* console.log("Assessing database: " + Object.keys(databases)[i]); */ 

        if (Object.keys(databases)[i] === subject_title) {

            /* console.log("Already assessed: " + Object.keys(databases)[i] + " & " + subject_title); */

        } else {

            side_db = databases[Object.keys(databases)[i]]["Database"]

            console.log("Fetching side DB at: " + side_db);

            /* console.log(Object.keys(databases)[i] + " is found not to be the same as " + subject_title); */

            fetch(side_db)
            .then(function(side_response){
                console.log("- > File found and accessed at " + side_db);
                return side_response.json();
            })
            .then(function(side_data){
                console.log("- > Accesing file: " + side_data.Name);
                createQuestions(side_data, databases[Object.keys(databases)[i]]["Questions"], side_questions);
            })

            console.log("- > Generated the following side questions: ");
            console.log(side_questions);
            console.log("")
        }
    }

}

/* Load the database (for now still hardcoded) */


function createQuestions(data, questions, output){
    
    // console.log("Starting analysis:")

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
    
                      output[questions[i]][current_item.Name] = temp_array
    
                } else if (typeof next_item === 'string' || next_item instanceof String) {

                    output[questions[i]][next_item] = current_item.Name

                } else {

                    for (let j =0; j < questions.length; j++) {
                        if (questions[j] in next_item){
                            traversable = traversable.concat(next_item)
                        }
                    }

                    output[questions[i]][current_item.Name] = next_item.Name

                }

            }
        }

        traversable.splice(0, 1)
    }

    // console.log("Finished analysis...")

    // console.log(possible_questions["Division"]);
    // console.log(possible_questions["Parts"]);
    // console.log(possible_questions["Continues"]);
    // console.log(possible_questions["Branches"]);

}

function chooseQuestions(questions){

    let current_array = [];

    /* Iterate through all final questions*/

    for (let i = 0; i < 5; i++){

        /* Assign to current_type a random question type */ 

        let current_type = questions[rand(questions.length)];

        /* Assign to current array all possible questions of that type */

        current_array = possible_questions[current_type]

        let key_array = Object.keys(current_array);

        let answer = "";

        let passable = false;

        while (passable == false){

            answer = key_array[rand(key_array.length)];

            // console.log(answer);

            for (let i = 0; i < Object.keys(final_questions); i++){
                if (answer in final_questions[Object.keys(final_questions[i])]) {
                    // console.log("Found a duplicate!");
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
        
        /* A question is added to the roster here */

        let question_string = "Question " + i;
        final_questions.put(question_string, [answer, question]);

        /* First, I want to determine whether there's a side quest */

        let side_keys = Object.keys(side_questions)

        for (let i = 0; i < side_keys.length; i++){

            let current_side_question = side_questions[side_keys[i]];
            let current_side_question_keys = Object.keys(current_side_question)

            for (let j = 0; j < current_side_question_keys.length; j++) {

                // console.log(current_side_question[current_side_question_keys[j]]);
                // console.log(given_answer);

                if (current_side_question[current_side_question_keys[j]].includes(answer)) {
                    console.log("-> Found matching in " + side_keys[i]);

                    question = question_texts[side_keys[i]][0] + answer + question_texts[side_keys[i]][1];
                    answer = current_side_question_keys[j];

                    question_string = "Question " + i + ".1";
                    final_questions.put(question_string, [answer, question]);
                }

            }

        }

        // console.log(final_questions);

        console.log("-> Done formulating question " + i);

    };

}

function setQuestion(question_title){

    // console.log("Setting up question: " + question_title)

    q_and_a = final_questions[question_title];

    document.getElementById('question-title').innerText = question_title;
    document.getElementById('question-description').innerText = q_and_a[1];

}

function rand(length){
    return Math.floor(Math.random() * length);
}

function checkAnswer(){

    const title_text = document.getElementById('question-title').innerText;

    const textfield = document.getElementById('text-field');
    const given_answer = textfield.value;

    // console.log("For " + title_text + ":");

    // console.log("The given answer is: " + given_answer);

    let right_answer = final_questions[title_text][0]

    if (given_answer == right_answer) {

        // console.log("The answer is correct");
        textfield.value = "";

        let next_int = Object.keys(final_questions).indexOf(title_text) + 1;
        
        // console.log(next_int);

        document.getElementById('remark-card').innerText = "";

        if (next_int <= Object.keys(final_questions).length - 1) {
            // console.log("To question: " + Object.keys(final_questions)[next_int])
            setQuestion(Object.keys(final_questions)[next_int])
        } else {
            document.getElementById('question-title').innerText = "Done!";
            document.getElementById('question-description').innerText = "";
        };

        // console.log("Set up new question");

    } else {

        // console.log("The answer was incorrect, the correct answer is: " + right_answer);

        document.getElementById('remark-card').innerText = "Oops, that wasn't correct! The correct answer is: " + right_answer + ". Please enter this.";
    };

};
