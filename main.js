function darkmode(){

document.body.style.background = "black";
document.body.style.color = "white";

}

function translateText(){

let text =
document.getElementById("text").value;

document.getElementById("result").innerHTML =
"Translated: " + text;

}
