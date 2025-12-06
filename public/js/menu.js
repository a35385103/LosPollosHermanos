// public/js/menu.js

document.addEventListener("DOMContentLoaded", () => {
    initTopBar();
    initMenuEvents();   // 先綁事件
    loadMenuItems();    // 再載入資料
});

/* ------------------ TopBar：跟其他頁一樣 ------------------ */
function initTopBar() {
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
        .catch(err => console.error("Failed to load topBar:", err));
}

/* ------------------ 從後端載入菜單 ------------------ */
async function loadMenuItems() {
    // ⭐ 只操作 menuItems，而不是整個 menuList
    const itemsContainer = document.getElementById("menuItems");

    try {
        const res = await fetch("/api/menu/getAll");
        if (!res.ok) throw new Error("Failed to fetch menu items");

        const menuItems = await res.json();

        // 先清空舊列表
        itemsContainer.innerHTML = "";

        // 沒資料 → 顯示一句話
        if (!Array.isArray(menuItems) || menuItems.length === 0) {
            const p = document.createElement("p");
            p.textContent = "No menu items found.";
            itemsContainer.appendChild(p);
            return;
        }

        // 有資料就創建卡片
        menuItems.forEach(item => {
            const card = createMenuCardElement(item);
            itemsContainer.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        itemsContainer.innerHTML = "<p>Failed to load menu items.</p>";
    }
}

/* ------------------ 綁定按鈕 / 表單事件 ------------------ */
function initMenuEvents() {
    const addBtn = document.getElementById("addMenuBtn");
    const formBlock = document.getElementById("addMenuPlaceholder");
    const searchInput = document.getElementById("menuInput");

    // 點擊 Add Menu Item 顯示/隱藏表單
    addBtn.addEventListener("click", () => {
        formBlock.classList.toggle("invisible");
    });

    // 送出新增餐點
    formBlock.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("menuName").value.trim(),
            category: document.getElementById("menuCategory").value.trim(),
            price: parseFloat(document.getElementById("menuPrice").value),
            description: document.getElementById("menuDescription").value.trim(),
            available: parseInt(document.getElementById("menuAvailable").value, 10)
        };

        if (!data.name || isNaN(data.price)) {
            alert("Name and Price are required.");
            return;
        }

        try {
            const res = await fetch("/api/menu/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json().catch(() => ({}));
            if (!res.ok || result.success === false) {
                console.error("Add menu item failed:", result);
                alert("Failed to add menu item.");
                return;
            }

            alert("Menu item added successfully!");

            // 清空表單
            document.getElementById("menuName").value = "";
            document.getElementById("menuCategory").value = "";
            document.getElementById("menuPrice").value = "";
            document.getElementById("menuDescription").value = "";
            document.getElementById("menuAvailable").value = "1";

            // 重新載入列表
            await loadMenuItems();
        } catch (err) {
            console.error(err);
            alert("Error occurred while adding menu item.");
        }
    });

    // 搜尋功能：簡單在前端 filter
    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".menuItem");

        cards.forEach(card => {
            const name = card.querySelector(".item-name").textContent.toLowerCase();
            if (name.includes(keyword)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
}

/* ------------------ 產生單一菜單卡片的 DOM 元素 ------------------ */
function createMenuCardElement(item) {
    const name = item.name || "-";
    const category = item.category || "-";
    const price = item.price != null ? `$${item.price}` : "-";
    const description = item.description || "-";
    const available = item.available === 1 || item.available === "1" ? "Yes" : "No";

    const div = document.createElement("div");
    div.className = "menuBlock menuItem";
    div.dataset.menuId = item.id || "";

    div.innerHTML = `
        <p class="line"><strong>Name:</strong> <span class="item-name">${name}</span></p>
        <p class="line"><strong>Category:</strong> ${category}</p>
        <p class="line"><strong>Price:</strong> ${price}</p>
        <p class="line"><strong>Description:</strong> ${description}</p>
        <p class="line"><strong>Available:</strong> ${available}</p>
    `;

    return div;
}
