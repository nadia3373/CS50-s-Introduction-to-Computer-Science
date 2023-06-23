from flask import Flask, redirect, render_template, jsonify, request, session, g, url_for, flash
from flask_session import Session
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash
from cs50 import SQL
import re, telegram_messages, urllib.request, json

app = Flask(__name__)
db = SQL("sqlite:///coffice.db")
UPLOAD_FOLDER = "static/uploads/"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = ""
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# Main page of the Web App.
@app.route("/")
def index():
    settings = db.execute("SELECT * FROM settings")
    modifier_categories = db.execute("SELECT * FROM modifier_categories")
    categories = db.execute("SELECT DISTINCT product_category_name FROM product_categories")
    prod = {}
    for i in range(len(categories)):
        itms = db.execute("SELECT product_subcategory_name FROM product_subcategories WHERE product_category_id = (SELECT DISTINCT product_category_id FROM product_categories WHERE product_category_name = ?)", categories[i]["product_category_name"])
        items = {}
        for k in range(len(itms)):
            ids = db.execute("SELECT * FROM products WHERE product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?)", itms[k]["product_subcategory_name"])
            status = db.execute("SELECT product_subcategory_status FROM product_subcategories WHERE product_subcategory_name = ?", itms[k]["product_subcategory_name"])
            print(status)
            image = db.execute("SELECT product_image FROM product_subcategories WHERE product_subcategory_name = ?", itms[k]["product_subcategory_name"])
            description = db.execute("SELECT product_subcategory_description FROM product_subcategories WHERE product_subcategory_name = ?", itms[k]["product_subcategory_name"])
            id = {}
            for l in range(len(ids)):
                if status[0]["product_subcategory_status"] == "false":
                    break
                if ids[l]["setting_id"]:
                    setting = db.execute("SELECT setting_name FROM settings WHERE setting_id = ?", ids[l]["setting_id"])
                    ids[l]["setting_name"] = setting[0]
                else:
                    ids[l]["setting_name"] = "NULL"
                ids[l]["status"] = status[0]["product_subcategory_status"]
                ids[l]["image"] = image[0]["product_image"]
                ids[l]["description"] = description[0]["product_subcategory_description"]
                mods_categories = db.execute("SELECT modifier_category_name FROM modifier_categories WHERE modifier_category_id IN (SELECT modifier_category_id FROM modifiers WHERE product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?))", itms[k]["product_subcategory_name"])
                modifier_categories = {}
                for n in range(len(mods_categories)):
                    mods = db.execute("SELECT modifiers.modifier_id, modifiers.modifier_name, modifiers.modifier_price, modifiers.modifier_category_id, modifier_category_types.modifier_category_type_id, modifier_category_types.modifier_category_type_name, modifier_categories.modifier_category_name FROM modifiers JOIN modifier_category_types, modifier_categories ON modifier_category_types.modifier_category_type_id = modifier_categories.modifier_category_type_id AND modifiers.modifier_category_id = modifier_categories.modifier_category_id WHERE modifiers.product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?) AND modifiers.modifier_category_id = (SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?) AND modifier_category_types.modifier_category_type_id = (SELECT modifier_category_type_id FROM modifier_categories WHERE modifier_category_name = ?)", itms[k]["product_subcategory_name"], mods_categories[n]["modifier_category_name"], mods_categories[n]["modifier_category_name"])
                    mod = {}
                    for o in range(len(mods)):
                        mod[mods[o]["modifier_name"]] = mods[o]
                    modifier_categories[mods_categories[n]["modifier_category_name"]] = mod
                    ids[l]["modifiers"] = modifier_categories
                id[ids[l]["product_id"]] = ids[l]
                items[itms[k]["product_subcategory_name"]] = id
                elements = {}
                elements["items"] = items
                prod[categories[i]["product_category_name"]] = elements
                modifier_categories = db.execute("SELECT * FROM modifier_categories")
    return render_template("index.html", prod = prod)

