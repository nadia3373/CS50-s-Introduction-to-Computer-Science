#include <stdio.h>
#include <cs50.h>

int main(void)

{
    long initial_number, number, digits;
    int count, index, first, second, sum;

    //Prompting the user for a card number and making sure that it has the correct format length for Visa, MasterCard or AmEx
    initial_number = get_long("Number: ");
    digits = initial_number;
    for (count = 0; digits > 0; count++)
    {
        digits = digits / 10;
    }
    if (count != 13 && count != 15 && count != 16)
    {
        printf("INVALID\n");
    }
    else
    {
        //Making calculations in accordance to Luhn's algorithm
        index = count;
        first = 0;
        second = 0;
        digits = initial_number;
        number = initial_number;
        while (index > 0)
        {
            //Summing up the first set of digits
            digits = number % 10;
            number = number / 10;
            first += digits;
            index--;

            //Summing up the second set of digits
            if (index > 0)
            {
                digits = number % 10;
                digits *= 2;
                number = number / 10;
                second += digits % 10;
                second += digits / 10;
                index--;
            }
        }
        //Summing up the first and the second sets of digits
        sum = first + second;

        //Checking if the card is legit or not
        if (sum % 10 != 0)
        {
            printf("INVALID\n");
        }

        //Determining the type of the card according to the first digits of its number
        else
        {
            index = 0;
            digits = initial_number;
            while (index < count - 2)
            {
                digits /= 10;
                index++;
            }
            //Checking if it's a VISA
            if (digits / 10 == 4 && (count == 16 || count == 13))
            {
                printf("VISA\n");
            }
            //Checking if it's a MasterCard
            else if (digits / 10 == 5 && digits % 10 > 0 && digits % 10 < 6 && count == 16)
            {
                printf("MASTERCARD\n");
            }
            //Checking if it's an AmEx
            else if (digits / 10 == 3 && (digits % 10 == 4 || digits % 10 == 7) && count == 15)
            {
                printf("AMEX\n");
            }
            else
            {
                printf("INVALID\n");
            }
        }
    }
}