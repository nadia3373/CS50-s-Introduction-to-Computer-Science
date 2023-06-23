#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cs50.h>
#include <ctype.h>

char rotate(char c, int n);
bool only_digits(string text, int n);

int main(int argc, char *argv[])
{
    //Making sure there is just one command line argument
    if (argc != 2)
    {
        printf("Usage: ./caesar key\n");
        return 1;
    }
    int key_length = strlen(argv[1]);
    //Making sure that the key entered consists of digits only
    bool status = only_digits(argv[1], key_length);
    if (status == false)
    {
        printf("Usage: ./caesar key\n");
        return 1;
    }
    //Converting key characters to an actual number
    int key = atoi(argv[1]);
    //Prompting the user for input
    string text = get_string("plaintext:  ");
    int text_length = strlen(text);
    char cipher_text[text_length];
    printf("ciphertext: ");
    //Rotating the letters one by one
    for (int i = 0; i < text_length; i++)
    {
        cipher_text[i] = rotate(text[i], key);
        //Printing out the result
        printf("%c", cipher_text[i]);
    }
    printf("\n");
    return 0;
}
//Function to rotate the letters
char rotate(char c, int n)
{
    if (isalpha(c))
    {
        if (islower(c))
        {
            c = (c - 'a' + n) % 26 + 'a';
        }
        else
        {
            c = (c - 'A' + n) % 26 + 'A';
        }
    }
    return c;
}
//Function to check whether a character if a digit or not
bool only_digits(string text, int n)
{
    for (int i = 0; i < n; i++)
    {
        if (text[i] < '0' || text[i] > '9')
        {
            return false;
        }
    }
    return true;
}