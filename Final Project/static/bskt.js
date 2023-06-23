// Scripts to handle basket, changing product quantity, deleting products, recalculating total sum.
let bskt, user, width;
window.onload = check;
function check() {
    // Check if there are items in a basket. If the basket is empty, redirect to "/".
    width = document.documentElement.clientWidth;
    bskt = JSON.parse(localStorage.getItem("bskt"));
    if (!bskt) {
        location.replace("/");
    }
    showNavbar();
    displayBskt();
    counter();
}
//Show the top menu.
function showNavbar() {
    let navbar = document.getElementById("menu");
    let count = 0;
    for (i in prod) {
        let button = document.createElement("button");
        button.setAttribute("id", i);
        button.innerHTML = i;
        button.setAttribute("class", "menu-button");
        navbar.appendChild(button);
        count++;
    }
    tabSwitcher();
    window.addEventListener("resize", function() {
        if (width !== document.documentElement.clientWidth) {
            width = document.documentElement.clientWidth;
            resizer();
        }
    });
}
// Handle window resizing.
function resizer() {
    displayBskt();
}
//Handle tab switching.
function tabSwitcher() {
    let menuItems = document.getElementsByClassName("menu-button");
    Array.from(menuItems).forEach(function(item) {
        item.addEventListener("click", function() {
            let activeCategory = this.id;
            localStorage.setItem('activeCategory', JSON.stringify(activeCategory));
            location.replace("/");
        })
    })
}
// Show basket contents.
function displayBskt() {
    // Clear the container.
    let items = document.getElementById("content");
    while (items.hasChildNodes()) {
        items.removeChild(items.firstChild);
    }
    let paymentOptions = document.getElementById("payment-options");
    while (paymentOptions.hasChildNodes()) {
        paymentOptions.removeChild(paymentOptions.firstChild);
    }
    // Adjust to screen width.
    if (width <= 570) {
        fontSize = "small";
        columnWidth = "15%";
        counterWidth = "60px";
        userWidth = "100%";
        userShift = "0";
    } else {
        fontSize = "medium";
        columnWidth = "10%";
        counterWidth = "80px";
        userWidth = "30%";
        userShift = "10px"
    }
    // Cart table headers.
    let table = document.createElement("table");
    table.setAttribute("class", "table-responsive mb-1");
    table.setAttribute("id", "cartTable");
    document.getElementById("content").appendChild(table);
    let header = document.createElement("thead");
    header.setAttribute("id", "cartTableHeader");
    document.getElementById("cartTable").appendChild(header);
    let headerRow = document.createElement("tr");
    headerRow.setAttribute("id", "cartTableHeaderRow");
    document.getElementById("cartTableHeader").appendChild(headerRow);
    let headerColumn = document.createElement("th");
    headerColumn.innerHTML = "Product";
    headerColumn.setAttribute("style", "font-size: " + fontSize);
    document.getElementById("cartTableHeaderRow").appendChild(headerColumn);
    headerColumn = document.createElement("th");
    headerColumn.innerHTML = "Quantity";
    headerColumn.setAttribute("style", "width: " + columnWidth + "; text-align: center; font-size: " + fontSize);
    document.getElementById("cartTableHeaderRow").appendChild(headerColumn);
    headerColumn = document.createElement("th");
    headerColumn.innerHTML = "Price";
    headerColumn.setAttribute("style", "width: " + columnWidth + "; text-align: center; font-size: " + fontSize);
    document.getElementById("cartTableHeaderRow").appendChild(headerColumn);
    headerColumn = document.createElement("th");
    headerColumn.innerHTML = "Total";
    headerColumn.setAttribute("style", "width: " + columnWidth + "; text-align: center; font-size: " + fontSize);
    document.getElementById("cartTableHeaderRow").appendChild(headerColumn);
    headerColumn = document.createElement("th");
    headerColumn.innerHTML = "Delete";
    headerColumn.setAttribute("style", "width: " + columnWidth + "; text-align: center; font-size: " + fontSize);
    document.getElementById("cartTableHeaderRow").appendChild(headerColumn);
    // Cart table body.
    let body = document.createElement("tbody");
    body.setAttribute("id", "cartTableBody");
    document.getElementById("cartTable").appendChild(body);
    for (const i in bskt) {
        if (bskt[i].product_price) {
            productPrice = Number(bskt[i].product_price);
        } else {
            productPrice = Number(bskt[i].setting_price);
        }
        let itemSum = 0;
        let bodyRow = document.createElement("tr");
        bodyRow.setAttribute("id", "cartTableBodyRow" + i);
        bodyRow.setAttribute("style", "height: 50px;");
        document.getElementById("cartTableBody").appendChild(bodyRow);
        // Product name.
        let bodyColumn = document.createElement("td");
        bodyColumn.setAttribute("id", "firstColumn" + i);
        bodyColumn.setAttribute("class", "fs-6");
        bodyColumn.setAttribute("style", "text-align: left; font-size: " + fontSize + "!important;");
        bodyColumn.innerHTML = bskt[i].product_name;
        if (bskt[i].setting_name != "NULL") {
            bodyColumn.innerHTML +=  " (" + bskt[i].setting_name + ")";
        }
        document.getElementById("cartTableBodyRow" + i).appendChild(bodyColumn);
        // Modifiers.
        if (Object.keys(bskt[i].modifiers).length !== 0) {
            let settingsParagraph = document.createElement("p");
            settingsParagraph.setAttribute("class", "fs-6 fw-light");
            settingsParagraph.setAttribute("style", "margin-bottom: 0; font-size: small!important;");
            settingsParagraph.innerHTML = "Modifiers: ";
            for (k in bskt[i].modifiers) {
                settingsParagraph.innerHTML += k + " – " + bskt[i].modifiers[k] + "p. ";
                itemSum += Number(bskt[i].modifiers[k]);
            }
            document.getElementById("firstColumn" + i).appendChild(settingsParagraph);
        }
        // Product quantity with a spinner.
        bodyColumn = document.createElement("td");
        bodyColumn.setAttribute("class", "fs-6");
        bodyColumn.setAttribute("id", "quantity" + i);
        bodyColumn.setAttribute("cart_id", i);
        bodyColumn.setAttribute("style", "text-align: center; font-size: " + fontSize + "!important;");
        document.getElementById("cartTableBodyRow" + i).appendChild(bodyColumn);
        let counterDiv = document.createElement("div");
        counterDiv.setAttribute("class", "input-group bskt");
        counterDiv.setAttribute("style", "width: " + counterWidth + "; margin-right: 10px; margin-left: 10px; display: inline-flex; justify-content: center; align-items: center;");
        bodyColumn.appendChild(counterDiv);
        let decrement = document.createElement("div");
        decrement.setAttribute("class", "decrement");
        counterDiv.appendChild(decrement);
        let decrementButton = document.createElement("svg");
        decrementButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        decrementButton.setAttribute("width", "16");
        decrementButton.setAttribute("height", "16");
        decrementButton.setAttribute("fill", "currentColor");
        decrementButton.setAttribute("class", "bi bi-dash-lg");
        decrementButton.setAttribute("viewBox", "0 0 16 16");
        decrementButton.setAttribute("style", "height: 100%; color: Cornsilk;");
        decrement.appendChild(decrementButton);
        let decrementButtonPath = document.createElement("path");
        decrementButtonPath.setAttribute("fill-rule", "evenodd");
        decrementButtonPath.setAttribute("d", "M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z");
        decrementButton.appendChild(decrementButtonPath);
        let display = document.createElement("input");
        display.setAttribute("type", "text");
        display.setAttribute("class", "counter");
        display.setAttribute("value", bskt[i]["quantity"]);
        display.setAttribute("readonly", "true");
        display.setAttribute("style", "color: Cornsilk;");
        counterDiv.appendChild(display);
        let increment = document.createElement("div");
        increment.setAttribute("class", "increment");
        counterDiv.appendChild(increment);
        let incrementButton = document.createElement("svg");
        incrementButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        incrementButton.setAttribute("width", "16");
        incrementButton.setAttribute("height", "16");
        incrementButton.setAttribute("fill", "currentColor");
        incrementButton.setAttribute("class", "bi bi-plus-lg");
        incrementButton.setAttribute("viewBox", "0 0 16 16");
        incrementButton.setAttribute("style", "height: 100%; color: Cornsilk;");
        increment.appendChild(incrementButton);
        let incrementButtonPath = document.createElement("path");
        incrementButtonPath.setAttribute("fill-rule", "evenodd");
        incrementButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
        incrementButton.appendChild(incrementButtonPath);
        // Price.
        bodyColumn = document.createElement("td");
        bodyColumn.setAttribute("class", "fs-6");
        bodyColumn.setAttribute("id", "price" + i);
        bodyColumn.setAttribute("style", "text-align: center; font-size: " + fontSize + "!important;");
        bodyColumn.innerHTML = productPrice;
        document.getElementById("cartTableBodyRow" + i).appendChild(bodyColumn);
        // Subtotal.
        bodyColumn = document.createElement("td");
        bodyColumn.setAttribute("class", "fs-6");
        bodyColumn.setAttribute("id", "total" + i);
        bodyColumn.setAttribute("style", "text-align: center; font-size: " + fontSize + "!important;");
        itemSum *= Number(bskt[i].quantity);
        itemSum += Number(bskt[i].quantity) * productPrice;
        bodyColumn.innerHTML = itemSum;
        document.getElementById("cartTableBodyRow" + i).appendChild(bodyColumn);
        // Delete from basket.
        bodyColumn = document.createElement("td");
        bodyColumn.setAttribute("class", "fs-5");
        bodyColumn.setAttribute("style", "text-align: center; font-size: " + fontSize + "!important;");
        document.getElementById("cartTableBodyRow" + i).appendChild(bodyColumn);
        let deleteFromCartSvg = document.createElement("svg");
        deleteFromCartSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        deleteFromCartSvg.setAttribute("width", "16");
        deleteFromCartSvg.setAttribute("height", "16");
        deleteFromCartSvg.setAttribute("fill", "currentColor");
        deleteFromCartSvg.setAttribute("style", "color: Tan");
        deleteFromCartSvg.setAttribute("class", "bi bi-trash");
        deleteFromCartSvg.setAttribute("viewBox", "0 0 16 16");
        deleteFromCartSvg.setAttribute("id", i);
        bodyColumn.appendChild(deleteFromCartSvg);
        let deleteFromCartSvgPath = document.createElement("path");
        deleteFromCartSvgPath.setAttribute("d", "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z");
        document.getElementById(i).appendChild(deleteFromCartSvgPath);
        deleteFromCartSvgPath = document.createElement("path");
        deleteFromCartSvgPath.setAttribute("fill-rule", "evenodd");
        deleteFromCartSvgPath.setAttribute("d", "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z");
        document.getElementById(i).appendChild(deleteFromCartSvgPath);
    }
    // Decrease product quantity listeners.
    let decrements = document.getElementsByClassName("decrement");
    Array.from(decrements).forEach(function(e) {
        e.addEventListener("click", function() {
            let cart_number = this.parentElement.parentElement;
            cart_number = cart_number.getAttribute("cart_id");
            action = "decrement";
            calculate(cart_number, action);
        })
    })
    // Increase product quantity listeners.
    let increments = document.getElementsByClassName("increment");
    Array.from(increments).forEach(function(e) {
        e.addEventListener("click", function() {
            let cart_number = this.parentElement.parentElement;
            cart_number = cart_number.getAttribute("cart_id");
            action = "increment";
            calculate(cart_number, action);
        })
    })
    // Delete product listeners.
    let buttons = document.getElementsByClassName("bi bi-trash");
    Array.from(buttons).forEach(function(item) {
        item.addEventListener("click", function() {
            delete bskt[this.id];
            if (Object.keys(bskt).length > 0) {
                localStorage.setItem('bskt', JSON.stringify(bskt));
                let element = document.getElementById("cartTableBodyRow" + this.id);
                element.remove();
                counter();
            } else {
                localStorage.removeItem("bskt");
                location.replace("/");
            }
        })
    })
    // User info fields
    document.getElementById("name").setAttribute("style", "min-width: " + userWidth + "; margin-bottom: 5px; margin-right: " + userShift);
    document.getElementById("phone").setAttribute("style", "min-width: " + userWidth - 5 + "; margin-bottom: 5px;");
    document.getElementById("address").setAttribute("style", "min-width: " + userWidth + "; margin-bottom: 5px; margin-left: " + userShift);
    document.getElementById("commentaries").setAttribute("style", "min-width: 100%;");
    for (const i in payment_options) {
        let payment_option = document.createElement("input");
        payment_option.setAttribute("class", "form-check-input");
        payment_option.setAttribute("type", "radio");
        payment_option.setAttribute("name", "payment_option");
        payment_option.setAttribute("id", payment_options[i]["payment_option_name"]);
        payment_option.setAttribute("style", "margin-right: 5px;");
        document.getElementById("payment-options").appendChild(payment_option);
        let payment_optionLabel = document.createElement("label");
        payment_optionLabel.setAttribute("class", "form-check-label fw-light");
        payment_optionLabel.setAttribute("for", payment_options[i]["payment_option_name"]);
        payment_optionLabel.innerHTML = payment_options[i]["payment_option_name"];
        payment_optionLabel.setAttribute("style", "margin-right: 10px;");
        document.getElementById("payment-options").appendChild(payment_optionLabel);
    }
    const forms = document.querySelectorAll('form');
    const form = forms[0];
    user = {};
    // Get user ip address.
    $.getJSON("https://api.ipify.org?format=json", function(result) {
        user["ip"] = result["ip"];
    });
    let status = false;
    // Handle user info fields.
    Array.from(form.elements).forEach((input) => {
        userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            let field = document.getElementById("name");
            field.setAttribute("value", userData["name"]);
            user["name"] = userData["name"];
            field = document.getElementById("address");
            field.setAttribute("value", userData["address"]);
            user["address"] = userData["address"];
            field = document.getElementById("phone");
            field.setAttribute("value", userData["phone"]);
            user["phone"] = userData["phone"];
        }
        $(input).on("keyup", function() {
            let re = new RegExp("^[0-9]{9}$");
            if (input.id === "phone") {
                let result = re.exec($(input).val());
                if (result) {
                    user[input.id] = $(input).val();
                } else {
                    user[input.id] = "";
                }
            } else {
                user[input.id] = $(input).val();
            }
            if (((user["phone"].length != "") && (user["name"] != "") && (user["address"] != "") && (user["payment_option"] != "")) && (user["phone"] && user["name"] && user["address"] && user["payment_option"])) {
                status = true;
                button = document.getElementById("submit");
                button.removeAttribute("disabled");
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                status = false;
                button = document.getElementById("submit");
                button.setAttribute("disabled", "disabled");
            }
        })
    });
    // Handle payment options.
    $("#payment-options").on("click", function() {
        let payment_options = document.getElementById("payment-options").querySelector(".form-check-input:checked");
        if (payment_options) {
            user["payment_option"] = payment_options.id;
            if (((user["phone"] != "") && (user["name"] != "") && (user["address"] != "") && (user["payment_option"] != "")) && (user["phone"] && user["name"] && user["address"] && user["payment_option"])){
                status = true;
                button = document.getElementById("submit");
                button.removeAttribute("disabled");
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                status = false;
                button = document.getElementById("submit");
                button.setAttribute("disabled", "disabled");
            }
        }
    })
    // Handle submit form
    $("#submit").on("click", function () {
        if (status === true) {
            fetch('/success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "bskt": bskt,
                    "user": user,
                }),
            })
            .then((response) => {
                if(response.redirected) {
                    localStorage.removeItem("bskt");
                    let content = document.getElementById("content");
                    while (content.firstChild) {
                        content.removeChild(content.firstChild);
                    }
                    // If success, redirect to "/".
                    document.getElementById("userData").remove();
                    let div = document.createElement("div");
                    div.setAttribute("style", "width: 100%; display: flex; flex-wrap: wrap;");
                    content.appendChild(div);
                    let info = document.createElement("h2");
                    info.setAttribute("style", "color: Tan; text-align: center;");
                    info.innerHTML = "Your order has been placed and will be delivered within 10 minutes.";
                    div.appendChild(info);
                    setTimeout(function()   {
                        window.location.href = response.url;
                    }, 3000);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else {
            location.replace("/bskt");
        }
    })
}
// Recalculate function for increment and decrement buttons.
function calculate(cart_number, action) {
    // Recalculate when "decrement" button was clicked.
    if (action === "decrement") {
        if (bskt[cart_number]["quantity"] > 1) {
            bskt[cart_number]["quantity"]--;
            localStorage.setItem('bskt', JSON.stringify(bskt));
            let cart_quantity = document.getElementById("quantity" + cart_number);
            cart_quantity = cart_quantity.children[0].children[1];
            cart_quantity.value = bskt[cart_number]["quantity"];
            let price;
            if (bskt[cart_number]["setting_name"] === "NULL") {
                price = bskt[cart_number]["product_price"];
            } else {
                price = bskt[cart_number]["setting_price"];
            }
            let modifiersPrice = 0;
            if (Object.keys(bskt[cart_number]["modifiers"]).length > 0) {
                for (j in bskt[cart_number]["modifiers"]) {
                    modifiersPrice += bskt[cart_number]["modifiers"][j];
                }
            }
            let subtotal = document.getElementById("total" + cart_number);
            subtotal.innerHTML = bskt[cart_number]["quantity"] * (price + modifiersPrice);
            counter();
        } else {
            delete bskt[cart_number];
            document.getElementById("cartTableBodyRow" + cart_number).remove();
            if (Object.keys(bskt).length > 0) {
                localStorage.setItem('bskt', JSON.stringify(bskt));
            } else {
                localStorage.removeItem("bskt");
                location.replace("/");
            }
        }
    // Recalculate when "increment" button was clicked.
    } else {
        bskt[cart_number]["quantity"]++;
        localStorage.setItem('bskt', JSON.stringify(bskt));
        let cart_quantity = document.getElementById("quantity" + cart_number);
        cart_quantity = cart_quantity.children[0].children[1];
        cart_quantity.value = bskt[cart_number]["quantity"];
        let price;
        if (bskt[cart_number]["setting_name"] === "NULL") {
            price = bskt[cart_number]["product_price"];
        } else {
            price = bskt[cart_number]["setting_price"];
        }
        let modifiersPrice = 0;
        if (Object.keys(bskt[cart_number]["modifiers"]).length > 0) {
            for (j in bskt[cart_number]["modifiers"]) {
                modifiersPrice += bskt[cart_number]["modifiers"][j];
            }
        }
        let subtotal = document.getElementById("total" + cart_number);
        subtotal.innerHTML = bskt[cart_number]["quantity"] * (price + modifiersPrice);
        counter();
    }
}
// Calculate and display total sum.
function counter() {
    let counter = document.getElementById("total");
    let total = 0;
    for (i in bskt) {
    let modifiersPrice = 0;
        if (bskt[i]["setting_name"] === "NULL") {
            price = bskt[i]["product_price"];
        } else {
            price = bskt[i]["setting_price"];
        }
        if (Object.keys(bskt[i]["modifiers"]).length > 0) {
            for (j in bskt[i]["modifiers"]) {
                modifiersPrice += bskt[i]["modifiers"][j];
            }
        }
        total += bskt[i]["quantity"] * (price + modifiersPrice);
    }
    counter.value = total;
    counter.innerHTML = "Total: " + total;
}