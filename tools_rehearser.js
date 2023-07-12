/* Create an empty dictionary */

let question_texts = {
    "Division": ["The body consists of groups of structures. Of what group is <", "> a part?"],
    "Parts": ["Structures may be divided in parts. Of what structure is <", "> a part?"],
    "Branches": ["Structures may branch off. Of what structure did <", "> branch off?"],
    "Continues": ["Structures may take a different name at some point. What is <", "> called further upstream?"],
    "Branches at": ["Branching occurs at a certain point. At what point does <", "> branch off?"],
    "Branches to": ["Branching occurs in a certain direction. What direction does <", "> branch to?"],
    "Nerve": ["Organs receive their innervation from nerves. What nerve does <", "> receive its signals from?"],
    "Artery": ["Organs receive their oxygen from arteries. What artery does <", "> receive its blood from?"],
    "Lymph": ["Organs drain their lymph to nodes. What node does <", "> drain to?"],
    "Origin": ["Muscles originate somewhere. Where does <", "> originate>?"],
    "Insertion": ["Muscles have to insert somewhere. Where does <", "> insert?"],
    "From": ["Joints run from proximal to distal. Where does <", "> run from?"],
    "To": ["Joints run from proximal to distal. Where does <", "> run to?"],
    "Joint type": ["Joints are always of a certain type. What type does <", "> belong to?"],
    "Alternative name": ["Many structures are known by multiple names. What is another name for the <", ">?"],
    "Level": ["Organisms are organised along different levels of taxons. What level of taxon is <", ">?"],
    "Gram": ["Bacteria may be classified along their gram staining. Is <", "> gram positive or negative?"],
    "Shape": ["Bacteria all possess a certain shape. What shape does <", "> possess?"],
    "Gender": ["Certain structures only occur in males or females. Whom does <", "> occur in?"],
    "Subclass": ["Medication always belongs to a class. To what class does <", "> belong?"],
    "Brands": ["Medication is produced by different brands. Of what medication is the brand <", "> an instance?"],
    "Method": ["Medication may be taken in ways such as oral, intramuscular injection, IUD etc. With what method is <", "> taken?"],
    "Subconditions": ["Diseases have subclasses. What is the subclass of <", ">?"],
    "Dutch name": ["Dutch exists. What is the name of <", "> in Dutch?"],
    "Epidemiology": ["How much percentage of <", "> has <", ">?"]
};

let possible_questions = {};

let side_questions = {};

let final_questions = {};
let current_side_db = {};

let current_database = ""
let questions = [];

let databases = {
    "Pathology - Dermatology and Venereology": {"Database": './data_pathology_derm.json', "Iterators": ["Individual conditions", "Subtypes"], "Questions": ["Subconditions", "Epidemiology", "Alternative name", "Dutch name"]},
    "Pharmacology - N": {"Database": './data_pharmacology_n.json', "Questions": ["Subclass", "Brands"]},
    "Pharmacology - G": {"Database": './data_pharmacology_g.json', "Questions": ["Subclass", "Brands", "Alternative name", "Method"]},
    "Pharmacology - J": {"Database": './data_pharmacology_j.json', "Questions": ["Subclass", "Brands", "Method"]},
    "Skeletal System - Bones": {"Database": './data_anatomy_skeletal_bones.json', "Questions": ["Division", "Parts", "Alternative name"]},
    "Circulatory System - Arteries": {"Database": './data_anatomy_circulatory_arteries.json', "Questions": ["Branches", "Alternative name", "Parts", "Gender", "Continues", "Branches at", "Branches to"]},
    "Nervous System - Peripheral nerves": {"Database": './data_anatomy_nervous_peripheral_nerves.json', "Questions": ["Division", "Branches", "Continues", "Alternative name"]},
    "Muscular System - Muscles": {"Database": './data_anatomy_muscular_muscles.json', "Questions": ["Division", "Origin", "Insertion"]},
    "Skeletal System - Joints": {"Database": './data_anatomy_skeletal_joints.json', "Questions": ["Division", "From", "To", "Joint type"]},
    "Pathogens - Bacteria": {"Database": './data_metamedica_pathogens_bacteria.json', "Questions": ["Division", "Level", "Gram", "Shape"]},
    "Reproductive System - Female": {"Database": './data_anatomy_reproductive_female.json', "Questions": ["Division", "Nerve", "Artery", "Lymph"]}
};

/* The Set-up function

- Takes and loads the main database
- Takes and loads the side DBs
- Calls all of the functions in the script

*/ 

