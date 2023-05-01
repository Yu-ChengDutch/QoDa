function checkAnswer(){
    const textfield = document.getElementById('text-field');
    const given_answer = textfield.value;

    console.log(given_answer);

    textfield.value = "";

}



function setProgress(){
    const ogham = document.getElementById('saille')

    console.log("Check this")

    var ogham_class = ogham.className;

    console.log(ogham_class);

    if (ogham_class = "ogham-zero") {
        ogham.style.height = "6vh";
    };
}
