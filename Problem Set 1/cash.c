#include <stdio.h>
#include <cs50.h>
#include <math.h>

int main(void)

{
    float dollars;
    int quarter = 25;
    int dime = 10;
    int nickel = 5;
    int penny = 1;

    do
    {
        //Prompting the user to enter the amount of change owed
        dollars = get_float("Change owed: ");
    }
    while (dollars <= 0);
    //Converting dollars to cents to avoid imprecision
    int cents = round(dollars * 100);
    int coins = 0;
    //Using quarters if possible
    while (cents >= quarter)
    {
        cents = cents - quarter;
        coins++;
    }
    //Using dimes if possible
    while (cents >= dime && cents < quarter)
    {
        cents = cents - dime;
        coins++;
    }
    //Using nickels if possible
    while (cents >= nickel && cents < dime)
    {
        cents = cents - nickel;
        coins++;
    }
    //Using pennies if possible
    while (cents >= penny && cents < nickel)
    {
        cents = cents - penny;
        coins++;
    }
    //Showing the amount of coins
    printf("%i\n", coins);
}