function setUp(){

    for (var key in question_texts) {
        possible_questions[key] = {};
        side_questions[key] = {};
    }

    let subject_title = document.getElementById('true-title').innerText;
    let side_db = {};

    console.log("Welcome!");
    console.log("");

    current_database = databases[subject_title]["Database"];

    console.log("Fetching main DB at: " + current_database);

    iterators = databases[subject_title]["Iterators"];
    questions = databases[subject_title]["Questions"];

    fetch(current_database)
    .then(function(response){
        console.log("- > File found and accessed at " + current_database);
        return response.json();
    })
    .then(function(data){
        console.log("- > Accesing file: " + data.Name);
        createQuestions(data, iterators, questions, possible_questions);
        chooseQuestions(questions);
        setQuestion("Question 1");
    })
    .then(function(){
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
    
                console.log("- > Generated the following side database: ");
                console.log(side_questions);
                console.log("")
    
            }
        }
    })

    console.log("- > Generated the following main questions: ");
    console.log(final_questions);
    console.log(Object.keys(final_questions));
    console.log("")

}

/* Load the database (for now still hardcoded) */


function createQuestions(data, iterators, questions, output){
    
    // console.log("Starting analysis:")

    let traversable = [data]

    while (traversable.length > 0){

        let current_item = traversable[0]

        for (let i =0; i< iterators.length; i++) {

            if (iterators[i] in current_item){

                next_item = current_item[iterators[i]]

                traversable = traversable.concat(next_item)

            }

        }

        for (let i =0; i < questions.length; i++){

            if (questions[i] in current_item){

                next_item = current_item[questions[i]]

                if (Array.isArray(next_item)) {

                    if (typeof next_item[0] === 'string') {

                        output[questions[i]][next_item] = current_item.Name

                    } else {
                        traversable = traversable.concat(next_item)
    
                        let temp_array = []
        
                        for (let i = 0; i < next_item.length; i++) {
                            temp_array.push(next_item[i].Name)
                        }
        
                        output[questions[i]][current_item.Name] = temp_array
                    }
                    
    
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

    console.log(possible_questions)

    // console.log(possible_questions["Division"]);
    // console.log(possible_questions["Parts"]);
    // console.log(possible_questions["Continues"]);
    // console.log(possible_questions["Branches"]);

}

function chooseQuestions(questions){

    let current_array = [];
    let current_type = "";
    let answer = "";
    let question_data = ""

    /* Iterate through all final questions*/

    for (let i = 0; i < 5; i++){

        /* Assign to current_type a random question type */ 

        current_type = questions[rand(questions.length)];

        /* Assign to current array all possible questions of that type */

        current_array = possible_questions[current_type]

        key_array = Object.keys(current_array);

        answer = key_array[rand(key_array.length)];

        // TODO: CREATE PROPER CHECK FOR DUPLICATES
        
        /* From all possible questions of this type, take the one matching the answer. From there, take a random instance */
        
        question_data = current_array[answer];
        
        let question = ""
        let question_string = ""

        if (current_type == "Epidemiology") {

            question = question_texts[current_type][0] + question_data[1] + question_texts[current_type][1] + answer + question_texts[current_type][2];
            question_string = "Question " + (i+1);
            final_questions[question_string] = [question_data[0], question];

        } else {

            question = question_texts[current_type][0] + question_data + question_texts[current_type][1];            
            question_string = "Question " + (i+1);
            final_questions[question_string] = [answer, question];
        
        }
        /* First, I want to determine whether there's a side quest */

        // console.log(final_questions);

        console.log("-> Done formulating question " + (i+1));

    };

};

function setQuestion(question_title){

    // console.log("Setting up question: " + question_title)

    q_and_a = final_questions[question_title];

    document.getElementById('question-title').innerText = question_title;
    document.getElementById('question-description').innerText = q_and_a[1];

    console.log(final_questions)

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

        let new_dict = {}

        let temp_dict = {}
        let temp_string = ""
        let temp_type = ""
        let temp_answer = ""

        if (title_text.includes(".1")) {

            console.log("Already recursive")

        } else {

            for (var key in side_questions) {

                console.log("Analysing: " + key);
    
                new_dict = side_questions[key]
                temp_type = key
    
                console.log(new_dict)
    
                for (var key in new_dict) {
    
                    // console.log(new_dict[key])
                    // console.log(given_answer)
    
                    if (new_dict[key].includes(given_answer)) {
                        
                        console.log("Found a match!")
                        console.log(temp_type)
    
                        temp_answer = key
    
                        console.log(temp_answer)
    
                        for (var key in final_questions) {
    
                            if (key === title_text) {
    
                                temp_string = key + ".1"
    
                                let question = question_texts[temp_type][0] + given_answer + question_texts[temp_type][1];
    
                                temp_dict[key] = final_questions[key]
                                temp_dict[temp_string] = [temp_answer, question]
    
                            } else {
    
                                temp_dict[key] = final_questions[key]
    
                            }
                            
    
                        }
    
                        final_questions = temp_dict
    
                        console.log(final_questions)
    
                    }
    
                }
    
            }

        }

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

        let redo_string = "Redo: " + title_text;

        final_questions[redo_string] = final_questions[title_text];
        console.log(final_questions);

        document.getElementById('remark-card').innerText = "Oops, that wasn't correct! The correct answer is: " + right_answer + ". Please enter this.";
    };

};


