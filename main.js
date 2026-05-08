console.log("App Started");

function translate(text) {
  return "Translated: " + text;
}

let result = translate("Hello");
console.log(result);
function darkmode(){
  document.body.style.background = "white";
  document.body.style.color = "black";
}function translateText(){

let text = document.getElementById("text").value;

document.getElementById("result").innerHTML =
"Translated: " + text;

}