# Add a product, setting or modifier.
@app.route("/addelement", methods=["POST"])
@login_required
def addelement():
    add = request.get_json()
    print(add)
    if add["table"] == "settings":
        category_id = db.execute("SELECT setting_category_id FROM setting_categories WHERE setting_category_name = ?", add["category"])
        category_id = category_id[0]["setting_category_id"]
        id = db.execute("SELECT MAX (setting_id) FROM settings")
        if id[0]["MAX (setting_id)"] == None:
            id = 0
        else:
            id = id[0]["MAX (setting_id)"] + 1
        db.execute("INSERT INTO settings (setting_id, setting_category_id, setting_name) VALUES (?, ?, ?)", id, category_id, add["items"])
    elif add["table"] == "products":
        category_id = db.execute("SELECT product_category_id FROM product_categories WHERE product_category_name = ?", add["category"])
        category_id = category_id[0]["product_category_id"]
        if not db.execute("SELECT * FROM product_subcategories WHERE product_subcategory_name = ?", add["items"]):
            id = db.execute("SELECT MAX (product_subcategory_id) FROM product_subcategories")
            if id[0]["MAX (product_subcategory_id)"] == None:
                id = 0
            else:
                id = id[0]["MAX (product_subcategory_id)"] + 1
            db.execute("INSERT INTO product_subcategories (product_subcategory_id, product_category_id, product_subcategory_name, product_image, product_subcategory_status) VALUES (?, ?, ?, ?, ?)", id, category_id, add["items"], "/static/uploads/placeholder.png", "false")
        if type(add["price"]) == dict:
            print("true")
            for i in add["price"]:
                product_id = db.execute("SELECT MAX (product_id) FROM products")
                if product_id[0]["MAX (product_id)"] == None:
                    product_id = 0
                else:
                    product_id = product_id[0]["MAX (product_id)"] + 1
                setting_id = db.execute("SELECT setting_id FROM settings WHERE setting_name = ?", i)
                setting_id = setting_id[0]["setting_id"]
                db.execute("INSERT INTO products (product_id, product_subcategory_id, product_name, product_price, setting_id) VALUES (?, ?, ?, ?, ?)", product_id, id, add["items"], add["price"][i], setting_id)
        else:
            print("false")
            product_id = db.execute("SELECT MAX (product_id) FROM products")
            if product_id[0]["MAX (product_id)"] == None:
                product_id = 0
            else:
                product_id = product_id[0]["MAX (product_id)"] + 1
            db.execute("INSERT INTO products (product_id, product_subcategory_id, product_name, product_price) VALUES (?, ?, ?, ?)", product_id, id, add["items"], add["price"])
    elif add["table"] == "modifiers":
        category_id = db.execute("SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?", add["category"])
        category_id = category_id[0]["modifier_category_id"]
        for i in range(len(add["products"])):
            id = db.execute("SELECT MAX (modifier_id) FROM modifiers")
            if id[0]["MAX (modifier_id)"] == None:
                id = 0
            else:
                id = id[0]["MAX (modifier_id)"] + 1
            product_subcategory_id = db.execute("SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?", add["products"][i])
            product_subcategory_id = product_subcategory_id[0]["product_subcategory_id"]
            db.execute("INSERT INTO modifiers (modifier_id, modifier_category_id, modifier_name, product_subcategory_id, modifier_price) VALUES (?, ?, ?, ?, ?)", id, category_id, add["items"], product_subcategory_id, add["price"])
    return redirect("/editsubcats")

# Basket page.
@app.route("/bskt")
def bskt():
    payment_options = db.execute("SELECT * FROM payment_options")
    categories = db.execute("SELECT DISTINCT product_category_name FROM product_categories")
    prod = {}
    for i in range(len(categories)):
        items = db.execute("SELECT product_subcategory_name, product_subcategory_status FROM product_subcategories WHERE product_category_id = (SELECT DISTINCT product_category_id FROM product_categories WHERE product_category_name = ?)", categories[i]["product_category_name"])
        for j in items:
            if j["product_subcategory_status"]  == "true":
                print(j)
                prod[categories[i]["product_category_name"]] = j["product_subcategory_name"]
    return render_template("bskt.html", payment_options = payment_options, prod = prod)

