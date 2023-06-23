from cs50 import get_string
import re


def main():
    # Prompt input from user
    number = get_string("Number: ")
    # Check the card for possible type and validity
    if re.search("^3[47]\d{13}", number):
        if check(number):
            print("AMEX")
    elif re.search("^5[1-5]\d{14}", number):
        if check(number):
            print("MASTERCARD")
    elif re.search("^4\d{12,15}", number):
        if check(number):
            print("VISA")
    else:
        print("INVALID")

# Function to check the card for validity using Luhn's algorithm


def check(number):
    number = int(number)
    sum_first = 0
    sum_second = 0
    while number > 0:
        # Calculating the sums
        sum_first += number % 10
        number //= 10
        sum_second += (number % 10 * 2) % 10
        sum_second += (number % 10 * 2) // 10
        number //= 10
    number = sum_first + sum_second
    # Checking the final sum
    if number % 10 == 0:
        return True
    else:
        return False


main()