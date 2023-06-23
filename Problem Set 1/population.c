#include <stdio.h>
#include <cs50.h>

int main(void)
{
    int years = 0;
    int start_population;
    int end_population;
    do
    {
        //Making sure that the size entered is no less than 9
        start_population = get_int("Start size: ");
    }
    while (start_population < 9);
    do
    {
        //Making sure that the ending population size is no less than the starting population size
        end_population = get_int("End size: ");
    }
    while (end_population < start_population);
    if (end_population > start_population)
    {
        while (end_population > start_population)
        {
            int growth = start_population / 3;
            int decline = start_population / 4;
            //Changing the starting population value by annual growth and decline
            start_population = start_population + growth - decline;
            years++;
        }
    }
    else
    {
        years = 0;
    }
    //Printing the amount of years
    printf("Years: %i\n", years);
}