// Scripts to handle the main page of the Web App.
let width, id, product_id;
let product = {};
window.onload = function() {
    width = document.documentElement.clientWidth;
    if (Object.keys(prod) !== 0) {
        showNavbar();
        checkCart();
    }
}
// Check if there are items in a basket.
function checkCart() {
    let bskt = JSON.parse(localStorage.getItem("bskt"));
    let cart = document.getElementById("cart");
    let cartCounter = cart.children[1];
    if (bskt) {
        if (cart.hasAttribute("hidden")) {
            cart.removeAttribute("hidden");
            cart.setAttribute("style", "display: inline-flex; background-color: transparent; border: none; border-radius: 1.5rem; margin-top: 1.6rem; width: 50px; height: 50px;");
            cart.addEventListener("click", function() {
                location.replace("bskt");
            })
        }
        let bCount = 0;
        for (i in bskt) {
            bCount += Number(bskt[i]["quantity"]);
        }
        cartCounter.innerHTML = bCount;
    } else {
        cart.setAttribute("hidden", "true");
        cart.setAttribute("style", "display: none;");
        cartCounter.innerHTML = "0";
    }
}
// Show the top menu.
function showNavbar() {
    let navbar = document.getElementById("menu");
    let count = 0;
    let activeCategory = JSON.parse(localStorage.getItem("activeCategory"));
    for (i in prod) {
        let button = document.createElement("button");
        button.setAttribute("id", i);
        button.innerHTML = i;
        if (activeCategory) {
            if (activeCategory === i) {
                localStorage.removeItem("activeCategory");
                button.setAttribute("class", "menu-button active");
                showProducts(i);
            } else {
                button.setAttribute("class", "menu-button");
            }
            navbar.appendChild(button);
            count++;
        } else {
            if (count === 0) {
                button.setAttribute("class", "menu-button active");
                showProducts(i);
            } else {
                button.setAttribute("class", "menu-button");
            }
            navbar.appendChild(button);
            count++;
        }
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
    let activeItem = document.getElementsByClassName("menu-button active");
    Array.from(activeItem).forEach(function(e) {
        id = e.id;
    })
    showProducts(id);
}
// Handle tab switching.
function tabSwitcher() {
    let menuItems = document.getElementsByClassName("menu-button");
    Array.from(menuItems).forEach(function(item) {
        item.addEventListener("click", function() {
            let activeItem = document.getElementsByClassName("menu-button active");
            Array.from(activeItem).forEach(function(e) {
                e.setAttribute("class", "menu-button");
            })
            this.setAttribute("class", "menu-button active");
            id = this.id;
            showProducts(id);
        })
    })
}
// Display menu items.
function showProducts(id) {
    let row = document.getElementById("row");
    while (row.hasChildNodes()) {
        row.removeChild(row.firstChild);
    }
    for (name in prod[id]["items"]) {
        let productPrice;
        let image;
        let multiple = false;
        for (item in prod[id]["items"][name]) {
            if ((prod[id]["items"][name][item]["product_price"] < productPrice) || (!productPrice)) {
                productPrice = prod[id]["items"][name][item]["product_price"];
                image = prod[id]["items"][name][item]["image"];
            }
            if (prod[id]["items"][name][item]["setting_id"]) {
                multiple = true;
            }
        }
        let column = document.createElement("div");
        column.setAttribute("class", "col-xs-12 col-sm-6 col-md-4 col-lg-3");
        // Adjust to screen width.
        if (width <= 570) {
            column.setAttribute("style", "width: 80%; margin-left: auto; margin-right: auto;");
        }
        row.appendChild(column);
        let card = document.createElement("card");
        card.setAttribute("id", name);
        card.setAttribute("class", "card");
        card.setAttribute("style", "border-radius: 1.5rem; border:none;");
        column.appendChild(card);
        let img = document.createElement("img");
        img.setAttribute("src", image);
        img.setAttribute("class", "card-img-top");
        img.setAttribute("alt", name);
        card.appendChild(img);
        img.addEventListener("load", function() {
            let itm = this.getAttribute("alt");
            let invisible = document.getElementById(itm).getElementsByClassName("card-body");
            Array.from(invisible).forEach(function(e) {
                e.removeAttribute("style");
            })
        })
        let body = document.createElement("div");
        body.setAttribute("class", "card-body");
        body.setAttribute("style", "display: none;");
        card.appendChild(body);
        let title = document.createElement("h5");
        title.setAttribute("class", "card-title");
        title.innerHTML = name;
        body.appendChild(title);
        let text = document.createElement("p");
        text.setAttribute("class", "card-text");
        if (multiple === true) {
            text.innerHTML = "From " + productPrice + "₽";
        } else {
            text.innerHTML = productPrice + "₽";
        }
        body.appendChild(text);
    }
    let cards = document.getElementsByClassName("card");
    Array.from(cards).forEach(function(card) {
        card.addEventListener("click", function() {
            product_id = this.id;
            showProductInfo(id, product_id);
        })
    })
}
// Display products info.
function showProductInfo(id, product_id) {
    let card = document.getElementById(product_id);
    let height = card.offsetHeight;
    let cardImg = card.getElementsByClassName("card-img-top");
    cardImg = cardImg[0];
    let cardDiv = card.getElementsByClassName("card-body");
    cardDiv = cardDiv[0];
    cardText = cardDiv.getElementsByClassName("card-text");
    cardText = cardText[0];
    if ((!cardImg.hasAttribute("style")) && (!cardDiv.hasAttribute("style"))) {
        cardImg.setAttribute("style", "display: none;");
        cardDiv.setAttribute("style", "height: " + height + "px; border-top-left-radius: 1.5rem; border-top-right-radius: 1.5rem; display: flex; flex-wrap: wrap; align-items: stretch;");
        cardText.setAttribute("style", "display: none;");
        let cardContent = document.createElement("div");
        cardContent.setAttribute("style", "align-items: flex-start; width: 100%;");
        cardContent.setAttribute("class", "card-content");
        cardDiv.appendChild(cardContent);
        let header = cardDiv.getElementsByClassName("card-title");
        header = header[0];
        header.setAttribute("style", "text-align: center; padding-top: 10px;");
        cardContent.appendChild(header);
        let svgDiv = document.createElement("div");
        svgDiv.setAttribute("style", "width: 100%; height: max-content;")
        cardContent.insertBefore(svgDiv, header);
        let svg = document.createElement("svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "Cornsilk");
        svg.setAttribute("class", "bi bi-x-circle");
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("style", "width: 100%; color: Cornsilk;");
        svgDiv.appendChild(svg);
        let pathOne = document.createElement("path");
        pathOne.setAttribute("d", "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z");
        svg.appendChild(pathOne);
        let pathTwo = document.createElement("path");
        pathTwo.setAttribute("d", "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z");
        svg.appendChild(pathTwo);
        svg.addEventListener("click", function() {
            product_id = this.parentElement.parentElement.parentElement.parentElement.id;
            clearCard(product_id, "close");
        })
        showProductOptions(id, product_id);
    }
}
// Display products options.
function showProductOptions(id, product_id) {
    let card = document.getElementById(product_id).getElementsByClassName("card-content");
    card = card[0];
    let div = document.createElement("div");
    div.setAttribute("style", "display: flex; align-content: space-between; justify-content: space-evenly; flex-wrap: wrap;");
    card.appendChild(div);
    let price = 0;
    let lowest;
    let identifier;
    let temp = {};
    for (i in prod[id]["items"][product_id]) {
        if (prod[id]["items"][product_id][i]["setting_name"] !== "NULL") {
            if (price === 0) {
                price = prod[id]["items"][product_id][i]["product_price"];
                lowest = prod[id]["items"][product_id][i]["setting_name"]["setting_name"];
                identifier = i;
            } else if (prod[id]["items"][product_id][i]["product_price"] < price) {
                price = prod[id]["items"][product_id][i]["product_price"];
                lowest = prod[id]["items"][product_id][i]["setting_name"]["setting_name"];
                identifier = i;
            }
            let radioDiv = document.createElement("div");
            radioDiv.setAttribute("class", "form-check form-check-inline");
            radioDiv.setAttribute("style", "padding-left: 0;");
            div.appendChild(radioDiv);
            let radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("class", "settings");
            radio.setAttribute("id", product_id + prod[id]["items"][product_id][i]["setting_name"]["setting_name"]);
            radio.setAttribute("settingName", prod[id]["items"][product_id][i]["setting_name"]["setting_name"]);
            radio.setAttribute("value", i);
            radio.setAttribute("price", prod[id]["items"][product_id][i]["product_price"]);
            radio.setAttribute("name", "settings" + product_id);
            radio.setAttribute("style", "margin-right: 5px;");
            radioDiv.appendChild(radio);
            let radioLabel = document.createElement("label");
            radioLabel.setAttribute("class", "form-check-label");
            radioLabel.setAttribute("for", product_id + prod[id]["items"][product_id][i]["setting_name"]["setting_name"]);
            radioLabel.setAttribute("style", "color:white;");
            radioLabel.innerHTML = prod[id]["items"][product_id][i]["setting_name"]["setting_name"];
            radioDiv.appendChild(radioLabel);
            document.getElementById(product_id + lowest).setAttribute("checked", "true");
        } else {
            price = prod[id]["items"][product_id][i]["product_price"];
        }
        if (lowest) {
            temp["setting_name"] = lowest;
            temp["setting_price"] = price;
            temp["product_id"] = Number(identifier);
        } else {
            temp["setting_name"] = "NULL";
            temp["product_price"] = Number(price);
        }
        temp["modifiers"] = {};
        temp["product_name"] = product_id;
        temp["product_category"] = id;
        product[product_id] = temp;
    }
    if (prod[id]["items"][product_id][i]["setting_name"] === "NULL" && prod[id]["items"][product_id][i]["description"] !== "") {
        price = prod[id]["items"][product_id][i]["product_price"];
        let description = document.createElement("p");
        description.setAttribute("style", "color: white;");
        description.innerHTML = prod[id]["items"][product_id][i]["description"];
        div.appendChild(description);
    }
    if (prod[id]["items"][product_id][i]["setting_name"] !== "NULL" || prod[id]["items"][product_id][i]["description"] !== "") {
        let divider = document.createElement("hr");
        divider.setAttribute("class", "dotted");
        divider.setAttribute("style", "color: Cornsilk;");
        card.appendChild(divider);
        let settings = document.getElementsByClassName("settings");
        Array.from(settings).forEach(function(setting) {
            setting.addEventListener("click", function() {
                product_id = this.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                let price = Number(this.getAttribute("price"));
                let name = this.getAttribute("settingName");
                let setting_id = Number(this.getAttribute("value"));
                product[product_id]["setting_name"] = name;
                product[product_id]["setting_price"] = price;
                product[product_id]["product_id"] = setting_id;
                this.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("orderManagement")[0].getElementsByClassName("total")[0].setAttribute("value", price);
                this.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("orderManagement")[0].getElementsByClassName("total")[0].innerHTML = price;
                let number = this.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("orderManagement")[0].getElementsByClassName("input-group")[0].getElementsByClassName("counter")[0];
                calculate(product_id);
            })
        })
    }
    div = document.createElement("div");
    div.setAttribute("style", "display: flex; align-content: space-between; justify-content: space-evenly; flex-wrap: wrap; margin-bottom: 3px;");
    div.setAttribute("class", "modifiers");
    card.appendChild(div);
    for (category in prod[id]["items"][product_id][i]["modifiers"]) {
        let count = 0;
        let type;
        for (modifier in prod[id]["items"][product_id][i]["modifiers"][category]) {
            if (count === 0) {
                if (prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_category_type_name"] === "Multichoice" || prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_category_type_name"] === "Dropdown") {
                    let modifierSelect = document.createElement("select");
                    if (prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_category_type_name"] === "Multichoice") {
                        modifierSelect.setAttribute("class", "selectpicker");
                        modifierSelect.setAttribute("data-style", "btn-warning");
                        modifierSelect.setAttribute("multiple", true);
                        type = "multichoice";
                    } else {
                        modifierSelect.setAttribute("class", "form-select");
                        type = "dropdown";
                    }
                    modifierSelect.setAttribute("id", category + product_id);
                    modifierSelect.setAttribute("name", category);
                    let modifierSelectDiv = document.createElement("div");
                    modifierSelectDiv.setAttribute("style", "width: 100%");
                    modifierSelectDiv.setAttribute("class", "modifiers");
                    modifierSelectDiv.setAttribute("type", type);
                    card.appendChild(modifierSelectDiv);
                    modifierSelectDiv.appendChild(modifierSelect);
                }
                count++;
            }
            if (prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_category_type_name"] === "Multichoice" || prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_category_type_name"] === "Dropdown") {
                let modifierOption = document.createElement("option");
                modifierOption.setAttribute("id", prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_id"]);
                modifierOption.setAttribute("price", prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_price"]);
                document.getElementById(category + product_id).appendChild(modifierOption);
                modifierOption.innerHTML = prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_name"];
            } else if (prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_category_type_name"] === "Checkbox") {
                type = "checkbox";
                div.setAttribute("type", type);
                let checkboxDiv = document.createElement("div");
                checkboxDiv.setAttribute("class", "form-check form-check-inline");
                div.appendChild(checkboxDiv);
                let checkboxInput = document.createElement("input");
                checkboxInput.setAttribute("class", "form-check-input");
                checkboxInput.setAttribute("type", "checkbox");
                checkboxInput.setAttribute("value", prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_id"]);
                checkboxInput.setAttribute("name", prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_name"]);
                checkboxInput.setAttribute("price", prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_price"]);
                checkboxInput.setAttribute("id", product_id + prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_id"]);
                checkboxDiv.appendChild(checkboxInput);
                checkboxInput.addEventListener("change", function() {
                    product_id = this.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                    updateModifiers(id);
                })
                let checkboxLabel = document.createElement("label");
                checkboxLabel.setAttribute("class", "form-check-label");
                checkboxLabel.setAttribute("for", product_id + prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_id"]);
                checkboxLabel.setAttribute("style", "color:white;");
                checkboxLabel.innerHTML = prod[id]["items"][product_id][i]["modifiers"][category][modifier]["modifier_name"];
                checkboxDiv.appendChild(checkboxLabel);
            }
        }
    }
    $('.selectpicker').selectpicker('setStyle', 'btn btn-primary btn-sm');
    $(".selectpicker").on("changed.bs.select", function() {
        product_id = this.parentElement.parentElement.parentElement.parentElement.id;
        updateModifiers(id);
    })
    // Display product counter.
    let quantityDiv = document.createElement("div");
    quantityDiv.setAttribute("style", "width: 100%; display: flex; align-self: flex-end; justify-content: space-between; margin-top: 10px;");
    quantityDiv.setAttribute("class", "orderManagement");
    card = document.getElementById(product_id).getElementsByClassName("card-body");
    card = card[0];
    card.appendChild(quantityDiv);
    let priceDisplay  = document.createElement("h2");
    priceDisplay.setAttribute("value", price);
    priceDisplay.setAttribute("style", "color: Cornsilk; margin-bottom: 0; margin-right: 10px; min-width: 41px; text-align: right;");
    priceDisplay.setAttribute("class", "total");
    priceDisplay.innerHTML = price;
    quantityDiv.appendChild(priceDisplay);
    let counterDiv = document.createElement("div");
    counterDiv.setAttribute("class", "input-group");
    counterDiv.setAttribute("style", "max-width: 40%; margin-right: 10px; display: inline-flex; justify-content: center; align-items: center;");
    quantityDiv.appendChild(counterDiv);
    let decrement = document.createElement("div");
    counterDiv.appendChild(decrement);
    let decrementButton = document.createElement("svg");
    decrementButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    decrementButton.setAttribute("width", "16");
    decrementButton.setAttribute("height", "16");
    decrementButton.setAttribute("fill", "currentColor");
    decrementButton.setAttribute("class", "bi bi-dash-lg");
    decrementButton.setAttribute("viewBox", "0 0 16 16");
    decrementButton.setAttribute("style", "height: 100%; color: Tan;");
    decrement.appendChild(decrementButton);
    let decrementButtonPath = document.createElement("path");
    decrementButtonPath.setAttribute("fill-rule", "evenodd");
    decrementButtonPath.setAttribute("d", "M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z");
    decrementButton.appendChild(decrementButtonPath);
    let display = document.createElement("input");
    display.setAttribute("type", "text");
    display.setAttribute("class", "counter");
    display.setAttribute("value", "1");
    display.setAttribute("readonly", "true");
    display.setAttribute("style", "color: Tan;");
    counterDiv.appendChild(display);
    product[product_id]["quantity"] = 1;
    let increment = document.createElement("div");
    counterDiv.appendChild(increment);
    let incrementButton = document.createElement("svg");
    incrementButton.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    incrementButton.setAttribute("width", "16");
    incrementButton.setAttribute("height", "16");
    incrementButton.setAttribute("fill", "currentColor");
    incrementButton.setAttribute("class", "bi bi-plus-lg");
    incrementButton.setAttribute("viewBox", "0 0 16 16");
    incrementButton.setAttribute("style", "height: 100%; color: Tan;");
    increment.appendChild(incrementButton);
    let incrementButtonPath = document.createElement("path");
    incrementButtonPath.setAttribute("fill-rule", "evenodd");
    incrementButtonPath.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
    incrementButton.appendChild(incrementButtonPath);
    let addToCart = document.createElement("button");
    addToCart.setAttribute("class", "addtocart");
    addToCart.setAttribute("style", "display: inline-flex; border-color: transparent; border-radius: 1.5rem; background-color: Cornsilk;");
    addToCart.setAttribute("for", product_id);
    quantityDiv.appendChild(addToCart);
    // Listener to add product to a basket.
    addToCart.addEventListener("click", function(event) {
        event.stopPropagation();
        product_id = this.getAttribute("for");
        clearCard(product_id, "checkout");
        cartHandler(product_id);
    });
    let cartIcon = document.createElement("svg");
    cartIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    cartIcon.setAttribute("width", "16");
    cartIcon.setAttribute("height", "16");
    cartIcon.setAttribute("fill", "currentColor");
    cartIcon.setAttribute("class", "bi bi-cart-plus");
    cartIcon.setAttribute("viewBox", "0 0 16 16");
    cartIcon.setAttribute("style", "height: 100%; color: Tan;");
    addToCart.appendChild(cartIcon);
    let cartIconPath = document.createElement("path");
    cartIconPath.setAttribute("d", "M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z");
    cartIcon.appendChild(cartIconPath);
    cartIconPath = document.createElement("path");
    cartIconPath.setAttribute("d", "M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z");
    cartIcon.appendChild(cartIconPath);
    // Decrease product quantity.
    decrement.addEventListener("click", function() {
        product_id = this.parentElement.parentElement.parentElement.parentElement.id;
        let number = this.parentElement.getElementsByClassName("counter")[0];
        let action = "substract";
        counter(number, action);
    })
    // Increase product quantity.
    increment.addEventListener("click", function() {
        product_id = this.parentElement.parentElement.parentElement.parentElement.id;
        let number = this.parentElement.getElementsByClassName("counter")[0];
        let action = "add";
        counter(number, action);
    })
    calculate(product_id);
}
// Function to add modifiers to a product.
function updateModifiers(id) {
    let temp = {};
    product[product_id]["modifiers"] = temp;
    let all = document.getElementById(product_id).getElementsByClassName("card-body")[0].getElementsByClassName("modifiers");
    Array.from(all).forEach(function(e) {
        if (e.getAttribute("type") === "multichoice") {
            let mods = $(e.firstChild.firstChild).val();
            for (i in mods) {
                for (j in prod[id]["items"][product_id]) {
                    for (k in prod[id]["items"][product_id][j]["modifiers"]) {
                        for (l in prod[id]["items"][product_id][j]["modifiers"][k]) {
                            if (mods[i] === prod[id]["items"][product_id][j]["modifiers"][k][l]["modifier_name"]) {
                                temp[mods[i]] = prod[id]["items"][product_id][j]["modifiers"][k][l]["modifier_price"];
                            }
                        }
                    }
                }
            }
        } else if (e.getAttribute("type") === "checkbox") {
            let mods = e.children;
            Array.from(mods).forEach(function(d) {
                if (d.firstChild.checked) {
                    for (j in prod[id]["items"][product_id]) {
                        for (k in prod[id]["items"][product_id][j]["modifiers"]) {
                            for (l in prod[id]["items"][product_id][j]["modifiers"][k]) {
                                if (d.firstChild.getAttribute("name") === prod[id]["items"][product_id][j]["modifiers"][k][l]["modifier_name"]) {
                                    temp[d.firstChild.getAttribute("name")] = prod[id]["items"][product_id][j]["modifiers"][k][l]["modifier_price"];
                                }
                            }
                        }
                    }
                }
            })
        }
    })
    calculate(product_id);
}
// Function to calculate price on quantity changes.
function counter(counter, action) {
    if (action === "substract") {
        if (counter.value > 1) {
            counter.value--;
        }
    } else if (action === "add") {
        counter.value++;
    }
    product[product_id]["quantity"] = counter.value;
    calculate(product_id);
}
// Function to calculate total price.
function calculate(product_id) {
    let sum = 0;
    let modifiers = 0;
    if (product[product_id]["setting_name"] === "NULL") {
        sum = product[product_id]["product_price"];
    } else {
        sum = product[product_id]["setting_price"];
    }
    sum *= product[product_id]["quantity"];
    if (product[product_id]["modifiers"] !== undefined) {
        for (i in product[product_id]["modifiers"]) {
            modifiers += product[product_id]["modifiers"][i];
        }
    }
    modifiers *= product[product_id]["quantity"];
    sum += modifiers;
    let counter = document.getElementById(product_id).getElementsByClassName("card-body")[0].getElementsByClassName("orderManagement")[0].firstChild;
    counter.setAttribute("value", sum);
    counter.innerHTML = sum;
}
// Clear card on closing, adding to cart.
function clearCard(product_id, type) {
    let cardBody = document.getElementById(product_id).getElementsByClassName("card-body")[0];
    let height = cardBody.offsetHeight;
    if (cardBody.hasChildNodes()) {
        let children = cardBody.children;
        Array.from(children).forEach(function(child) {
            if (child.getAttribute("class") === "card-text") {
                child.removeAttribute("style");
            } else if (child.getAttribute("class") === "card-content") {
                let title = child.getElementsByClassName("card-title")[0];
                title.removeAttribute("style");
                cardBody.prepend(title);
                child.remove();
            } else {
                child.remove();
            }
        });
        cardBody.setAttribute("style", "display:none;");
        let card = cardBody.parentElement;
        let success = document.createElement("div");
        success.setAttribute("style", "background-color: Tan; border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; width: 100%; height: " + height + "px;");
        success.setAttribute("id", "success");
        card.appendChild(success);
        let check = document.createElement("div");
        check.setAttribute("style", "font-size: 10em;");
        success.appendChild(check);
        let checkSvg = document.createElement("svg");
        checkSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        checkSvg.setAttribute("width", "1em");
        checkSvg.setAttribute("height", "1em");
        checkSvg.setAttribute("fill", "currentColor");
        checkSvg.setAttribute("class", "bi bi-check-circle");
        checkSvg.setAttribute("viewBox", "0 0 16 16");
        checkSvg.setAttribute("style", "color: Cornsilk;");
        check.appendChild(checkSvg);
        let checkSvgPath = document.createElement("path");
        checkSvgPath.setAttribute("d", "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z");
        checkSvg.appendChild(checkSvgPath);
        checkSvgPath = document.createElement("path");
        checkSvgPath.setAttribute("d", "M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z");
        checkSvg.appendChild(checkSvgPath);
        if (type === "checkout") {
            setTimeout(function()   {
                document.getElementById("success").remove();
                cardBody.parentElement.parentElement.getElementsByClassName("card-img-top")[0].removeAttribute("style");
                cardBody.removeAttribute("style");
            }, 3000);
        } else {
            setTimeout(function()   {
                document.getElementById("success").remove();
                cardBody.parentElement.parentElement.getElementsByClassName("card-img-top")[0].removeAttribute("style");
                cardBody.removeAttribute("style");
            }, 1);
        }
    }
}
// Handle adding to a basket.
function cartHandler(product_id) {
    let bskt = {};
    let maxKey = 0;
    if (localStorage.getItem('bskt')) {
        bskt = JSON.parse(localStorage.getItem('bskt'));
        let fullMatch = false;
        for (i in bskt) {
            if ((bskt[i]["product_category"] === product[product_id]["product_category"]) && (bskt[i]["product_name"] === product[product_id]["product_name"]) && (bskt[i]["setting_name"] === product[product_id]["setting_name"]) && (bskt[i]["setting_price"] === product[product_id]["setting_price"]) && (bskt[i]["product_id"] === product[product_id]["product_id"])) {
                if (Object.keys(bskt[i]["modifiers"]).length === Object.keys(product[product_id]["modifiers"]).length) {
                    if (Object.keys(bskt[i]["modifiers"]).length === 0) {
                        bskt[i]["quantity"] = Number(bskt[i]["quantity"]) + Number(product[product_id]["quantity"]);
                        fullMatch = true;
                        break;
                    } else {
                        let count = 0;
                        for (j in product[product_id]["modifiers"]) {
                            for (k in bskt[i]["modifiers"]) {
                                if (j === k) {
                                    count++;
                                    break;
                                }
                            }
                        }
                        if (count === Object.keys(product[product_id]["modifiers"]).length) {
                            bskt[i]["quantity"] = Number(bskt[i]["quantity"]) + Number(product[product_id]["quantity"]);
                            fullMatch = true;
                            break;
                        }
                    }
                }
            }
        }
        if (fullMatch === false) {
            let keys = Object.keys(bskt);
            for (i = 0; i < keys.length; i++) {
                if (Number(keys[i]) >= Number(maxKey)) {
                    maxKey = keys[i];
                }
            }
            maxKey++;
            bskt[maxKey] = product[product_id];
        }
    } else {
        bskt[maxKey] = product[product_id];
    }
    localStorage.setItem('bskt', JSON.stringify(bskt));
    checkCart();
}