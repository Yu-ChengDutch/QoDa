/* Create an empty dictionary */

let possible_questions_dict = {};
let question_dict = {};

/* Load the database (for now still hardcoded) */

fetch('./data_anatomy_skeletal_bones.json')
            .then(function(response){
                console.log("File found and accessed");
                return response.json();
            })
            .then(function(data){
                console.log("Accesing file: " + data.Name);
                createQuestions(data);
            })

function createQuestions(data){
    
    console.log("Starting analysis:")

    let traversable = [data]

    while (traversable.length > 0){

        let current_item = traversable[0]

        console.log(current_item.Name)
        
        if ("Division" in current_item) {

            next_item = current_item.Division

            if (Array.isArray(next_item)) {
                console.log("-> Found another layer")
                traversable = traversable.concat(next_item)

                let temp_array = []

                for (let i = 0; i < next_item.length; i++) {
                    temp_array.push(next_item[i].Name)
                  }

                  possible_questions_dict[current_item.Name] = temp_array

            } else {
                traversable.push(next_item)
                possible_questions_dict[current_item.Name] = next_item.Name
            }
        }

        traversable.splice(0, 1)
    }

    console.log("Finished analysis...")

    console.log(possible_questions_dict)

}

/* Define the functions */

function checkAnswer(){

    const title_text = document.getElementById('question-title').innerText;

    const textfield = document.getElementById('text-field');
    const given_answer = textfield.value;

    console.log("For " + title_text + ":");

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
