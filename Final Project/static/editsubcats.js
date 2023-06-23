// Scripts to handle subcategories management.
let activetab, activecategory, modifier_category, modifier_price, newProduct, newProductPrice;
let selected = [], selectedSettings = [], newProductSettings = {}, update_setting = {}, update_modifier = {}, categories = [];
window.onload = function () {
    // Get active category, if it exists.
    activetab = JSON.parse(localStorage.getItem("activetab"));
    categories = ["product_categories", "setting_categories", "modifier_categories"];
    // Show the top menu.
    showMenuButtons();
    let header = document.getElementById("place");
    if (activetab === "product_categories") {
      header.innerHTML = "Products";
    } else if (activetab === "modifier_categories") {
      header.innerHTML = "Modifiers";
    } else {
      header.innerHTML = "Settings";
    }
    // Handle tab switching.
    let active = document.getElementsByClassName("menu-button active");
    active = active[0];
    if (activetab) {
      active.setAttribute("class", "menu-button");
      active = document.getElementById(activetab);
      active.setAttribute("class", "menu-button active");
    }
    activecategory = JSON.parse(localStorage.getItem("activecategory"));
    if (activecategory) {
        showSubcategories(activecategory);
    } else {
        location.replace("/edit");
    }
    let inactive = document.querySelectorAll(".menu-button");
    inactive.forEach((item) => {
        item.addEventListener("click", function() {
            switchTab(item);
        });
    });
}
function showMenuButtons() {
    document.getElementById("home").addEventListener("click", function() {
      location.replace("/");
    })
    let navbar = document.getElementById("menu");
    let count = 0;
    activetab = JSON.parse(localStorage.getItem("activetab"));
    for (i in categories) {
      let button = document.createElement("button");
      button.setAttribute("id", categories[i]);
      if (categories[i] === "product_categories") {
        button.innerHTML = "Products";
      } else if (categories[i] === "setting_categories") {
        button.innerHTML = "Settings";
      } else {
        button.innerHTML = "Modifiers";
      }
      if (activetab) {
        if (activetab === categories[i]) {
          button.setAttribute("class", "menu-button active");
        } else {
          button.setAttribute("class", "menu-button");
        }
        navbar.appendChild(button);
        count++;
      } else {
        if (count === 0) {
            button.setAttribute("class", "menu-button active");
        } else {
            button.setAttribute("class", "menu-button");
        }
            navbar.appendChild(button);
            count++;
        }
    }
}
function switchTab(item) {
    let active = document.getElementsByClassName("menu-button active");
    active = active[0];
    active.setAttribute("class", "menu-button");
    item.setAttribute("class", "menu-button active");
    active = item.id;
    localStorage.setItem('activetab', JSON.stringify(active));
    localStorage.removeItem("activecategory");
    location.replace("/edit");
}
function showSubcategories(activecategory) {
    // Show subcategory content.
    let subcategoriesDiv = document.getElementById("subcategories");
    while(subcategoriesDiv.firstChild) {
        subcategoriesDiv.removeChild(subcategoriesDiv.firstChild);
    }
    // Button to add subcategories.
    let addButton = document.createElement("svg");
    addButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    addButton.setAttribute("width", "16");
    addButton.setAttribute("height", "16");
    addButton.setAttribute("fill", "currentColor");
    addButton.setAttribute("class", "bi bi-plus-lg");
    addButton.setAttribute("viewBox", "0 0 16 16");
    addButton.setAttribute("style", "color: Tan; margin-bottom: 10px; margin-right: 10px;");
    addButton.setAttribute("id", "add-subcategory");
    subcategoriesDiv.appendChild(addButton);
    addButtonPath = document.createElement("path");
    addButtonPath.setAttribute("fill-rule", "evenodd");
    addButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
    addButton.appendChild(addButtonPath);
    // Button to delete subcategories.
    let deleteButton = document.createElement("svg");
    deleteButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    deleteButton.setAttribute("width", "16");
    deleteButton.setAttribute("height", "16");
    deleteButton.setAttribute("fill", "currentColor");
    deleteButton.setAttribute("class", "bi bi-trash");
    deleteButton.setAttribute("viewBox", "0 0 16 16");
    deleteButton.setAttribute("style", "color: Tan; margin-bottom: 10px; margin-right: 10px;");
    deleteButton.setAttribute("id", "delete-subcategory");
    subcategoriesDiv.appendChild(deleteButton);
    deleteButtonPath = document.createElement("path");
    deleteButtonPath.setAttribute("fill-rule", "evenodd");
    deleteButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
    deleteButton.appendChild(deleteButtonPath);
    let subcategoriesTable = document.createElement("table");
    subcategoriesTable.setAttribute("id", "categoriesTable");
    subcategoriesDiv.appendChild(subcategoriesTable);
    for (subcategory in data[activecategory]) {
        let subcategoriesTableRow = document.createElement("tr");
        subcategoriesTable.appendChild(subcategoriesTableRow);
        let subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRowColumn.setAttribute("style", "width: 25px;");
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
        let subcategoriesTableRowColumnInput = document.createElement("input");
        subcategoriesTableRowColumnInput.setAttribute("class", "markedForDeletion");
        subcategoriesTableRowColumnInput.setAttribute("type", "checkbox");
        subcategoriesTableRowColumnInput.setAttribute("value", data[activecategory][subcategory]);
        subcategoriesTableRowColumn.appendChild(subcategoriesTableRowColumnInput);
        subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRowColumn.setAttribute("id", data[activecategory][subcategory]);
        subcategoriesTableRowColumn.setAttribute("class", "subcategorynames");
        subcategoriesTableRowColumn.setAttribute("href", "#");
        subcategoriesTableRowColumn.innerHTML = data[activecategory][subcategory];
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
    }
    // Listener to enter subcategories.
    let editSubcategories = document.getElementsByClassName("subcategorynames");
    Array.from(editSubcategories).forEach((item) => {
      item.addEventListener("click", function() {
        let subcategory = item.id;
        localStorage.setItem('activesubcategory', JSON.stringify(subcategory));
        if (activetab === "product_categories") {
            location.replace("/editproduct");
        } else {
            editOptions(subcategory);
        }
      });
    });
    // Listener to delete subcategories.
    deleteButton.addEventListener("click", function() {
      let checkedBoxes = document.getElementsByClassName("markedForDeletion");
      let checked = [];
      Array.from(checkedBoxes).forEach((item) => {
        if (item.checked) {
          checked.push(item.value);
        }
      });
      let activeCategory = JSON.parse(localStorage.getItem("activetab"));
      fetch('/deletesubcats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "items": checked,
            "table": activeCategory,
        }),
      })
      .then((response) => {
        if(response.redirected){
            window.location.href = response.url;
        }
        })
    })// Listener to add subcategories.
    addButton.addEventListener("click", function() {
        let cancelSvg = document.createElement("svg");
        cancelSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        cancelSvg.setAttribute("width", "16");
        cancelSvg.setAttribute("height", "16");
        cancelSvg.setAttribute("fill", "currentColor");
        cancelSvg.setAttribute("class", "bi bi-x-lg");
        cancelSvg.setAttribute("viewBox", "0 0 16 16");
        cancelSvg.setAttribute("id", "cancel");
        cancelSvg.setAttribute("style", "color: Tan; margin-bottom: 10px; margin-right: 10px;");
        document.getElementById("delete-subcategory").after(cancelSvg);
        let cancelPath = document.createElement("path");
        cancelPath.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
        cancelSvg.appendChild(cancelPath);
        let saveButton = document.createElement("svg");
        saveButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        saveButton.setAttribute("width", "16");
        saveButton.setAttribute("height", "16");
        saveButton.setAttribute("fill", "currentColor");
        saveButton.setAttribute("class", "bi bi-check-lg");
        saveButton.setAttribute("viewBox", "0 0 16 16");
        saveButton.setAttribute("id", "save-all");
        saveButton.setAttribute("style", "color: Tan; margin-bottom: 10px; margin-right: 10px;");
        cancelSvg.after(saveButton);
        pathSave = document.createElement("path");
        pathSave.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
        saveButton.appendChild(pathSave);
        // Send new subcategory to server.
        saveButton.addEventListener("click", function() {
            if (!this.hasAttribute("disabled")) {
                let activeCategory = JSON.parse(localStorage.getItem("activetab"));
                let activeSubcategory = JSON.parse(localStorage.getItem("activecategory"));
                if (activeCategory === "setting_categories") {
                    let setting = document.getElementById("newsetting");
                    fetch("/addelement", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "items": setting.value,
                            "table": "settings",
                            "category": activeSubcategory
                        }),
                        })
                        .then((response) => {
                        if (response.redirected) {
                            window.location.href = response.url;
                        }
                    })
                } else if (activeCategory === "product_categories") {
                    if (newProductPrice) {
                        fetch("/addelement", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "items": newProduct,
                                "table": "products",
                                "category": activeSubcategory,
                                "price": newProductPrice

                            }),
                        })
                        .then((response) => {
                            if (response.redirected) {
                                window.location.href = response.url;
                            }
                        })
                    } else (
                        fetch("/addelement", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "items": newProduct,
                                "table": "products",
                                "category": activeSubcategory,
                                "price": newProductSettings
                            }),
                        })
                        .then((response) => {
                            if (response.redirected) {
                                window.location.href = response.url;
                            }
                        })
                    )
                } else if (activeCategory === "modifier_categories") {
                    let setting = document.getElementById("newmodifiersubcategory");
                    fetch("/addelement", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "items": modifier_category.value,
                            "table": "modifiers",
                            "category": activeSubcategory,
                            "price": modifier_price.value,
                            "products": selected
                        }),
                    })
                    .then((response) => {
                        if (response.redirected) {
                            window.location.href = response.url;
                        }
                    })
                }
            }
        })
        // Show updated subcategory contents.
        let activeCategory = JSON.parse(localStorage.getItem("activetab"));
        let subcategoriesTableRow = document.createElement("tr");
        subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
        subcategoriesTableRow.setAttribute("height", "25px;");
        subcategoriesTable.appendChild(subcategoriesTableRow);
        let subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
        subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
        subcategoriesTableRow = document.createElement("tr");
        subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
        subcategoriesTable.appendChild(subcategoriesTableRow);
        subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
        subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
        if (activeCategory === "setting_categories") {
            subcategoriesTableRowColumn.innerHTML = "New setting";
        } else if (activeCategory === "product_categories") {
            subcategoriesTableRowColumn.innerHTML = "New product";
        } else if (activeCategory === "modifier_categories") {
            subcategoriesTableRowColumn.innerHTML = "New modifier";
        }
        subcategoriesTableRowColumn.setAttribute("style", "text-align: center; width: 200px;");
        subcategoriesTableRow = document.createElement("tr");
        subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
        subcategoriesTable.appendChild(subcategoriesTableRow);
        subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
        subcategoriesTableRowColumn = document.createElement("td");
        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
        let subcategoriesTableRowColumnInput = document.createElement("input");
        subcategoriesTableRowColumnInput.setAttribute("type", "text");
        subcategoriesTableRowColumnInput.setAttribute("class", "form-control");
        if (activeCategory === "setting_categories") {
            subcategoriesTableRowColumnInput.setAttribute("placeholder", "Enter setting name");
            subcategoriesTableRowColumnInput.setAttribute("id", "newsetting");
        } else if (activeCategory === "product_categories") {
            subcategoriesTableRowColumnInput.setAttribute("placeholder", "Enter product name");
            subcategoriesTableRowColumnInput.setAttribute("id", "newproductsubcategory");
        } else if (activeCategory === "modifier_categories") {
            subcategoriesTableRowColumnInput.setAttribute("placeholder", "Enter modifier name");
            subcategoriesTableRowColumnInput.setAttribute("id", "newmodifiersubcategory");
        }
        subcategoriesTableRowColumn.appendChild(subcategoriesTableRowColumnInput);
        this.setAttribute("hidden", "true");
        if (activeCategory === "modifier_categories") {
            subcategoriesTableRow = document.createElement("tr");
            subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
            subcategoriesTable.appendChild(subcategoriesTableRow);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumnInput = document.createElement("input");
            subcategoriesTableRowColumnInput.setAttribute("type", "text");
            subcategoriesTableRowColumnInput.setAttribute("id", "newmodifierprice");
            subcategoriesTableRowColumnInput.setAttribute("placeholder", "Price");
            subcategoriesTableRowColumnInput.setAttribute("class", "form-control");
            subcategoriesTableRowColumn.appendChild(subcategoriesTableRowColumnInput);
            subcategoriesTableRow = document.createElement("tr");
            subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
            subcategoriesTable.appendChild(subcategoriesTableRow);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRowColumn.innerHTML = "Allowed products";
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            if (product_subcategories) {
                let select = document.createElement("select");
                select.setAttribute("class", "form-select choose");
                select.setAttribute("multiple", "true");
                select.setAttribute("id", "select");
                subcategoriesTableRowColumn.appendChild(select);
                let selectOption = document.createElement("option");
                selectOption.setAttribute("selected", "true");
                selectOption.innerHTML = "No products"
                select.appendChild(selectOption);
                for (i in product_subcategories) {
                    selectOption = document.createElement("option");
                    selectOption.setAttribute("value", product_subcategories[i]["product_subcategory_name"]);
                    selectOption.innerHTML = product_subcategories[i]["product_subcategory_name"];
                    select.appendChild(selectOption);
                }
            }
            document.getElementById("newmodifiersubcategory").addEventListener("keyup", function() {
                checkAllFields();
            });
            document.getElementById("newmodifierprice").addEventListener("keyup", function() {
                checkAllFields();
            });
            document.getElementById("select").addEventListener("change", function() {
                checkAllFields();
            });
        } else if (activeCategory === "setting_categories") {
            document.getElementById("newsetting").addEventListener("keyup", function() {
                if (this.value) {
                    document.getElementById("save-all").removeAttribute("disabled");
                } else {
                    document.getElementById("save-all").setAttribute("disabled", "true");
                }
            })
        } else if (activeCategory === "product_categories") {
            subcategoriesTableRow = document.createElement("tr");
            subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
            subcategoriesTable.appendChild(subcategoriesTableRow);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumnInput = document.createElement("input");
            subcategoriesTableRowColumnInput.setAttribute("type", "text");
            subcategoriesTableRowColumnInput.setAttribute("id", "newproductprice");
            subcategoriesTableRowColumnInput.setAttribute("placeholder", "Either enter price");
            subcategoriesTableRowColumnInput.setAttribute("class", "form-control");
            subcategoriesTableRowColumn.appendChild(subcategoriesTableRowColumnInput);
            subcategoriesTableRow = document.createElement("tr");
            subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
            subcategoriesTable.appendChild(subcategoriesTableRow);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumn.innerHTML = "...or choose settings";
            subcategoriesTableRowColumn.setAttribute("style", "text-align: center;");
            subcategoriesTableRow = document.createElement("tr");
            subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
            subcategoriesTable.appendChild(subcategoriesTableRow);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            let select = document.createElement("select");
            select.setAttribute("class", "form-select");
            select.setAttribute("multiple", "true");
            select.setAttribute("id", "settingsToAdd");
            subcategoriesTableRowColumn.appendChild(select);
            let selectOption = document.createElement("option");
            selectOption.setAttribute("selected", "true");
            selectOption.innerHTML = "No settings";
            select.appendChild(selectOption);
            for (i in settings) {
                for (j in settings[i]) {
                    selectOption = document.createElement("option");
                    selectOption.setAttribute("value", settings[i][j]["setting_name"]);
                    selectOption.innerHTML = i + "=>" + settings[i][j]["setting_name"];
                    select.appendChild(selectOption);
                }
            }
            subcategoriesTableRow = document.createElement("tr");
            subcategoriesTableRow.setAttribute("class", "subcategoriesTableRow");
            subcategoriesTable.appendChild(subcategoriesTableRow);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            subcategoriesTableRowColumn = document.createElement("td");
            subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
            let addButton = document.createElement("button");
            addButton.setAttribute("type", "button");
            addButton.setAttribute("id", "addSettings");
            addButton.setAttribute("class", "confirm");
            addButton.innerHTML = "Add settings";
            subcategoriesTableRowColumn.appendChild(addButton);
            document.getElementById("settingsToAdd").addEventListener("click", function() {
                selectedSettings = [];
                for (let option of document.getElementById('settingsToAdd').options)
                {
                    if (option.selected && option.value !== "No settings") {
                        selectedSettings.push(option.value);
                    }
                }
                if (selectedSettings.length) {
                    document.getElementById("newproductprice").setAttribute("disabled", "true");
                } else {
                    document.getElementById("newproductprice").removeAttribute("disabled");
                }
            })
            document.getElementById("newproductprice").addEventListener("keyup", function() {
                if (this.value) {
                    document.getElementById("settingsToAdd").setAttribute("disabled", "true");
                    document.getElementById("addSettings").setAttribute("disabled", "true");
                    checkProductInput();
                } else {
                    document.getElementById("settingsToAdd").removeAttribute("disabled");
                    document.getElementById("addSettings").removeAttribute("disabled");
                    document.getElementById("save-all").setAttribute("disabled", "true");
                }
            })
            document.getElementById("newproductsubcategory").addEventListener("keyup", function() {
                if (this.value) {
                    checkProductInput();
                } else {
                    document.getElementById("save-all").setAttribute("disabled", "true");
                }
            })
            document.getElementById("addSettings").addEventListener("click", function() {
                if (selectedSettings.length) {
                    document.getElementById("settingsToAdd").setAttribute("hidden", "true");
                    this.setAttribute("hidden", "true");
                    for (i in selectedSettings) {
                        subcategoriesTableRow = document.createElement("tr");
                        subcategoriesTableRow.setAttribute("class", "new");
                        subcategoriesTable.appendChild(subcategoriesTableRow);
                        subcategoriesTableRowColumn = document.createElement("td");
                        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
                        let subcategoriesTableRowColumnInput = document.createElement("input");
                        subcategoriesTableRowColumnInput.setAttribute("type", "checkbox");
                        subcategoriesTableRowColumnInput.setAttribute("class", "markedSettings");
                        subcategoriesTableRowColumnInput.setAttribute("id", selectedSettings[i]);
                        subcategoriesTableRowColumn.appendChild(subcategoriesTableRowColumnInput);
                        subcategoriesTableRowColumn = document.createElement("td");
                        subcategoriesTableRowColumn.setAttribute("style", "width: 200px;");
                        subcategoriesTableRow.appendChild(subcategoriesTableRowColumn);
                        subcategoriesTableRowColumnDiv = document.createElement("div");
                        subcategoriesTableRowColumnDiv.setAttribute("style", "width: 70%; display: inline-flex;");
                        subcategoriesTableRowColumnDiv.innerHTML = selectedSettings[i];
                        subcategoriesTableRowColumn.appendChild(subcategoriesTableRowColumnDiv);
                        subcategoriesTableRowColumnInput = document.createElement("input");
                        subcategoriesTableRowColumnInput.setAttribute("type", "text");
                        subcategoriesTableRowColumnInput.setAttribute("name", selectedSettings[i]);
                        subcategoriesTableRowColumnInput.setAttribute("placeholder", "price");
                        subcategoriesTableRowColumnInput.setAttribute("class", "price form-control");
                        subcategoriesTableRowColumnInput.setAttribute("style", "width: 30%; display: inline-flex;");
                        subcategoriesTableRowColumn.appendChild(subcategoriesTableRowColumnInput);
                    }
                    document.querySelectorAll(".price").forEach((item) => {
                        item.addEventListener("keyup", function() {
                            if (this.value) {
                                checkProductInput();
                            } else {
                                document.getElementById("save-all").setAttribute("disabled", "true");
                            }
                        })
                    })
                    let deleteSettings = document.createElement("button");
                    deleteSettings.setAttribute("type", "button");
                    deleteSettings.setAttribute("id", "deleteSettings");
                    deleteSettings.setAttribute("class", "confirm");
                    deleteSettings.setAttribute("style", "width: 95px; margin-left: 25px;");
                    deleteSettings.innerHTML = "Delete";
                    subcategoriesDiv.appendChild(deleteSettings);
                    let cancel_all = document.createElement("button");
                    cancel_all.setAttribute("type", "button");
                    cancel_all.setAttribute("id", "cancel-all");
                    cancel_all.setAttribute("class", "confirm");
                    cancel_all.setAttribute("style", "width: 95px;");
                    cancel_all.innerHTML = "Cancel";
                    subcategoriesDiv.appendChild(cancel_all);
                    deleteSettings.addEventListener("click", function() {
                        let checkedBoxes = document.getElementsByClassName("markedSettings");
                        let checked = [];
                        Array.from(checkedBoxes).forEach((item) => {
                            if (item.checked) {
                                checked.push(item.id);
                            }
                        });
                        if (checked.length) {
                            for (i in checked) {
                                document.getElementById(checked[i]).parentElement.parentElement.remove();
                                for (j in selectedSettings) {
                                    if (selectedSettings[j] === checked[i]) {
                                        selectedSettings.splice(j, 1);
                                    }
                                }
                                if (!selectedSettings.length) {
                                    document.getElementById("settingsToAdd").removeAttribute("hidden");
                                    document.getElementById("addSettings").removeAttribute("hidden");
                                    for (let option of document.getElementById('settingsToAdd').options)
                                    {
                                        if (option.selected && option.value !== "No settings") {
                                            option.selected = false;
                                        }
                                    }
                                }
                            }
                        }
                        let prices = document.getElementsByClassName("new");
                        if (!prices.length > 0) {
                            let delbutton = document.getElementById("deleteSettings");
                            delbutton.remove();
                            let cancelbutton = document.getElementById("cancel-all");
                            cancelbutton.remove();
                        }
                    })
                    cancel_all.addEventListener("click", function() {
                        selectedSettings = [];
                        document.getElementById("settingsToAdd").removeAttribute("hidden");
                        document.getElementById("addSettings").removeAttribute("hidden");
                        document.getElementById("newproductprice").removeAttribute("disabled");
                        for (let option of document.getElementById('settingsToAdd').options)
                        {
                            if (option.selected && option.value !== "No settings") {
                                option.selected = false;
                            }
                        }
                        document.querySelectorAll(".markedSettings").forEach((item) => {
                            item.parentElement.parentElement.remove();
                        });
                        deleteSettings.remove();
                        this.remove();
                    })
                }
            })
        }
        cancelSvg.addEventListener("click", function() {
            let rows = document.getElementsByClassName("subcategoriesTableRow");
            Array.from(rows).forEach((item) => {
                item.remove();
                let cancel = document.getElementById("cancel");
                if (cancel) {
                    cancel.remove();
                }
                let save = document.getElementById("save-all");
                if (save) {
                    save.remove();
                }
                let add = document.getElementById("add-subcategory");
                if (add) {
                    add.removeAttribute("hidden");
                }
            })
            let prices = document.getElementsByClassName("new");
            if (prices) {
                Array.from(prices).forEach((item) => {
                    item.remove();
                })
            }
            let delbutton = document.getElementById("deleteSettings");
            if (delbutton) {
                delbutton.remove();
            }
            let cancelbutton = document.getElementById("cancel-all");
            if (cancelbutton) {
                cancelbutton.remove();
            }
        })
    })
}
// Function to check input for modifier subcategories.
function checkAllFields() {
    selected = [];
    modifier_category = document.getElementById("newmodifiersubcategory");
    modifier_price = document.getElementById("newmodifierprice");
    for (let option of document.getElementById('select').options)
    {
        if (option.selected && option.value !== "No products") {
            selected.push(option.value);
        }
    }
    if (modifier_category.value && modifier_price.value && selected.length && selected[0] !== "No products") {
        document.getElementById("save-all").removeAttribute("disabled");
    } else {
        document.getElementById("save-all").setAttribute("disabled", "true");
    }
}
// Function to check input for products.
function checkProductInput() {
    newProduct = "";
    newProductPrice = 0;
    newProductSettings = {};
    let productPrice = document.getElementById("newproductprice");
    let multiselect = document.getElementById("settingsToAdd");
    let productName = document.getElementById("newproductsubcategory");
    let correct;
    if (productName.value) {
        correct = true;
        for (i in data[activecategory]) {
            if (!productName.value || productName.value === data[activecategory][i]) {
                correct = false;
                productName.style = "border-color:red";
            }
        }
        if (correct && productName.hasAttribute("style")) {
            productName.removeAttribute("style");
        }
    }
    if (!productPrice.hasAttribute("disabled")) {
        if (productPrice.value && correct && productName.value) {
            newProductPrice = productPrice.value;
            newProduct = productName.value;
            document.getElementById("save-all").removeAttribute("disabled");
        } else {
            document.getElementById("save-all").setAttribute("disabled", "true");
        }
    } else if (!multiselect.hasAttribute("disabled")) {
        let status = true;
        document.querySelectorAll(".price").forEach((item) => {
            if (!item.value) {
                status = false;
            } else {
                newProductSettings[item.name] = item.value;
            }
        })
        if (status === true && correct && productName.value) {
            newProduct = productName.value;
            document.getElementById("save-all").removeAttribute("disabled");
        } else {
            document.getElementById("save-all").setAttribute("disabled", "true");
        }
    }
}
// Function to edit options.
function editOptions(subcategory) {
    let cell = document.getElementById(subcategory);
    let row = cell.parentElement;
    cell.remove();
    cell = document.createElement("td");
    cell.setAttribute("id", subcategory);
    cell.setAttribute("class", "subcategorynames");
    cell.setAttribute("href", "#");
    cell.setAttribute("style", "display: flex;");
    row.appendChild(cell);
    // Edit option name.
    let inputField = document.createElement("input");
    inputField.setAttribute("type", "text");
    if (activetab === "modifier_categories") {
        inputField.setAttribute("class", "modifierNameEdit form-control");
    } else {
        inputField.setAttribute("class", "settingNameEdit form-control");
    }
    inputField.setAttribute("id", "input" + subcategory);
    inputField.setAttribute("value", subcategory);
    cell.appendChild(inputField);
    update_modifier[subcategory] = {};
    inputField.addEventListener("keyup", function() {
        if (activetab === "modifier_categories") {
            update_modifier[subcategory]["name"] = this.value;
        } else {
            let temp = {};
            temp[this.parentElement.id] = this.value;
            update_setting[activecategory] = temp;
        }
    })
    if (activetab === "modifier_categories") {
        inputField = document.createElement("input");
        inputField.setAttribute("id", "price" + subcategory);
        inputField.setAttribute("value", modifiers_dict[activecategory][subcategory]);
        inputField.setAttribute("class", "form-control");
        cell.appendChild(inputField);
        inputField.addEventListener("keyup", function() {
            update_modifier[subcategory]["price"] = this.value;
        });
    }
    // Cancel editing.
    let cancelEdit = document.createElement("svg");
    cancelEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    cancelEdit.setAttribute("width", "16");
    cancelEdit.setAttribute("height", "16");
    cancelEdit.setAttribute("fill", "currentColor");
    cancelEdit.setAttribute("class", "bi bi-x-lg");
    cancelEdit.setAttribute("viewBox", "0 0 16 16");
    cancelEdit.setAttribute("style", "color: Tan; margin-left: 10px;");
    cell.appendChild(cancelEdit);
    cancelEdit.addEventListener("click", function() {
        let row = this.parentElement.parentElement;
        let subcategory = this.parentElement.id;
        this.parentElement.remove();
        let cell = document.createElement("td");
        cell.setAttribute("id", subcategory);
        cell.setAttribute("class", "subcategorynames");
        cell.setAttribute("href", "#");
        cell.innerHTML = subcategory;
        row.appendChild(cell);
        cell.addEventListener("click", function() {
            editOptions(subcategory);
        });
    });
    let pathEdit = document.createElement("path");
    pathEdit.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
    cancelEdit.appendChild(pathEdit);
    // Confirm editing.
    let confirmEdit = document.createElement("svg");
    confirmEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    confirmEdit.setAttribute("width", "16");
    confirmEdit.setAttribute("height", "16");
    confirmEdit.setAttribute("fill", "currentColor");
    confirmEdit.setAttribute("class", "bi bi-check-lg");
    confirmEdit.setAttribute("viewBox", "0 0 16 16");
    confirmEdit.setAttribute("style", "color: Tan; margin-left: 10px;");
    cell.appendChild(confirmEdit);
    pathEdit = document.createElement("path");
    pathEdit.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
    confirmEdit.appendChild(pathEdit);
    // Send data to a server.
    confirmEdit.addEventListener("click", function() {
        let row = this.parentElement.parentElement;
        let subcategory = this.parentElement.id;
        let address;
        let name;
        if (activetab === "modifier_categories") {
            if (update_modifier[subcategory]["name"] || update_modifier[subcategory]["price"] || (update_modifier[subcategory]["name"] && update_modifier[subcategory]["price"])) {
                update_modifier[subcategory]["category"] = activecategory;
                fetch("/update_modifier", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(update_modifier),
                })
            }
        } else {
            if (update_setting[activecategory][subcategory]) {
                fetch("/update_setting", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "old_name": subcategory,
                        "new_name": update_setting[activecategory][subcategory],
                        "category": activecategory,
                    }),
                })
            }
        }
        this.parentElement.remove();
        let cell = document.createElement("td");
        cell.setAttribute("class", "subcategorynames");
        cell.setAttribute("href", "#");
        row.appendChild(cell);
        cell.addEventListener("click", function() {
            editOptions(this.id);
        });
        if (activetab === "modifier_categories") {
            cell.setAttribute("id", update_modifier[subcategory]["name"]);
            cell.innerHTML = update_modifier[subcategory]["name"];
            delete modifiers_dict[activecategory][subcategory];
            modifiers_dict[activecategory][update_modifier[subcategory]["name"]] = update_modifier[subcategory]["price"];
            delete update_modifier[subcategory];
        } else {
            cell.setAttribute("id", update_setting[activecategory][subcategory]);
            cell.innerHTML = update_setting[activecategory][subcategory];
            delete update_setting[activecategory][subcategory];
        }
    })
}