# Submit the order.
@app.route('/success', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        message = "New order%0A"
        total = 0
        data = request.get_json()
        purchase_id = db.execute("SELECT MAX (purchase_id) FROM purchases")
        if purchase_id[0]["MAX (purchase_id)"] == None:
            purchase_id = 0
        else:
            purchase_id = purchase_id[0]["MAX (purchase_id)"] + 1
        print(data)
        if data:
            count = 1
            for i in data["bskt"]:
                print(len(data["bskt"]))
                if data["bskt"][i]["setting_name"] == "NULL":
                    print("no setting")
                    product = db.execute("SELECT * FROM products WHERE product_name = ? AND product_price = ?", data["bskt"][i]["product_name"], data["bskt"][i]["product_price"])
                    print(product)
                    data["bskt"][i]["product_id"] = product[0]["product_id"]
                    data["bskt"][i]["setting_id"] = "NULL"
                    price = data["bskt"][i]["product_price"]
                else:
                    print("setting")
                    product = db.execute("SELECT * FROM products WHERE product_id = ?", data["bskt"][i]["product_id"])
                    setting_id = db.execute("SELECT setting_id FROM products WHERE product_id = ?", data["bskt"][i]["product_id"])
                    setting_id = setting_id[0]["setting_id"]
                    data["bskt"][i]["setting_id"] = setting_id
                    price = data["bskt"][i]["setting_price"]
                product_price = 0
                print(product)
                print(data["bskt"][i])
                if (product[0]["product_price"] != price):
                    price = product[0]["product_price"]
                product_price += price
                modifier_price = 0
                subcategory_id = 0
                for k in data["bskt"][i]["modifiers"]:
                    subcategory_id = db.execute("SELECT DISTINCT product_subcategory_id FROM products WHERE product_name = ?", data["bskt"][i]["product_name"])
                    subcategory_id = subcategory_id[0]["product_subcategory_id"]
                    modifier = db.execute("SELECT * FROM modifiers WHERE modifier_name = ? AND product_subcategory_id = ?", k, subcategory_id)
                    if (modifier[0]["modifier_price"] != data["bskt"][i]["modifiers"][k]):
                        data["bskt"][i]["modifiers"][k] = modifier[0]["modifier_price"]
                    modifier_price += data["bskt"][i]["modifiers"][k]
                product_price *= data["bskt"][i]["quantity"]
                modifier_price *= data["bskt"][i]["quantity"]
                product_price += modifier_price
                message += "*%0AProduct " + str(count) + ": " + data["bskt"][i]["product_name"] + " "
                count += 1
                if data["bskt"][i]["setting_name"] != "NULL":
                    message += "(" + str(data["bskt"][i]["setting_name"]) + ")"
                message += "*%0AQuantity: " + str(data["bskt"][i]["quantity"]) + "%0APrice: " + str(price)
                if data["bskt"][i]["modifiers"]:
                    message += "%0AModifiers: "
                    l = 0
                    for modifier in data["bskt"][i]["modifiers"]:
                        message += modifier
                        if l < len(data["bskt"][i]["modifiers"]) - 1:
                            message += ", "
                            l += 1
                message += "%0A"
                total += product_price
                if data["user"]["phone"] and data["user"]["name"] and data["user"]["address"] and data["user"]["payment_option"]:
                    if (data["user"]["phone"] != "") and (data["user"]["name"] != "") and (data["user"]["address"] != "") and (data["user"]["payment_option"] != ""):
                        x = re.search("^[0-9]{9}$", data["user"]["phone"])
                        if x:
                            with urllib.request.urlopen("http://worldtimeapi.org/api/ip/" + data["user"]["ip"]) as url:
                                string = json.loads(url.read().decode())
                                string = string["datetime"]
                                time = ""
                                for m in string:
                                    if m != ".":
                                        if m != "T":
                                            time = time + m
                                        else:
                                            time = time + " "
                                    else:
                                        break
                            db.execute("INSERT INTO purchases (purchase_id, purchase_date, customer_number, customer_name, customer_address, customer_ip, payment_option, product_id, product_name, product_price, product_quantity, setting_id, setting_name, modifiers, modifiers_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                                               purchase_id, time, int(data["user"]["phone"]), data["user"]["name"], data["user"]["address"], data["user"]["ip"], data["user"]["payment_option"], data["bskt"][i]["product_id"], data["bskt"][i]["product_name"], price, data["bskt"][i]["quantity"], data["bskt"][i]["setting_id"], data["bskt"][i]["setting_name"], str(data["bskt"][i]["modifiers"]), modifier_price)
            message += "%0A*Total: " + str(total) + "*%0A"
            message += "%0APayment option: " + data["user"]["payment_option"] + "%0APhone: 79" + data["user"]["phone"] + "%0AName: " + data["user"]["name"] + "%0AAddress: " + data["user"]["address"]
            telegram_messages.send_message(message)
            return redirect("/success")
    return redirect("/")

# Edit categories. Main page of the Admin Panel.
@app.route("/edit", methods=["GET", "POST"])
@login_required
def edit():
    data = {}
    product_categories = {}
    setting_categories = {}
    modifier_categories = {}
    modifier_category_types = {}
    temp = {}
    temp = db.execute("SELECT DISTINCT product_category_name FROM product_categories")
    for i in range (len(temp)):
        product_categories[temp[i]["product_category_name"]] = db.execute("SELECT * FROM product_categories WHERE product_category_name = ?", temp[i]["product_category_name"])
    temp = db.execute("SELECT DISTINCT setting_category_name FROM setting_categories")
    for i in range (len(temp)):
        setting_categories[temp[i]["setting_category_name"]] = db.execute("SELECT * FROM setting_categories WHERE setting_category_name = ?", temp[i]["setting_category_name"])
    temp = db.execute("SELECT DISTINCT modifier_category_name FROM modifier_categories")
    for i in range (len(temp)):
        modifier_categories[temp[i]["modifier_category_name"]] = db.execute("SELECT * FROM modifier_categories WHERE modifier_category_name = ?", temp[i]["modifier_category_name"])
    data["product_categories"] = product_categories
    data["setting_categories"] = setting_categories
    data["modifier_categories"] = modifier_categories
    temp = db.execute("SELECT * FROM modifier_category_types")
    for i in range(len(temp)):
        modifier_category_types[temp[i]["modifier_category_type_name"]] = temp[i]["modifier_category_type_id"]
    print(data)
    return render_template("edit.html", data = data, modifier_category_types = modifier_category_types)

# Edit subcategories.
@app.route("/editsubcats", methods=["POST", "GET"])
@login_required
def editsubcats():
    data = {}
    modifiers_dict = {}
    product_categories = db.execute("SELECT DISTINCT product_category_name FROM product_categories")
    for i in range (len(product_categories)):
        id = db.execute("SELECT product_category_id FROM product_categories WHERE product_category_name = ?", product_categories[i]["product_category_name"])
        product_subcategories = db.execute("SELECT DISTINCT product_subcategory_name FROM product_subcategories WHERE product_category_id = ?", id[0]["product_category_id"])
        names = []
        for j in range(len(product_subcategories)):
            names.append(product_subcategories[j]["product_subcategory_name"])
        data[product_categories[i]["product_category_name"]] = names
    setting_categories = db.execute("SELECT DISTINCT setting_category_name FROM setting_categories")
    for i in range(len(setting_categories)):
        id = db.execute("SELECT setting_category_id FROM setting_categories WHERE setting_category_name = ?", setting_categories[i]["setting_category_name"])
        settings = db.execute("SELECT DISTINCT setting_name FROM settings WHERE setting_category_id = ?", id[0]["setting_category_id"])
        names = []
        for j in range(len(settings)):
            names.append(settings[j]["setting_name"])
        data[setting_categories[i]["setting_category_name"]] = names
    modifier_categories = db.execute("SELECT DISTINCT modifier_category_name FROM modifier_categories")
    for i in range(len(modifier_categories)):
        id = db.execute("SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?", modifier_categories[i]["modifier_category_name"])
        modifiers = db.execute("SELECT DISTINCT modifier_name FROM modifiers WHERE modifier_category_id = ?", id[0]["modifier_category_id"])
        names = []
        temp = {}
        for j in range(len(modifiers)):
            names.append(modifiers[j]["modifier_name"])
            price = db.execute("SELECT modifier_price FROM modifiers WHERE modifier_name = ?", modifiers[j]["modifier_name"])
            price = price[0]["modifier_price"]
            temp[modifiers[j]["modifier_name"]] = price
        modifiers_dict[modifier_categories[i]["modifier_category_name"]] = temp
        data[modifier_categories[i]["modifier_category_name"]] = names
    print(data)
    product_subcategories = db.execute("SELECT * FROM product_subcategories")
    settings = {}
    setting_categories = db.execute("SELECT setting_category_name FROM setting_categories")
    for i in range(len(setting_categories)):
        id = db.execute("SELECT setting_category_id FROM setting_categories WHERE setting_category_name = ?", setting_categories[i]["setting_category_name"])
        id = id[0]["setting_category_id"]
        tmp = db.execute("SELECT setting_name FROM settings WHERE setting_category_id = ?", id)
        sets = []
        for j in range(len(tmp)):
            sets.append(tmp[j])
        settings[setting_categories[i]["setting_category_name"]] = sets
    return render_template("editsubcats.html", data = data, product_subcategories = product_subcategories, settings = settings, modifiers_dict = modifiers_dict)

# Login page for the administrator.
@app.route("/admin-login", methods=["GET", "POST"])
def login():
    session.clear()
    if request.method == "GET":
        return render_template("/admin-login.html")
    else:
        if not request.form.get("password"):
            flash("You must provide password")
            return render_template("/admin-login.html")
        else:
            admin = db.execute("SELECT * FROM users WHERE user_name = ?", "admin")
            print(admin)
            if admin[0]["hash"] == "not set":
                hash = generate_password_hash(request.form.get("password"))
                db.execute("UPDATE users SET hash = ? WHERE user_name = ?", hash, "admin")
                admin = db.execute("SELECT * FROM users WHERE user_name = ?", "admin")
            if len(admin) == 1 and check_password_hash(admin[0]["hash"], request.form.get("password")):
                session["user_id"] = admin[0]["user_id"]
                return redirect("/edit")
            else:
                flash("Password is incorrect")
                return render_template("/admin-login.html")

# Edit product, setting or modifier.
@app.route("/editproduct", methods=["GET"])
@login_required
def editproduct():
    settings = db.execute("SELECT * FROM settings")
    modifier_categories = db.execute("SELECT * FROM modifier_categories")
    categories = db.execute("SELECT DISTINCT product_category_name FROM product_categories")
    prod = {}
    for i in range(len(categories)):
        itms = db.execute("SELECT product_subcategory_name FROM product_subcategories WHERE product_category_id = (SELECT DISTINCT product_category_id FROM product_categories WHERE product_category_name = ?)", categories[i]["product_category_name"])
        items = {}
        for k in range(len(itms)):
            ids = db.execute("SELECT * FROM products WHERE product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?)", itms[k]["product_subcategory_name"])
            status = db.execute("SELECT product_subcategory_status FROM product_subcategories WHERE product_subcategory_name = ?", itms[k]["product_subcategory_name"])
            image = db.execute("SELECT product_image FROM product_subcategories WHERE product_subcategory_name = ?", itms[k]["product_subcategory_name"])
            id = {}
            for l in range(len(ids)):
                if ids[l]["setting_id"]:
                    setting = db.execute("SELECT setting_name FROM settings WHERE setting_id = ?", ids[l]["setting_id"])
                    ids[l]["setting_name"] = setting[0]
                else:
                    ids[l]["setting_name"] = "NULL"
                ids[l]["status"] = status[0]["product_subcategory_status"]
                ids[l]["image"] = image[0]["product_image"]
                mods_categories = db.execute("SELECT modifier_category_name FROM modifier_categories WHERE modifier_category_id IN (SELECT modifier_category_id FROM modifiers WHERE product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?))", itms[k]["product_subcategory_name"])
                modifier_categories = {}
                for n in range(len(mods_categories)):
                    mods = db.execute("SELECT modifiers.modifier_id, modifiers.modifier_name, modifiers.modifier_price, modifiers.modifier_category_id, modifier_category_types.modifier_category_type_id, modifier_category_types.modifier_category_type_name, modifier_categories.modifier_category_name FROM modifiers JOIN modifier_category_types, modifier_categories ON modifier_category_types.modifier_category_type_id = modifier_categories.modifier_category_type_id AND modifiers.modifier_category_id = modifier_categories.modifier_category_id WHERE modifiers.product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?) AND modifiers.modifier_category_id = (SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?) AND modifier_category_types.modifier_category_type_id = (SELECT modifier_category_type_id FROM modifier_categories WHERE modifier_category_name = ?)", itms[k]["product_subcategory_name"], mods_categories[n]["modifier_category_name"], mods_categories[n]["modifier_category_name"])
                    mod = {}
                    for o in range(len(mods)):
                        mod[mods[o]["modifier_name"]] = mods[o]
                    modifier_categories[mods_categories[n]["modifier_category_name"]] = mod
                    ids[l]["modifiers"] = modifier_categories
                id[ids[l]["product_id"]] = ids[l]
                items[itms[k]["product_subcategory_name"]] = id
                elements = {}
                elements["items"] = items
                prod[categories[i]["product_category_name"]] = elements
                modifier_categories = db.execute("SELECT * FROM modifier_categories")
    return render_template("editproduct.html", prod = prod, settings = settings, modifier_categories = modifier_categories)

# Update a modifier.
@app.route("/update_modifier", methods=["POST"])
@login_required
def update_modifier():
    data = request.get_json()
    print(data)
    for i in data:
        modifier_category_id = db.execute("SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?", data[i]["category"])
        modifier_category_id = modifier_category_id[0]["modifier_category_id"]
        db.execute("UPDATE modifiers SET modifier_name = ?, modifier_price = ? WHERE modifier_name = ? AND modifier_category_id = ?", data[i]["name"], data[i]["price"], i, modifier_category_id)
    return "ok"

# Update a setting.
@app.route("/update_setting", methods=["POST"])
@login_required
def update_setting():
    data = request.get_json()
    print(data)
    setting_category = db.execute("SELECT setting_category_id FROM setting_categories WHERE setting_category_name = ?", data["category"])
    db.execute("UPDATE settings SET setting_name = ? WHERE setting_name = ? and setting_category_id = ?", data["new_name"], data["old_name"], setting_category[0]["setting_category_id"])
    return "ok"

# Update a category.
@app.route("/update_options", methods=["POST"])
@login_required
def update_options():
    data = request.get_json()
    print(data)
    if "type" in data:
        product_category_id = db.execute("SELECT product_category_id FROM product_categories WHERE product_category_name = ?", data["type"])
        product_category_id = product_category_id[0]["product_category_id"]
        db.execute("UPDATE product_subcategories SET product_subcategory_name = ? WHERE product_subcategory_name = ? AND product_category_id = ?", data["new_name"], data["old_name"], product_category_id)
        return redirect("/editproduct")
    if data["category"] == "setting_categories":
        db.execute("UPDATE setting_categories SET setting_category_name = ? WHERE setting_category_name = ?", data["new_name"], data["old_name"])
    elif data["category"] == "product_categories":
        db.execute("UPDATE product_categories SET product_category_name = ? WHERE product_category_name = ?", data["new_name"], data["old_name"])
    else:
        db.execute("UPDATE modifier_categories SET modifier_category_name = ? WHERE modifier_category_name = ?", data["new_name"], data["old_name"])
    return "ok"

# Add a category.
@app.route("/new_option", methods=["POST"])
@login_required
def new_option():
    data = request.get_json()
    print(data)
    if data["category"] == "setting_categories":
        db.execute("INSERT INTO setting_categories (setting_category_id, setting_category_name) VALUES (?, ?)", data["id"], data["name"])
    elif data["category"] == "product_categories":
        db.execute("INSERT INTO product_categories (product_category_id, product_category_name) VALUES (?, ?)", data["id"], data["name"])
    else:
        db.execute("INSERT INTO modifier_categories (modifier_category_id, modifier_category_name, modifier_category_type_id) VALUES (?, ?, ?)", data["id"], data["name"], data["type"])
    return "ok"

# Delete a category.
@app.route("/deletecats", methods=["POST"])
@login_required
def deletecats():
    categories = request.get_json()
    for i in range (len(categories["items"])):
        if categories["table"] == "product_categories":
            id = db.execute("SELECT product_category_id FROM product_categories WHERE product_category_name = ?", categories["items"][i])
            productids = db.execute("SELECT product_subcategory_id FROM product_subcategories WHERE product_category_id = ?", id[0]["product_category_id"])
            for k in range(len(productids)):
                db.execute("DELETE FROM modifiers WHERE product_subcategory_id = ?", productids[k]["product_subcategory_id"])
                db.execute("DELETE FROM products WHERE product_subcategory_id = ?", productids[k]["product_subcategory_id"])
            db.execute("DELETE FROM product_categories WHERE product_category_name = ?", categories["items"][i])
        elif categories["table"] == "setting_categories":
            id = db.execute("SELECT setting_category_id FROM setting_categories WHERE setting_category_name = ?", categories["items"][i])
            settingids = db.execute("SELECT setting_id FROM settings WHERE setting_category_id = ?", id[0]["setting_category_id"])
            for k in range(len(settingids)):
                db.execute("DELETE FROM products WHERE setting_id = ?", settingids[k]["setting_id"])
                db.execute("DELETE FROM settings WHERE setting_id = ?", settingids[k]["setting_id"])
            db.execute("DELETE FROM setting_categories WHERE setting_category_name = ?", categories["items"][i])
        elif categories["table"] == "modifier_categories":
            id = db.execute("SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?", categories["items"][i])
            db.execute("DELETE FROM modifiers WHERE modifier_category_id = ?", id[0]["modifier_category_id"])
            db.execute("DELETE FROM modifier_categories WHERE modifier_category_name = ?", categories["items"][i])
    return redirect("/edit")

# Delete product, setting or modifier.
@app.route("/deleteoptions", methods=["POST"])
@login_required
def deleteoptions():
    options = request.get_json()
    print(options)
    for i in range(len(options["items"])):
        if options["table"] == "products":
            db.execute("DELETE FROM products WHERE setting_id = ? AND product_name = ?", options["items"][i], options["product"])
            id = db.execute("SELECT setting_category_id FROM settings WHERE setting_id = ?", options["items"][i])
            if not db.execute ("SELECT * FROM products WHERE setting_id = ?", options["items"][i]):
                db.execute("DELETE FROM settings WHERE setting_id = ?", options["items"][i])
                if not db.execute("SELECT * FROM settings WHERE setting_category_id = ?", id[0]["setting_category_id"]):
                    db.execute("DELETE FROM setting_categories WHERE setting_category_id = ?", id[0]["setting_category_id"])
        elif options["table"] == "modifiers":
            id = db.execute("SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?", options["items"][i])
            db.execute("DELETE FROM modifiers WHERE modifier_category_id = ? AND product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?)", id[0]["modifier_category_id"], options["product"])
            if not db.execute("SELECT * FROM modifiers WHERE modifier_category_id = ?", id[0]["modifier_category_id"]):
                db.execute("DELETE FROM modifier_categories WHERE modifier_category_id = ?", id[0]["modifier_category_id"])
    return redirect("/editproduct")

# Delete a subcategory.
@app.route("/deletesubcats", methods=["POST"])
@login_required
def deletesubcats():
    subcategories = request.get_json()
    print(subcategories)
    for i in range (len(subcategories["items"])):
        if subcategories["table"] == "product_categories":
            id = db.execute("SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?", subcategories["items"][i])
            category_id = db.execute("SELECT product_category_id FROM product_subcategories WHERE product_subcategory_id = ?", id[0]["product_subcategory_id"])
            db.execute("DELETE FROM modifiers WHERE product_subcategory_id = ?", id[0]["product_subcategory_id"])
            db.execute("DELETE FROM products WHERE product_subcategory_id = ?", id[0]["product_subcategory_id"])
            db.execute("DELETE FROM product_subcategories WHERE product_subcategory_id = ?", id[0]["product_subcategory_id"])
            if not db.execute("SELECT * FROM product_subcategories WHERE product_category_id = ?", category_id[0]["product_category_id"]):
                db.execute("DELETE FROM product_categories WHERE product_category_id = ?", category_id[0]["product_category_id"])
        elif subcategories["table"] == "setting_categories":
            id = db.execute("SELECT setting_id FROM settings WHERE setting_name = ?", subcategories["items"][i])
            category_id = db.execute("SELECT setting_category_id FROM settings WHERE setting_id = ?", id[0]["setting_id"])
            if db.execute("SELECT * FROM products WHERE setting_id = ?", id[0]["setting_id"]):
                db.execute("DELETE FROM products WHERE setting_id = ?", id[0]["setting_id"])
            db.execute("DELETE FROM settings WHERE setting_id = ?", id[0]["setting_id"])
            if not db.execute("SELECT * FROM settings WHERE setting_category_id = ?", category_id[0]["setting_category_id"]):
                db.execute("DELETE FROM setting_categories WHERE setting_category_id = ?", category_id[0]["setting_category_id"])
        elif subcategories["table"] == "modifier_categories":
            id = db.execute("SELECT modifier_id FROM modifiers WHERE modifier_name = ?", subcategories["items"][i])
            category_id = db.execute("SELECT modifier_category_id FROM modifiers WHERE modifier_id = ?", id[0]["modifier_id"])
            for i in range(len(id)):
                db.execute("DELETE FROM modifiers WHERE modifier_id = ?", id[i]["modifier_id"])
            if not db.execute("SELECT * FROM modifiers WHERE modifier_category_id = ?", category_id[0]["modifier_category_id"]):
                db.execute("DELETE FROM modifier_categories WHERE modifier_category_id = ?", category_id[0]["modifier_category_id"])
    return redirect("/editsubcats")

# Upload an image.
@app.route("/upload", methods=["POST"])
@login_required
def upload():
    file = request.files["productImage"]
    filename = file.filename
    name = filename.split(".")
    name = name[0]
    file.save(app.config["UPLOAD_FOLDER"] + filename)
    db.execute("UPDATE product_subcategories SET product_image = ? WHERE product_subcategory_name = ?", app.config["UPLOAD_FOLDER"] + filename, name)
    return "ok"

# Update a subcategory.
@app.route("/updateoptions", methods=["POST"])
@login_required
def updateoptions():
    options = request.get_json()
    print(options)
    if options["table"] == "status":
        if options["status"]:
            db.execute("UPDATE product_subcategories SET product_subcategory_status = ? WHERE product_subcategory_name = ?", "true", options["product"])
        else:
            db.execute("UPDATE product_subcategories SET product_subcategory_status = ? WHERE product_subcategory_name = ?", "false", options["product"])
    elif options["table"] == "settings":
        for i in options["items"]:
            db.execute("UPDATE products SET product_price = ? WHERE setting_id = (SELECT setting_id FROM settings WHERE setting_name = ?) AND product_subcategory_id = (SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?)", options["items"][i], i, options["product"])
    elif options["table"] == "products":
        print(options["items"])
        print(options["price"])
        print(options["product"])
        setting_id = db.execute("SELECT setting_id FROM settings WHERE setting_name = ?", options["items"])
        setting_id = setting_id[0]["setting_id"]
        product_id = db.execute("SELECT MAX (product_id) FROM products")
        if product_id[0]["MAX (product_id)"] == None:
            product_id = 0
        else:
            product_id = product_id[0]["MAX (product_id)"] + 1
        product_subcategory_id = db.execute("SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?", options["product"])
        product_subcategory_id = product_subcategory_id[0]["product_subcategory_id"]
        db.execute("INSERT INTO products (product_id, product_subcategory_id, setting_id, product_name, product_price) VALUES (?, ?, ?, ?, ?)", product_id, product_subcategory_id, setting_id, options["product"], options["price"])
    elif options["table"] == "modifiers":
        category_id = db.execute("SELECT modifier_category_id FROM modifier_categories WHERE modifier_category_name = ?", options["items"])
        category_id = category_id[0]["modifier_category_id"]
        product_subcategory_id = db.execute("SELECT product_subcategory_id FROM product_subcategories WHERE product_subcategory_name = ?", options["product"])
        product_subcategory_id = product_subcategory_id[0]["product_subcategory_id"]
        modifiers = db.execute("SELECT DISTINCT modifier_name FROM modifiers WHERE modifier_category_id = ?", category_id)
        for i in range(len(modifiers)):
            modifier_id = db.execute("SELECT MAX (modifier_id) FROM modifiers")
            if modifier_id[0]["MAX (modifier_id)"] == None:
                modifier_id = 0
            else:
                modifier_id = modifier_id[0]["MAX (modifier_id)"] + 1
            modifier_price = db.execute("SELECT modifier_price FROM modifiers WHERE modifier_name = ?", modifiers[i]["modifier_name"])
            modifier_price = modifier_price[0]["modifier_price"]
            db.execute("INSERT INTO modifiers (modifier_id, modifier_category_id, product_subcategory_id, modifier_name, modifier_price) VALUES (?, ?, ?, ?, ?)", modifier_id, category_id, product_subcategory_id, modifiers[i]["modifier_name"], modifier_price)
    return redirect("/editproduct")

if __name__ == '__main__':
   app.run(debug=True)