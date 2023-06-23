#include <stdio.h>
#include <cs50.h>

int main(void)
{
    //Prompting a user for their name
    string name = get_string("What is your name?\n");
    printf("hello, %s\n", name);
}