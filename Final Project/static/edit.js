// Scripts to handle the main page of the Admin Panel and categories management.
let activetab;
let newCategory = {}, updateOptions = {};
window.onload = function () {
    // Get active category from localStorage, if it exists.
    activetab = JSON.parse(localStorage.getItem("activetab"));
    // Show the top menu.
    showMenuButtons();
    // Display header of a current tab.
    let header = document.getElementById("place");
    if (activetab === "product_categories") {
      header.innerHTML = "Product categories";
    } else if (activetab === "modifier_categories") {
      header.innerHTML = "Modifier categories";
    } else {
      header.innerHTML = "Setting categories";
    }
    // Handle tab switching.
    let active = document.getElementsByClassName("menu-button active");
    active = active[0];
    if (activetab) {
      active.setAttribute("class", "menu-button");
      active = document.getElementById(activetab);
      active.setAttribute("class", "menu-button active");
    }
    localStorage.setItem('activetab', JSON.stringify(active.id));
    showCategories(active);
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
  for (i in data) {
    let button = document.createElement("button");
    button.setAttribute("id", i);
    if (i === "product_categories") {
      button.innerHTML = "Products";
    } else if (i === "setting_categories") {
      button.innerHTML = "Settings";
    } else {
      button.innerHTML = "Modifiers";
    }
    if (activetab) {
      if (activetab === i) {
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
    showCategories(item);
    let header = document.getElementById("place");
    if (activetab === "product_categories") {
      header.innerHTML = "Product categories";
    } else if (activetab === "modifier_categories") {
      header.innerHTML = "Modifier categories";
    } else {
      header.innerHTML = "Setting categories";
    }
}
// Show category contents.
function showCategories(item) {
    // Get current category.
    activetab = JSON.parse(localStorage.getItem("activetab"));
    let categoriesDiv = document.getElementById("categories");
    // Clear the container.
    while(categoriesDiv.firstChild) {
      categoriesDiv.removeChild(categoriesDiv.firstChild);
    }
    // "Add category" button.
    let addButton = document.createElement("svg");
    addButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    addButton.setAttribute("width", "16");
    addButton.setAttribute("height", "16");
    addButton.setAttribute("fill", "currentColor");
    addButton.setAttribute("class", "bi bi-plus-lg");
    addButton.setAttribute("viewBox", "0 0 16 16");
    addButton.setAttribute("style", "color: Tan; margin-bottom: 10px; margin-right: 10px;");
    categoriesDiv.appendChild(addButton);
    addButtonPath = document.createElement("path");
    addButtonPath.setAttribute("fill-rule", "evenodd");
    addButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
    addButton.appendChild(addButtonPath);
    // Delete category button.
    let deleteButton = document.createElement("svg");
    deleteButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    deleteButton.setAttribute("width", "16");
    deleteButton.setAttribute("height", "16");
    deleteButton.setAttribute("fill", "currentColor");
    deleteButton.setAttribute("class", "bi bi-trash");
    deleteButton.setAttribute("viewBox", "0 0 16 16");
    deleteButton.setAttribute("style", "color: Tan; margin-bottom: 10px; margin-right: 10px;");
    categoriesDiv.appendChild(deleteButton);
    deleteButtonPath = document.createElement("path");
    deleteButtonPath.setAttribute("fill-rule", "evenodd");
    deleteButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
    deleteButton.appendChild(deleteButtonPath);
    // Create table of categories.
    let categoriesTable = document.createElement("table");
    categoriesTable.setAttribute("id", "categoriesTable");
    categoriesDiv.appendChild(categoriesTable);
    for (category in data[item.id]) {
        let categoriesTableRow = document.createElement("tr");
        categoriesTable.appendChild(categoriesTableRow);
        let categoriesTableRowColumn = document.createElement("td");
        categoriesTableRowColumn.setAttribute("style", "width: 25px;");
        categoriesTableRow.appendChild(categoriesTableRowColumn);
        let categoriesTableRowColumnInput = document.createElement("input");
        categoriesTableRowColumnInput.setAttribute("class", "markedForDeletion");
        categoriesTableRowColumnInput.setAttribute("type", "checkbox");
        categoriesTableRowColumnInput.setAttribute("value", category);
        categoriesTableRowColumn.appendChild(categoriesTableRowColumnInput);
        categoriesTableRowColumn = document.createElement("td");
        categoriesTableRowColumn.setAttribute("id", category);
        categoriesTableRowColumn.setAttribute("class", "categorynames");
        categoriesTableRowColumn.setAttribute("href", "#");
        categoriesTableRowColumn.setAttribute("width", "200px");
        categoriesTableRowColumn.innerHTML = category;
        categoriesTableRow.appendChild(categoriesTableRowColumn);
        categoriesTableRowColumn = document.createElement("td");
        categoriesTableRow.appendChild(categoriesTableRowColumn);
        let editSvg = document.createElement("svg");
        editSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        editSvg.setAttribute("width", "16");
        editSvg.setAttribute("heght", "16");
        editSvg.setAttribute("fill", "currentColor");
        editSvg.setAttribute("class", "bi bi-pencil");
        editSvg.setAttribute("viewBox", "0 0 16 16");
        editSvg.setAttribute("style", "margin-left: 10px; color: Tan;");
        categoriesTableRowColumn.appendChild(editSvg);
        let editPath = document.createElement("path");
        editPath.setAttribute("d", "M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z");
        editSvg.appendChild(editPath);
        // Event listener to edit category name.
        categoriesTableRowColumn.addEventListener("click", function() {
          let row = this.parentElement;
          let id = row.children[1];
          let edit = row.children[2];
          id.setAttribute("hidden", "true");
          edit.setAttribute("hidden", "true");
          let column = document.createElement("td");
          row.appendChild(column);
          let input = document.createElement("input");
          input.setAttribute("type", "text");
          input.setAttribute("value", id.id);
          input.setAttribute("class", "form-control");
          column.appendChild(input);
          input.addEventListener("keyup", function() {
            updateOptions["category"] = activetab;
            updateOptions["old_name"] = id.id;
            updateOptions["new_name"] = this.value;
          });
          column = document.createElement("td");
          row.appendChild(column);
          // "Cancel edit" button.
          let cancelEdit = document.createElement("svg");
          cancelEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          cancelEdit.setAttribute("width", "16");
          cancelEdit.setAttribute("height", "16");
          cancelEdit.setAttribute("fill", "currentColor");
          cancelEdit.setAttribute("class", "bi bi-x-lg");
          cancelEdit.setAttribute("viewBox", "0 0 16 16");
          cancelEdit.setAttribute("style", "margin-left: 10px; color: Tan;");
          column.appendChild(cancelEdit);
          cancelEdit.addEventListener("click", function() {
              row.children[4].remove();
              row.children[3].remove();
              id.removeAttribute("hidden");
              edit.removeAttribute("hidden");
          });
          let pathEdit = document.createElement("path");
          pathEdit.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
          cancelEdit.appendChild(pathEdit);
          // "Confirm edit" button.
          let confirmEdit = document.createElement("svg");
          confirmEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          confirmEdit.setAttribute("width", "16");
          confirmEdit.setAttribute("height", "16");
          confirmEdit.setAttribute("fill", "currentColor");
          confirmEdit.setAttribute("class", "bi bi-check-lg");
          confirmEdit.setAttribute("viewBox", "0 0 16 16");
          confirmEdit.setAttribute("style", "margin-left: 10px; color: Tan;");
          column.appendChild(confirmEdit);
          // Finish editing listener.
          confirmEdit.addEventListener("click", function() {
            if (updateOptions["category"] && updateOptions["old_name"] && updateOptions["new_name"]) {
              fetch("/update_options", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateOptions),
              })
              row.children[4].remove();
              row.children[3].remove();
              id.removeAttribute("hidden");
              edit.removeAttribute("hidden");
              if (activetab === "product_categories") {
                data["product_categories"][updateOptions["new_name"]] = data["product_categories"][id.id];
                delete data["product_categories"][id.id];
              } else if (activetab === "setting_categories") {
                data["setting_categories"][updateOptions["new_name"]] = data["setting_categories"][id.id];
                delete data["setting_categories"][id.id];
              } else if (activetab === "modifier_categories") {
                data["modifier_categories"][updateOptions["new_name"]] = data["modifier_categories"][id.id];
                delete data["modifier_categories"][id.id];
              }
              id.id = updateOptions["new_name"];
              id.innerHTML = updateOptions["new_name"];
            }
          })
        })
    }
    // Listener to enter categories.
    let editCategories = document.getElementsByClassName("categorynames");
    Array.from(editCategories).forEach((item) => {
      item.addEventListener("click", function() {
        let category = item.id;
        localStorage.setItem('activecategory', JSON.stringify(category));
        location.replace("/editsubcats");
      });
    });
    // Listener to delete categories.
    deleteButton.addEventListener("click", function() {
      let checkedBoxes = document.getElementsByClassName("markedForDeletion");
      let checked = [];
      Array.from(checkedBoxes).forEach((item) => {
        if (item.checked) {
          checked.push(item.value);
        }
      });
      let activeCategory = JSON.parse(localStorage.getItem("activetab"));
      fetch('/deletecats', {
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
    });
    // Listener to add categories.
    addButton.addEventListener("click", function() {
      activetab = JSON.parse(localStorage.getItem("activetab"));
      let table = document.getElementById("categoriesTable");
      let row = document.createElement("tr");
      row.setAttribute("style", "height: 25px;");
      row.setAttribute("id", "newmodifierdistance");
      table.appendChild(row);
      row = document.createElement("tr");
      row.setAttribute("id", "newElement");
      table.appendChild(row);
      let cell = document.createElement("td");
      row.appendChild(cell);
      cell = document.createElement("td");
      row.appendChild(cell);
      let inputName = document.createElement("input");
      inputName.setAttribute("type", "text");
      inputName.setAttribute("class", "form-control");
      inputName.setAttribute("placeholder", "Enter category name");
      cell.appendChild(inputName);
      inputName.addEventListener("keyup", function() {
        newCategory[activetab] = this.value;
      })
      if (activetab === "modifier_categories") {
        let div = document.createElement("div");
        div.setAttribute("style", "width: 100%; text-align: center;");
        div.innerHTML = "Choose modifier type";
        cell.appendChild(div);
        let select = document.createElement("select");
        select.setAttribute("class", "form-select form-select-sm");
        select.setAttribute("id", "newModifierType");
        cell.appendChild(select);
        let count = 0;
        for (i in modifier_category_types) {
          let option = document.createElement("option");
          option.setAttribute("id", i);
          option.setAttribute("value", modifier_category_types[i]);
          option.innerHTML = i;
          if (count === 0) {
            option.setAttribute("selected", "true");
          }
          select.appendChild(option);
          count++;
        }
      }
      cell = document.createElement("td");
      cell.setAttribute("style", "vertical-align: top;");
      row.appendChild(cell);
      let cancelAdd = document.createElement("svg");
      cancelAdd.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      cancelAdd.setAttribute("width", "16");
      cancelAdd.setAttribute("height", "16");
      cancelAdd.setAttribute("fill", "currentColor");
      cancelAdd.setAttribute("class", "bi bi-x-lg");
      cancelAdd.setAttribute("viewBox", "0 0 16 16");
      cancelAdd.setAttribute("style", "margin-left: 10px; color: Tan;");
      cell.appendChild(cancelAdd);
      let pathAdd = document.createElement("path");
      pathAdd.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
      cancelAdd.appendChild(pathAdd);
      cancelAdd.addEventListener("click", function() {
        let row = this.parentElement.parentElement;
        row.remove();
      });
      let confirmAdd = document.createElement("svg");
      confirmAdd.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      confirmAdd.setAttribute("width", "16");
      confirmAdd.setAttribute("height", "16");
      confirmAdd.setAttribute("fill", "currentColor");
      confirmAdd.setAttribute("class", "bi bi-check-lg");
      confirmAdd.setAttribute("viewBox", "0 0 16 16");
      confirmAdd.setAttribute("style", "margin-left: 10px; color: Tan;");
      cell.appendChild(confirmAdd);
      pathAdd = document.createElement("path");
      pathAdd.setAttribute("d", "M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z");
      confirmAdd.appendChild(pathAdd);
      confirmAdd.addEventListener("click", function() {
        if (newCategory[activetab]) {
          let part;
          if (activetab === "modifier_categories") {
            part = "modifier_category_id";
          } else if (activetab === "product_categories") {
            part = "product_category_id";
          } else {
            part = "setting_category_id";
          }
          let maxId = 0;
          for (i in data[activetab]) {
            if (data[activetab][i][0][part] > maxId) {
              maxId = data[activetab][i][0][part];
            }
          }
          maxId++;
          let body = {};
          body["name"] = newCategory[activetab];
          body["category"] = activetab;
          body["id"] = maxId;
          if (activetab === "modifier_categories") {
            let type = document.getElementById("newModifierType");
            body["type"] = type.value;
          }
          fetch("/new_option", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
          document.getElementById("newElement").remove();
          let row = document.createElement("tr");
          table.appendChild(row);
          let column = document.createElement("td");
          row.appendChild(column);
          let columnInput = document.createElement("input");
          columnInput.setAttribute("class", "markedForDeletion");
          columnInput.setAttribute("type", "checkbox");
          columnInput.setAttribute("value", body["name"]);
          column.appendChild(columnInput);
          column = document.createElement("td");
          column.setAttribute("id", body["name"]);
          column.setAttribute("class", "categorynames");
          column.setAttribute("href", "#");
          column.setAttribute("style", "200px");
          column.innerHTML = body["name"];
          row.appendChild(column);
          document.getElementById(body["name"]).addEventListener("click", function() {
            let category = body["name"];
            localStorage.setItem('activecategory', JSON.stringify(category));
            location.replace("/editsubcats");
          })
          column = document.createElement("td");
          row.appendChild(column);
          let editSvg = document.createElement("svg");
          editSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          editSvg.setAttribute("width", "16");
          editSvg.setAttribute("heght", "16");
          editSvg.setAttribute("fill", "currentColor");
          editSvg.setAttribute("class", "bi bi-pencil");
          editSvg.setAttribute("viewBox", "0 0 16 16");
          editSvg.setAttribute("style", "margin-left: 10px; color: Tan;");
          column.appendChild(editSvg);
          let editPath = document.createElement("path");
          editPath.setAttribute("d", "M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z");
          editSvg.appendChild(editPath);
          column.addEventListener("click", function() {
            let row = this.parentElement;
            let id = row.children[1];
            let edit = row.children[2];
            id.setAttribute("hidden", "true");
            edit.setAttribute("hidden", "true");
            let column = document.createElement("td");
            row.appendChild(column);
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("value", id.id);
            input.setAttribute("class", "form-control");
            column.appendChild(input);
            input.addEventListener("keyup", function() {
              updateOptions["category"] = activetab;
              updateOptions["old_name"] = id.id;
              updateOptions["new_name"] = this.value;
            });
            column = document.createElement("td");
            row.appendChild(column);
            let cancelEdit = document.createElement("svg");
            cancelEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            cancelEdit.setAttribute("width", "16");
            cancelEdit.setAttribute("height", "16");
            cancelEdit.setAttribute("fill", "currentColor");
            cancelEdit.setAttribute("class", "bi bi-x-lg");
            cancelEdit.setAttribute("viewBox", "0 0 16 16");
            cancelEdit.setAttribute("style", "margin-left: 10px; color: Tan;");
            column.appendChild(cancelEdit);
            cancelEdit.addEventListener("click", function() {
                row.children[4].remove();
                row.children[3].remove();
                id.removeAttribute("hidden");
                edit.removeAttribute("hidden");
            });
            let pathEdit = document.createElement("path");
            pathEdit.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
            cancelEdit.appendChild(pathEdit);
            let confirmEdit = document.createElement("svg");
            confirmEdit.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            confirmEdit.setAttribute("width", "16");
            confirmEdit.setAttribute("height", "16");
            confirmEdit.setAttribute("fill", "currentColor");
            confirmEdit.setAttribute("class", "bi bi-check-lg");
            confirmEdit.setAttribute("viewBox", "0 0 16 16");
            confirmEdit.setAttribute("style", "margin-left: 10px; color: Tan;");
            column.appendChild(confirmEdit);
            confirmEdit.addEventListener("click", function() {
              if (updateOptions["category"] && updateOptions["old_name"] && updateOptions["new_name"]) {
                fetch("/update_options", {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(updateOptions),
                })
                row.children[4].remove();
                row.children[3].remove();
                id.removeAttribute("hidden");
                edit.removeAttribute("hidden");
                if (activetab === "product_categories") {
                  data["product_categories"][updateOptions["new_name"]] = data["product_categories"][id.id];
                  delete data["product_categories"][id.id];
                } else if (activetab === "setting_categories") {
                  data["setting_categories"][updateOptions["new_name"]] = data["setting_categories"][id.id];
                  delete data["setting_categories"][id.id];
                } else if (activetab === "modifier_categories") {
                  data["modifier_categories"][updateOptions["new_name"]] = data["modifier_categories"][id.id];
                  delete data["modifier_categories"][id.id];
                }
                id.id = updateOptions["new_name"];
                id.innerHTML = updateOptions["new_name"];
                let checkboxes = document.getElementsByClassName("markedForDeletion");
                Array.from(checkboxes).forEach((item) => {
                  if (item.value === updateOptions["old_name"]) {
                    item.value = updateOptions["new_name"];
                  }
                })
              }
            })
          })
          document.getElementById("newmodifierdistance").remove();
        }
      })
    })
}