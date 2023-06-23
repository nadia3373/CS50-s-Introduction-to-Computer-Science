import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)
app.debug = True

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

# Make sure API key is set
if not os.environ.get("API_KEY"):
    raise RuntimeError("API_KEY not set")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    total = 0
    shares = db.execute("SELECT symbol, name, shares FROM shares WHERE user_id = ?", session["user_id"])
    for share in shares:
        share["price"] = lookup(share["symbol"])
        share["price"] = float(share["price"]["price"])
        share["total"] = (share["price"] * share["shares"])
        total += share["total"]
    cash = db.execute("SELECT cash FROM users WHERE id = ?", session["user_id"])
    cash = float(cash[0]["cash"])
    total += cash
    return render_template("index.html", shares=shares, cash=cash, total=total)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        if not request.form.get("symbol"):
            return apology("must provide symbol", 400)
        symbol = request.form.get("symbol").upper()
        price = lookup(request.form.get("symbol"))
        if not price:
            return apology("incorrect symbol", 400)
        name = price["name"]
        price = price["price"]
        price = float(price)
        if not request.form.get("shares"):
            return apology("must provide shares", 400)
        shares = request.form.get("shares")
        if not shares.isdigit() or int(shares) == 0:
            return apology("enter 1 or more shares", 400)
        shares = int(shares)
        cash = db.execute("SELECT cash FROM users WHERE id = ?", session["user_id"])
        cash = cash[0]["cash"]
        date = datetime.now()
        date = date.strftime("%d-%m-%Y %H:%M:%S")
        if cash >= (price * shares):
            db.execute("UPDATE users SET cash = ? WHERE id = ?", cash - (price * shares), session["user_id"])
            db.execute("INSERT INTO purchases (user_id, symbol, name, shares, price, date) VALUES (?, ?, ?, ?, ?, ?)",
                       session["user_id"], symbol, name, shares, price, date)
            if (db.execute("SELECT * FROM shares WHERE user_id = ? AND symbol = ?", session["user_id"], symbol)):
                db.execute("UPDATE shares SET shares = (shares + ?) WHERE user_id = ? AND symbol = ?",
                           shares, session["user_id"], symbol)
            else:
                db.execute("INSERT INTO shares (user_id, symbol, name, shares) VALUES (?, ?, ?, ?)",
                           session["user_id"], symbol, name, shares)
        else:
            return apology("you don't have enough cash for this purchase", 403)
        return redirect("/")
    else:
        return render_template("buy.html")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    buy = db.execute("SELECT symbol, shares, price, date FROM purchases WHERE user_id = ?", session["user_id"])
    sell = db.execute("SELECT symbol, shares, price, date FROM sell WHERE user_id = ?", session["user_id"])
    return render_template("history.html", buy=buy, sell=sell)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    if request.method == "POST":
        if not request.form.get("symbol"):
            return apology("must provide symbol", 400)
        price = lookup(request.form.get("symbol"))
        if not price:
            return apology("incorrect symbol", 400)
        else:
            return render_template("quoted.html", price=price)
    else:
        return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    session.clear()
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 400)
        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 400)
        elif not request.form.get("confirmation"):
            return apology("must confirm password", 400)
        if request.form.get("password") != request.form.get("confirmation"):
            return apology("passwords don't match", 400)
        username = request.form.get("username")
        if len(db.execute("SELECT * FROM users WHERE username = ?", username)) != 0:
            return apology("username already exists", 400)
        hash = generate_password_hash(request.form.get("password"))
        db.execute("INSERT INTO users (username, hash) VALUES(?, ?)", username, hash)
        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 400)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")
    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    symbol = request.form.get("symbol")
    if request.method == "POST":
        if not len(db.execute("SELECT * FROM purchases WHERE user_id = ? AND symbol = ?", session["user_id"], symbol)):
            return apology("incorrect symbol", 400)
        shares = request.form.get("shares")
        if not shares.isdigit() or int(shares) == 0:
            return apology("enter 1 or more shares", 400)
        shares = int(shares)
        shares_owned = db.execute("SELECT SUM (shares) FROM purchases WHERE user_id = ? AND symbol = ?", session["user_id"], symbol)
        shares_owned = int(shares_owned[0]["SUM (shares)"])
        price = lookup(request.form.get("symbol"))
        if not price:
            return apology("incorrect symbol", 400)
        name = price["name"]
        price = price["price"]
        price = float(price)
        cash = db.execute("SELECT cash FROM users WHERE id = ?", session["user_id"])
        cash = cash[0]["cash"]
        date = datetime.now()
        date = date.strftime("%d-%m-%Y %H:%M:%S")
        if shares_owned >= shares:
            db.execute("UPDATE users SET cash = ? WHERE id = ?", cash + (price * shares), session["user_id"])
            db.execute("INSERT INTO sell (user_id, symbol, name, shares, price, date) VALUES (?, ?, ?, ?, ?, ?)",
                       session["user_id"], symbol, name, shares, price, date)
            db.execute("UPDATE shares SET shares = (shares - ?) WHERE user_id = ? AND symbol = ?",
                       shares, session["user_id"], symbol)
            shares = db.execute("SELECT shares FROM shares WHERE user_id = ? AND symbol = ?", session["user_id"], symbol)
            if int(shares[0]["shares"]) == 0:
                db.execute("DELETE FROM shares WHERE user_id = ? AND symbol = ?", session["user_id"], symbol)
        else:
            return apology("not enough shares", 400)
        return redirect("/")
    else:
        symbols = db.execute("SELECT DISTINCT symbol FROM shares WHERE user_id = ?", session["user_id"])
        return render_template("sell.html", symbols=symbols, symbol=symbol)