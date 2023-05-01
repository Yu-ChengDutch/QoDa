function createNew(){
    const ogham = document.getElementById('beith')

    console.log("Check this")

    var ogham_class = ogham.className;

    console.log(ogham_class);

    if (ogham_class = "ogham-zero") {
        ogham.className = "ogham-one";
    };
}
