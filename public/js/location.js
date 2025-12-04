document.addEventListener("DOMContentLoaded", () => {
    fetch("topBar.html")
        .then(response => response.text())
        .then(data => {
            const topBar = document.getElementById("topBar");
            topBar.innerHTML = data;
            const current = window.location.pathname.split("/").pop() || "index.html";
            const links = topBar.querySelectorAll(".nav-links a");

            links.forEach(link => {
                const linkPage = link.getAttribute("href");
                if (linkPage && linkPage !== "#" && linkPage === current) {
                    link.classList.add("selected");
                }
            });
        })
});
document.getElementById("addLocationBtn").addEventListener("click", (e) => {
    document.getElementById("addLocoPlaceholder").classList.toggle("invisible");
});

const dropBtn = document.getElementById("dropBtn");
const content = document.getElementById("dropdown-content");

dropBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    content.style.display = content.style.display === "block" ? "none" : "block";
});

document.querySelectorAll("#dropdown-content input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const selected = [...document.querySelectorAll("#dropdown-content input[type='checkbox']")]
            .filter(c => c.checked)
            .map(c => c.value);
        if (selected.length === 0) {
            document.getElementById("dropBtn").textContent = "";
        } else {
            document.getElementById("dropBtn").textContent = selected.join(", ");
        }
    });
});

document.getElementById("submitLocoBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.getElementById("addLocoPlaceholder");
    const formData = new FormData(form);
    const checkboxes = document.querySelectorAll("#dropdown-content input[type='checkbox']");
    const daysBoolArray = Array.from(checkboxes).map(cb => cb.checked);
    const data = {
        latitude: formData.get("latitude"),
        longitude: formData.get("longitude"),
        city: formData.get("city"),
        address: formData.get("address"),
        zipcode: formData.get("zip"),
        days: daysBoolArray,
        open_time: formData.get("open"),
        close_time: formData.get("close")
    };
    alert("Sending...")
    const res = await fetch("/api/location/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if(result.success){
        alert("Location added successfully!");
    }
});