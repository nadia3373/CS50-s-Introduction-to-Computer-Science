#include <stdio.h>
#include <cs50.h>

int main(void)

{
    int height, spaces, hashes;

    do
    {
        //Prompting the user to enter the height of the pyramid
        height = get_int("Height: ");
    }
    //Making sure that the height entered is between 1 and 8
    while (height < 1 || height > 8);
    //Making the rows
    for (int rows = height; rows > 0; rows--)
    {
        for (spaces = 1; spaces < rows; spaces++)
        {
            printf(" ");
        }
        //Making the steps
        for (hashes = height - spaces; hashes >= 0; hashes--)
        {
            printf("#");
        }
        printf("\n");
    }
}