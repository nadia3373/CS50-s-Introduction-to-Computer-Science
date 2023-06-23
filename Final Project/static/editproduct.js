// Scripts to handle product, setting or modifier editing.
let activeProduct, activeCategory, product_subcategory_id, product_subcategory_name, product_subcategory_image, availableSettingsLength, availableModifiersLength, width;
let newName;
let settings_update = {}, settings_delete = {}, availableSettings = {}, availableModifiers = {}, name_update = {}, categories = [];
window.onload = check;
function check() {
    // Get active item and active category if they exist.
    activeProduct = JSON.parse(localStorage.getItem("activesubcategory"));
    activeCategory = JSON.parse(localStorage.getItem("activecategory"));
    categories = ["product_categories", "setting_categories", "modifier_categories"];
    // Show the top menu.
    showMenuButtons();
    // Adjust contents to screen size.
    width = document.documentElement.clientWidth;
    if (width <= 570) {
        document.getElementById("image").setAttribute("style", "width: 100%; min-width: 250px;");
        document.getElementById("content").setAttribute("style", "width: 100%;");
    }
    if (width < 1400) {
        document.getElementById("settings").setAttribute("style", "width: 100%; align-self: flex-start; align-items: center; display: inline-flex; flex-wrap: wrap; justify-content: center; padding: 0");
        document.getElementById("newSetting").setAttribute("style", "display: flex; flex-wrap: wrap; width: 100%; padding: 0");
        document.getElementById("settings").after(document.getElementById("newSetting"));
        document.getElementById("modifiers").setAttribute("style", "width: 100%; align-self: flex-start; align-items: center; display: inline-flex; flex-wrap: wrap; justify-content: center;");
        document.getElementById("newModifier").setAttribute("style", "display: flex; flex-wrap: wrap; width: 100%");
        document.getElementById("modifiers").after(document.getElementById("newModifier"));
    }
    // Handle window resizing.
    window.addEventListener("resize", function() {
        width = document.documentElement.clientWidth;
        if (width <= 570) {
            document.getElementById("image").setAttribute("style", "width: 100%; min-width: 250px;");
            document.getElementById("content").setAttribute("style", "width: 100%;");
        } else {
            document.getElementById("image").setAttribute("style", "width: 20%; min-width: 250px;");
            document.getElementById("content").setAttribute("style", "width: 80%;");
        }
        if (width < 1400) {
            document.getElementById("settings").setAttribute("style", "width: 100%; align-self: flex-start; align-items: center; display: inline-flex; flex-wrap: wrap; justify-content: center; padding: 0");
            document.getElementById("newSetting").setAttribute("style", "display: flex; flex-wrap: wrap; width: 100%; padding: 0;");
            document.getElementById("settings").after(document.getElementById("newSetting"));
            document.getElementById("modifiers").setAttribute("style", "width: 100%; align-self: flex-start; align-items: center; display: inline-flex; flex-wrap: wrap; justify-content: center;");
            document.getElementById("newModifier").setAttribute("style", "display: flex; flex-wrap: wrap; width: 100%");
            document.getElementById("modifiers").after(document.getElementById("newModifier"));
        } else {
            document.getElementById("settings").setAttribute("style", "width: 50%; align-self: flex-start; align-items: center; display: inline-flex; flex-wrap: wrap; justify-content: center; padding-right: 35px;");
            document.getElementById("newSetting").setAttribute("style", "display: flex; flex-wrap: wrap; width: 50%; padding-right: 35px;");
            document.getElementById("modifiers").setAttribute("style", "width: 50%; align-self: flex-start; align-items: center; display: inline-flex; flex-wrap: wrap; justify-content: center;");
            document.getElementById("newModifier").setAttribute("style", "display: flex; flex-wrap: wrap; width: 50%");
            document.getElementById("modifiers").after(document.getElementById("newSetting"));
            document.getElementById("newSetting").after(document.getElementById("newModifier"));
        }
    })
    // If active item or active category do not exist, redirect to the upper level.
    if (!activeProduct || !activeCategory) {
        location.replace("/editsubcats");
    } else {
        showOptions(activeProduct);
    }
    // Handle tab switching.
    let activetab = JSON.parse(localStorage.getItem("activetab"));
    let active = document.getElementsByClassName("menu-button active");
    active = active[0];
    if (activetab) {
      active.setAttribute("class", "menu-button");
      active = document.getElementById(activetab);
      active.setAttribute("class", "menu-button active");
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
    localStorage.removeItem("activesubcategory");
    location.replace("/edit");
}
// Show item contents.
function showOptions(activeProduct) {
    newName = activeProduct;
    let name = document.getElementById("name");
    name.setAttribute("value", activeProduct);
    checkAvailableSettings();
    checkAvailableModifiers();
    // Show setting for a prodct.
    for (i in prod[activeCategory]["items"][activeProduct]) {
        if (prod[activeCategory]["items"][activeProduct][i]["setting_name"] !== "NULL") {
            let settingsTable = document.getElementById("settingsTable");
            let settingsTableRow = document.createElement("tr");
            settingsTableRow.setAttribute("id", "row" + prod[activeCategory]["items"][activeProduct][i]["setting_name"]["setting_name"]);
            settingsTable.appendChild(settingsTableRow);
            let settingsTableRowColumn = document.createElement("td");
            settingsTableRowColumn.setAttribute("width", "15px");
            settingsTableRow.appendChild(settingsTableRowColumn);
            let settingsTableRowColumnInput = document.createElement("input");
            settingsTableRowColumnInput.setAttribute("class", "markedForDeletionSettings");
            settingsTableRowColumnInput.setAttribute("type", "checkbox");
            settingsTableRowColumnInput.setAttribute("id", prod[activeCategory]["items"][activeProduct][i]["setting_name"]["setting_name"]);
            settingsTableRowColumnInput.setAttribute("value", prod[activeCategory]["items"][activeProduct][i]["setting_id"]);
            settingsTableRowColumn.appendChild(settingsTableRowColumnInput);
            settingsTableRowColumn = document.createElement("td");
            settingsTableRowColumn.setAttribute("class", "settingName");
            settingsTableRowColumn.innerHTML = prod[activeCategory]["items"][activeProduct][i]["setting_name"]["setting_name"];
            settingsTableRow.appendChild(settingsTableRowColumn);
            settingsTableRowColumn = document.createElement("td");
            settingsTableRowColumn.setAttribute("style", "text-align: right");
            settingsTableRowColumn.setAttribute("class", "price");
            settingsTableRowColumn.innerHTML = prod[activeCategory]["items"][activeProduct][i]["product_price"];
            settingsTableRow.appendChild(settingsTableRowColumn);
        }
        product_subcategory_id = prod[activeCategory]["items"][activeProduct][i]["product_subcategory_id"];
        product_subcategory_name = activeProduct;
        product_subcategory_image = prod[activeCategory]["items"][activeProduct][i]["image"];
    }
    // Show modifiers for a product.
    if (prod[activeCategory]["items"][activeProduct][i]["modifiers"]) {
        let modifiersTable = document.getElementById("modifiersTable");
        for (key in prod[activeCategory]["items"][activeProduct][i]["modifiers"]) {
            let keyName = key;
            let modifierCategoryName = "";
            for (modifier in prod[activeCategory]["items"][activeProduct][i]["modifiers"][key]) {
                if (modifierCategoryName !== key) {
                    modifierCategoryName = key;
                    let modifiersTableBodyRow = document.createElement("tr");
                    modifiersTableBodyRow.setAttribute("id", "row" + key);
                    modifiersTable.appendChild(modifiersTableBodyRow);
                    let modifiersTableBodyColumn = document.createElement("td");
                    modifiersTableBodyColumn.setAttribute("width", "15px");
                    modifiersTableBodyRow.appendChild(modifiersTableBodyColumn);
                    let modifiersTableBodyColumnInput = document.createElement("input");
                    modifiersTableBodyColumnInput.setAttribute("class", "markedForDeletionModifiers");
                    modifiersTableBodyColumnInput.setAttribute("type", "checkbox");
                    modifiersTableBodyColumnInput.setAttribute("value", keyName);
                    modifiersTableBodyColumn.appendChild(modifiersTableBodyColumnInput);
                    modifiersTableBodyColumn = document.createElement("td");
                    modifiersTableBodyColumn.innerHTML = keyName;
                    modifiersTableBodyRow.appendChild(modifiersTableBodyColumn);
                }
            }
        }
    }
    // Add edit and delete buttons for settings.
    let settingsTable = document.getElementById("settingsTable");
    if (settingsTable.hasChildNodes) {
        let deleteButton = document.createElement("svg");
        deleteButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        deleteButton.setAttribute("width", "24");
        deleteButton.setAttribute("height", "24");
        deleteButton.setAttribute("fill", "currentColor");
        deleteButton.setAttribute("class", "bi bi-trash");
        deleteButton.setAttribute("viewBox", "0 0 16 16");
        deleteButton.setAttribute("style", "color: Tan; margin-left: 10px; margin-right: 10px;");
        deleteButton.setAttribute("id", "deleteSettings");
        document.getElementById("settings").insertBefore(deleteButton, document.getElementById("addsetting"));
        deleteButtonPath = document.createElement("path");
        deleteButtonPath.setAttribute("fill-rule", "evenodd");
        deleteButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
        deleteButton.appendChild(deleteButtonPath);
        let editButton = document.createElement("svg");
        editButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        editButton.setAttribute("width", "24");
        editButton.setAttribute("heght", "24");
        editButton.setAttribute("fill", "currentColor");
        editButton.setAttribute("class", "bi bi-pencil");
        editButton.setAttribute("viewBox", "0 0 16 16");
        editButton.setAttribute("style", "color: Tan; margin-left: 10px; margin-right: 10px;");
        editButton.setAttribute("id", "editSettings");
        document.getElementById("settings").insertBefore(editButton, document.getElementById("addsetting"));
        let editButtonPath = document.createElement("path");
        editButtonPath.setAttribute("d", "M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z");
        editButton.appendChild(editButtonPath);
    }
    // Add edit and delete buttons for modifiers.
    let modifiersTable = document.getElementById("modifiersTable");
    if (modifiersTable.hasChildNodes) {
        let deleteButton = document.createElement("svg");
        deleteButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        deleteButton.setAttribute("width", "24");
        deleteButton.setAttribute("height", "24");
        deleteButton.setAttribute("fill", "currentColor");
        deleteButton.setAttribute("class", "bi bi-trash");
        deleteButton.setAttribute("viewBox", "0 0 16 16");
        deleteButton.setAttribute("style", "color: Tan; margin-left: 10px; margin-right: 10px;");
        deleteButton.setAttribute("id", "deleteModifiers");
        document.getElementById("modifiers").insertBefore(deleteButton, document.getElementById("addmodifier"));
        deleteButtonPath = document.createElement("path");
        deleteButtonPath.setAttribute("fill-rule", "evenodd");
        deleteButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
        deleteButton.appendChild(deleteButtonPath);
    }
    // Display image and file upload form for a product.
    let img = document.createElement("img");
    img.setAttribute("src", product_subcategory_image);
    img.setAttribute("class", "img-fluid rounded-start");
    img.setAttribute("alt", "...");
    img.setAttribute("id", "productImage");
    let imageDiv = document.getElementById("image");
    imageDiv.appendChild(img);
    let load = document.createElement("input");
    load.setAttribute("type", "file");
    load.setAttribute("id", "formFile");
    imageDiv.appendChild(load);
    // Display product status.
    let productStatus = document.getElementById("status");
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", "productCurrentStatus");
    checkBox.setAttribute("name", product_subcategory_name);
    for (j in prod[activeCategory]["items"][activeProduct]) {
        if (prod[activeCategory]["items"][activeProduct][j]["status"] === "true") {
            checkBox.setAttribute("checked", "true");
        }
    }
    productStatus.appendChild(checkBox);
    startEventListeners();
}
function startEventListeners() {
    // Listener to change product name.
    let editName = document.getElementById("editName");
    editName.addEventListener("click", function () {
        this.setAttribute("hidden", "true");
        let name = document.getElementById("name");
        name.removeAttribute("readonly");
        name.setAttribute("class", "form-control");
        name.addEventListener("keyup", function () {
            newName = $(name).val();
            name_update["new_name"] = newName;
            name_update["old_name"] = product_subcategory_name;
            name_update["type"] = activeCategory;
        });
        let editButton = document.createElement("svg");
        editButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        editButton.setAttribute("width", "16");
        editButton.setAttribute("height", "16");
        editButton.setAttribute("fill", "currentColor");
        editButton.setAttribute("class", "bi bi-check-lg");
        editButton.setAttribute("viewBox", "0 0 16 16");
        editButton.setAttribute("style", "color: Tan;");
        document.getElementById("productName").appendChild(editButton);
        editButtonPath = document.createElement("path");
        editButtonPath.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
        editButton.appendChild(editButtonPath);
        editButton.addEventListener("click", function() {
            this.remove();
            document.getElementById("editName").removeAttribute("hidden");
            let name = document.getElementById("name");
            name.setAttribute("readonly", "true");
            name.setAttribute("class", "form-control-plaintext");
            activeProduct = name_update["new_name"];
            localStorage.setItem("activesubcategory", JSON.stringify(activeProduct));
            if (name_update["new_name"] && name_update["old_name"] && name_update["type"]) {
                fetch("/update_options", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(name_update),
                })
                .then((response) => {
                    if(response.redirected){
                        window.location.href = response.url;
                    }
                })
            }
        })
    })
    // Listener to launch image cropper.
    let load = document.getElementById("formFile");
    load.addEventListener("change", function () {
        handleFileLoad(this);
    })
    // Listener to delete settings.
    let deleteSettings = document.getElementById("deleteSettings");
    deleteSettings.addEventListener("click", function() {
        let checkedBoxes = document.getElementsByClassName("markedForDeletionSettings");
        let checked = [];
        Array.from(checkedBoxes).forEach((item) => {
            if (item.checked) {
                checked.push(item.value);
            }
        });
        let activeSubcategory = JSON.parse(localStorage.getItem("activesubcategory"));
        fetch('/deleteoptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "items": checked,
                "table": "products",
                "product": activeSubcategory
            }),
        })
        .then((response) => {
            if(response.redirected){
                window.location.href = response.url;
            }
        })
    })
    // Listener to change settings prices.
    let editSettings = document.getElementById("editSettings");
    editSettings.addEventListener("click", function() {
        let checkedBoxes = document.getElementsByClassName("markedForDeletionSettings");
        let checked = [];
        Array.from(checkedBoxes).forEach((item) => {
            if (item.checked) {
                checked.push(item.id);
            }
        })
        for (i in checked) {
            let element = document.getElementById("row" + checked[i]).querySelectorAll(".price");
            let formerPrice = element[0].innerHTML;
            element[0].remove();
            let td = document.createElement("td");
            td.setAttribute("id", "secondColumn");
            td.setAttribute("style", "display: inline-flex; justify-content: space-between;");
            document.getElementById("row" + checked[i]).appendChild(td);
            let settingPrice = document.createElement("input");
            settingPrice.setAttribute("type", "text");
            settingPrice.setAttribute("value", formerPrice);
            settingPrice.setAttribute("class", "settingPrice form-control");
            settingPrice.setAttribute("style", "padding: 0; width: 70px;");
            td.appendChild(settingPrice);
        }
        if (checked.length) {
            this.remove();
            let saveButton = document.createElement("svg");
            saveButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            saveButton.setAttribute("width", "16");
            saveButton.setAttribute("height", "16");
            saveButton.setAttribute("fill", "currentColor");
            saveButton.setAttribute("class", "bi bi-check-lg");
            saveButton.setAttribute("viewBox", "0 0 16 16");
            saveButton.setAttribute("id", "saveButton");
            saveButton.setAttribute("style", "color: Tan;");
            document.getElementById("secondColumn").appendChild(saveButton);
            saveButtonPath = document.createElement("path");
            saveButtonPath.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
            saveButton.appendChild(saveButtonPath);
            saveButton.addEventListener("click", function() {
                let settings = {};
                for (i in checked) {
                    let element = document.getElementById("row" + checked[i]).querySelectorAll(".settingPrice");
                    let name = document.getElementById("row" + checked[i]).querySelectorAll(".settingName");
                    settings[name[0].innerHTML] = element[0].value;
                }
                let activeSubcategory = JSON.parse(localStorage.getItem("activesubcategory"));
                fetch('/updateoptions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "items": settings,
                        "table": "settings",
                        "product": activeSubcategory
                    }),
                })
                .then((response) => {
                    if(response.redirected){
                        window.location.href = response.url;
                    }
                })
            })
        }
    })
    // Listener to delete modifiers.
    let deleteModifiers = document.getElementById("deleteModifiers");
    deleteModifiers.addEventListener("click", function() {
        let checkedBoxes = document.getElementsByClassName("markedForDeletionModifiers");
        let checked = [];
        Array.from(checkedBoxes).forEach((item) => {
            if (item.checked) {
                checked.push(item.value);
            }
        });
        let activeSubcategory = JSON.parse(localStorage.getItem("activesubcategory"));
        fetch('/deleteoptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "items": checked,
                "table": "modifiers",
                "product": activeSubcategory
            }),
        })
        .then((response) => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
    })
    // Listener to change product status.
    document.getElementById("productCurrentStatus").addEventListener("change", function () {
        let activeSubcategory = JSON.parse(localStorage.getItem("activesubcategory"));
        fetch('/updateoptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "status": this.checked,
                "table": "status",
                "product": activeSubcategory
            }),
        })
        .then((response) => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
    })
    // Listener to return to product subcategories.
    let backButton = document.getElementById("back");
    backButton.addEventListener("click", function() {
        localStorage.removeItem("activesubcategory");
        location.replace("/editsubcats");
    })
    // Listener to add settings.
    let addsetting = document.getElementById("addsetting");
    addsetting.addEventListener("click", function() {
        this.setAttribute("hidden", "true");
        let div = document.getElementById("newSetting");
        let select = document.createElement("select");
        select.setAttribute("class", "form-select-sm");
        select.setAttribute("style", "width: 70%;");
        select.setAttribute("id", "newSettingSelect");
        div.appendChild(select);
        let selectOption = document.createElement("option");
        selectOption.setAttribute("selected", "true");
        selectOption.innerHTML = "Choose a setting";
        select.appendChild(selectOption);
        for (i in availableSettings) {
            selectOption = document.createElement("option");
            selectOption.setAttribute("value", i);
            selectOption.innerHTML = i;
            select.appendChild(selectOption);
        }
        // Enter setting price.
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "form-control");
        input.setAttribute("style", "width: 70px;");
        input.setAttribute("placeholder", "Price");
        input.setAttribute("id", "newSettingPrice");
        div.appendChild(input);
        // Cancel adding setting.
        let cancelButton = document.createElement("svg");
        cancelButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        cancelButton.setAttribute("width", "16");
        cancelButton.setAttribute("height", "16");
        cancelButton.setAttribute("fill", "currentColor");
        cancelButton.setAttribute("class", "bi bi-x-lg");
        cancelButton.setAttribute("viewBox", "0 0 16 16");
        cancelButton.setAttribute("style", "color: Tan;");
        div.appendChild(cancelButton);
        let cancelButtonPath = document.createElement("path");
        cancelButtonPath.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
        cancelButton.appendChild(cancelButtonPath);
        // Confirm adding setting.
        let addButton = document.createElement("svg");
        addButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        addButton.setAttribute("width", "16");
        addButton.setAttribute("height", "16");
        addButton.setAttribute("fill", "currentColor");
        addButton.setAttribute("class", "bi bi-check-lg");
        addButton.setAttribute("viewBox", "0 0 16 16");
        addButton.setAttribute("style", "color: Tan;");
        div.appendChild(addButton);
        addButtonPath = document.createElement("path");
        addButtonPath.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
        addButton.appendChild(addButtonPath);
        select.addEventListener("change", function () {
            if (this.value !== "Choose a setting") {
                this.removeAttribute("style");
            }
        })
        input.addEventListener("keyup", function () {
            if (this.value) {
                this.removeAttribute("style");
            }
        })
        cancelButton.addEventListener("click", function () {
            let settings = document.getElementById("newSetting");
            while (settings.firstChild) {
                settings.removeChild(settings.firstChild);
            }
            addButton.remove();
            this.remove();
        })
        addButton.addEventListener("click", function () {
            if (!select.value || select.value === "Choose a setting") {
                select.setAttribute("style", "border-color:red");
            } else if (!input.value) {
                input.setAttribute("style", "border-color:red");
            } else if (select.value !== "Choose a setting" && input.value) {
                let activeSubcategory = JSON.parse(localStorage.getItem("activesubcategory"));
                fetch('/updateoptions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "items": select.value,
                        "price": input.value,
                        "table": "products",
                        "product": activeSubcategory
                    }),
                })
                .then((response) => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
            }
        })
    })
    // Listener to add modifier.
    let addModifier = document.getElementById("addmodifier");
    addModifier.addEventListener("click", function() {
        // Display list of available modifiers.
        this.setAttribute("hidden", "true");
        let div = document.getElementById("newModifier");
        let select = document.createElement("select");
        select.setAttribute("class", "form-select-sm");
        select.setAttribute("style", "width: 70%;")
        select.setAttribute("id", "newModifierSelect");
        div.appendChild(select);
        let selectOption = document.createElement("option");
        selectOption.setAttribute("selected", "true");
        selectOption.innerHTML = "Choose a modifier";
        select.appendChild(selectOption);
        for (i in availableModifiers) {
            selectOption = document.createElement("option");
            selectOption.setAttribute("value", i);
            selectOption.innerHTML = i;
            select.appendChild(selectOption);
        }
        // Cancel adding modifier.
        let cancelButton = document.createElement("svg");
        cancelButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        cancelButton.setAttribute("width", "16");
        cancelButton.setAttribute("height", "16");
        cancelButton.setAttribute("fill", "currentColor");
        cancelButton.setAttribute("class", "bi bi-x-lg");
        cancelButton.setAttribute("viewBox", "0 0 16 16");
        cancelButton.setAttribute("style", "color: Tan;");
        div.appendChild(cancelButton);
        let cancelButtonPath = document.createElement("path");
        cancelButtonPath.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
        cancelButton.appendChild(cancelButtonPath);
        // Confirm adding modifier.
        let addButton = document.createElement("svg");
        addButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        addButton.setAttribute("width", "16");
        addButton.setAttribute("height", "16");
        addButton.setAttribute("fill", "currentColor");
        addButton.setAttribute("class", "bi bi-check-lg");
        addButton.setAttribute("viewBox", "0 0 16 16");
        addButton.setAttribute("style", "color: Tan;");
        div.appendChild(addButton);
        addButtonPath = document.createElement("path");
        addButtonPath.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
        addButton.appendChild(addButtonPath);
        select.addEventListener("change", function () {
            if (this.value !== "Choose a modifier") {
                this.removeAttribute("style");
            }
        })
        cancelButton.addEventListener("click", function () {
            let modifiers = document.getElementById("newModifier");
            while (modifiers.firstChild) {
                modifiers.removeChild(modifiers.firstChild);
            }
            addButton.remove();
            this.remove();
        })
        addButton.addEventListener("click", function () {
            if (!select.value || select.value === "Choose a modifier") {
                select.setAttribute("style", "border-color:red");
            } else if (select.value !== "Choose a modifier") {
                let activeSubcategory = JSON.parse(localStorage.getItem("activesubcategory"));
                fetch('/updateoptions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "items": select.value,
                        "table": "modifiers",
                        "product": activeSubcategory
                    }),
                })
                .then((response) => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                })
            }
        })
    })
}
// Function to check available modifiers for a product.
function checkAvailableModifiers() {
    for (i in modifier_categories) {
        let status = false;
        for (k in prod[activeCategory]["items"][activeProduct]) {
            if (prod[activeCategory]["items"][activeProduct][k]["modifiers"]) {
                for (j in prod[activeCategory]["items"][activeProduct][k]["modifiers"]) {
                    if (modifier_categories[i]["modifier_category_name"] === j) {
                        status = true;
                    }
                }
            }
        }
        if (status === false) {
            availableModifiers[modifier_categories[i]["modifier_category_name"]] = modifier_categories[i];
        }
    }
    availableModifiersLength = Object.keys(availableModifiers).length;
    if (!Object.keys(availableModifiers).length) {
        document.getElementById("addmodifier").setAttribute("hidden", "true");
    }
}
// Function to check available settings for a product.
function checkAvailableSettings() {
    for (i in settings) {
        let status = false;
        for (k in prod[activeCategory]["items"][activeProduct]) {
            if (prod[activeCategory]["items"][activeProduct][k]["setting_name"] !== "NULL") {
                if (settings[i]["setting_name"] === prod[activeCategory]["items"][activeProduct][k]["setting_name"]["setting_name"]) {
                    status = true;
                }
            } else {
                availableSettings[settings[i]["setting_name"]] = settings[i];
            }
        }
        if (status === false) {
            availableSettings[settings[i]["setting_name"]] = settings[i];
        }
    }
    availableSettingsLength = Object.keys(availableSettings).length;
    if (!Object.keys(availableSettings).length) {
        document.getElementById("addsetting").setAttribute("hidden", "true");
    }
}
// Function to launch image cropper.
function launchCroppie() {
    let $uploadCrop = $('#productImage').croppie({
        viewport: {
            width: 200,
            height: 200,
            type: 'square'
        },
        boundary: {
            width: 300,
            height: 300
        }
    });
    document.getElementsByClassName("img-fluid rounded-start cr-original-image")[0].setAttribute("hidden", "true");
    return $uploadCrop;
}
// Function handle image upload.
function handleFileLoad(element) {
    let link = URL.createObjectURL(element.files[0]);
    let imageDiv = document.getElementById("image");
    let image = document.getElementById("productImage");
    image.setAttribute("src", link);
    let cropped = launchCroppie();
    document.getElementById("formFile").remove();
    let slider = document.getElementsByClassName("cr-slider-wrap")[0];
    // Cancel file upload.
    let cancelButtonSvg = document.createElement("svg");
    cancelButtonSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    cancelButtonSvg.setAttribute("width", "16");
    cancelButtonSvg.setAttribute("height", "16");
    cancelButtonSvg.setAttribute("fill", "currentColor");
    cancelButtonSvg.setAttribute("class", "bi bi-x-lg");
    cancelButtonSvg.setAttribute("viewBox", "0 0 16 16");
    cancelButtonSvg.setAttribute("style", "color: Tan; margin-left: 10px;");
    cancelButtonSvg.setAttribute("id", "cancelSave");
    slider.after(cancelButtonSvg);
    let cancelButtonSvgPath = document.createElement("path");
    cancelButtonSvgPath.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
    cancelButtonSvg.appendChild(cancelButtonSvgPath);
    cancelButtonSvg.addEventListener("click", function() {
        let img = document.createElement("img");
        img.setAttribute("src", product_subcategory_image);
        img.setAttribute("class", "img-fluid rounded-start");
        img.setAttribute("alt", "...");
        img.setAttribute("id", "productImage");
        let imageDiv = document.getElementById("image");
        imageDiv.appendChild(img);
        let load = document.createElement("input");
        load.setAttribute("type", "file");
        load.setAttribute("id", "formFile");
        imageDiv.appendChild(load);
        load.addEventListener("change", function () {
            handleFileLoad(this);
        })
        $('#productImage').croppie("destroy");
        document.getElementById("saveImage").remove();
        this.remove();
        document.getElementsByClassName("croppie-container")[0].remove();
    })
    // Confirm file upload.
    confirmButtonSvg = document.createElement("svg");
    confirmButtonSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    confirmButtonSvg.setAttribute("width", "16");
    confirmButtonSvg.setAttribute("height", "16");
    confirmButtonSvg.setAttribute("fill", "currentColor");
    confirmButtonSvg.setAttribute("class", "bi bi-check-lg");
    confirmButtonSvg.setAttribute("viewBox", "0 0 16 16");
    confirmButtonSvg.setAttribute("style", "color: Tan; margin-left: 10px;");
    confirmButtonSvg.setAttribute("id", "saveImage");
    cancelButtonSvg.after(confirmButtonSvg);
    confirmButtonSvgPath = document.createElement("path");
    confirmButtonSvgPath.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
    confirmButtonSvg.appendChild(confirmButtonSvgPath);
    // Listener to send cropped image to server.
    confirmButtonSvg.addEventListener("click", function () {
        let filename;
        cropped.croppie('result', {
            type: 'blob',
            format: 'png'
        }).then(function (blob) {
            let formData = new FormData();
            formData.append('productImage', blob, product_subcategory_name + '.png');
            $.ajax('/upload', {
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                error: function () {
                    alert("Image was not loaded");
                },
                complete: function () {
                    let timestamp = (new Date()).getTime();
                    newImg = "/static/uploads/" + product_subcategory_name + '.png';
                    filename = newImg + "?_=" + timestamp;
                    let imageDiv = document.getElementById("image");
                    while (imageDiv.firstChild) {
                        imageDiv.removeChild(imageDiv.firstChild);
                    }
                    let backButton = document.createElement("button");
                    backButton.setAttribute("id", "back");
                    backButton.setAttribute("class", "btn btn-primary");
                    backButton.setAttribute("type", "button");
                    imageDiv.appendChild(backButton);
                    backButton.addEventListener("click", function() {
                        localStorage.removeItem("activesubcategory");
                        location.replace("/editsubcats");
                    })
                    let backButtonSvg = document.createElement("svg");
                    backButtonSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    backButtonSvg.setAttribute("width", "16");
                    backButtonSvg.setAttribute("height", "16");
                    backButtonSvg.setAttribute("fill", "currentColor");
                    backButtonSvg.setAttribute("class", "bi bi-arrow-return-left");
                    backButtonSvg.setAttribute("viewBox", "0 0 16 16");
                    backButtonSvg.setAttribute("style", "color: Tan; margin-right: 10px; display: inline-flex;");
                    backButtonSvg.setAttribute("id", "add-subcategory");
                    backButton.appendChild(backButtonSvg);
                    let backButtonSvgPath = document.createElement("path");
                    backButtonSvgPath.setAttribute("fill-rule", "evenodd");
                    backButtonSvgPath.setAttribute("d", "M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z");
                    backButtonSvg.appendChild(backButtonSvgPath);
                    let backButtonText = document.createElement("p");
                    backButtonText.innerHTML = "Back to products";
                    backButtonText.setAttribute("style", "display: inline-flex; margin-bottom: 0; text-decoration: underline; text-decoration-style: dotted;");
                    backButton.appendChild(backButtonText);
                    let img = document.createElement("img");
                    img.setAttribute("class", "img-fluid rounded-start");
                    img.setAttribute("src", newImg + "?_=" + timestamp);
                    img.setAttribute("alt", "...");
                    img.setAttribute("id", "productImage");
                    imageDiv.appendChild(img);
                    let load = document.createElement("input");
                    load.setAttribute("type", "file");
                    load.setAttribute("id", "formFile");
                    imageDiv.appendChild(load);
                    load.addEventListener("change", function () {
                        handleFileLoad(this);
                    });
                    $('#productImage').croppie("destroy");
                    $("#saveImage").remove();
                },
            });
        })
    })
}