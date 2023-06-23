from cs50 import get_float

# Define the coins
quarter = 25
dime = 10
nickel = 5
penny = 1

while True:
    # Prompt user for input
    change = get_float("Change owed: ")
    if change >= 0:
        change *= 100
        count = 0
        # Calculate quantity for each coin
        while change > 0:
            if change >= quarter:
                count += int(change / quarter)
                change = change % quarter
            if change >= dime:
                count += int(change / dime)
                change = change % dime
            if change >= nickel:
                count += int(change / nickel)
                change = change % nickel
            if change >= penny:
                count += int(change / penny)
                change = change % penny
        print(count)
        break