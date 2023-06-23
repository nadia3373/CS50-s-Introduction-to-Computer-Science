import os

from cs50 import SQL
from helpers import apology, login_required, lookup, usd
from datetime import datetime

db = SQL("sqlite:///finance.db")
buy = db.execute("SELECT symbol, shares, price, date FROM purchases WHERE user_id = 1")
buy.append(db.execute("SELECT symbol, shares, price, date FROM sell WHERE user_id = 1"))

print(buy["date"])