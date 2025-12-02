document.addEventListener("DOMContentLoaded", () => {
    fetch("topBar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("topBar").innerHTML = data;
        });
});