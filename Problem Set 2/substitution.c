#include <stdio.h>
#include <cs50.h>
#include <string.h>
#include <ctype.h>

bool only_letters(string text, int n);
bool repeating_letters(string text, int n);
char substitution(char c, string text);

int main(int argc, char *argv[])
{
    //Making sure that there is just one command-line argument
    if (argc != 2)
    {
        printf("Usage: ./substitution key\n");
        return 1;
    }
    //Making sure that they key contains 26 characters
    int key_length = strlen(argv[1]);
    if (key_length != 26)
    {
        printf("Key must contain 26 characters.\n");
        return 1;
    }
    //Making sure that they key contains only letters
    bool status = only_letters(argv[1], key_length);
    if (status == false)
    {
        printf("Key must contain only letters.\n");
        return 1;
    }
    //Making sure that the key doesn't contain any repeating letters
    status = repeating_letters(argv[1], key_length);
    if (status == false)
    {
        printf("Key must not contain any repeating letters.\n");
        return 1;
    }
    //Prompting the user for input
    string text = get_string("plaintext:  ");
    int text_length = strlen(text);
    char cipher_text[text_length];
    printf("ciphertext: ");
    //Substituting the letters one by one
    for (int i = 0; i < text_length; i++)
    {
        cipher_text[i] = substitution(text[i], argv[1]);
        //Printing out the result
        printf("%c", cipher_text[i]);
    }
    printf("\n");
    return 0;
}
//Function to check whether the key contains only letters or not
bool only_letters(string text, int n)
{
    for (int i = 0; i < n; i++)
    {
        if (!isalpha(text[i]))
        {
            return false;
        }
    }
    return true;
}
//Function to check whether the key contains any repeating letters or not
bool repeating_letters(string text, int n)
{
    for (int i = 0; i < n; i++)
    {
        for (int j = i + 1; j < n; j++)
        {
            if (text[i] == text[j])
            {
                return false;
            }
        }
    }
    return true;
}
//Function to substitute the letters
char substitution(char c, string text)
{
    if (isalpha(c))
    {
        if (isupper(c))
        {
            c -= 'A';
            c = toupper(text[(int)c]);
        }
        else
        {
            c -= 'a';
            c = tolower(text[(int)c]);
        }
    }
    return c;
}