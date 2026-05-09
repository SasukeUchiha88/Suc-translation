function translateText() {

let text = document.getElementById("inputText").value;

let from = document.getElementById("fromLang").value;

let to = document.getElementById("toLang").value;

let output = document.getElementById("outputText");

output.innerHTML = "Loading...";

fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`)

.then(res => res.json())

.then(data => {

output.innerHTML = data.responseData.translatedText;

});

}

function copyText() {

let text = document.getElementById("outputText").innerText;

navigator.clipboard.writeText(text);

alert("Copied!");

}
