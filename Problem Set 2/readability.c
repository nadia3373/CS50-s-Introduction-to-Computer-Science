#include <stdio.h>
#include <math.h>
#include <string.h>
#include <cs50.h>

int count_letters(string text);
int count_words(string text);
int count_sentences(string text);
int length;

int main(void)

{
    float index;
    //Prompting the user for the input and printing it back
    string text = get_string("Text: ");
    printf("%s\n", text);
    //Saving the length of the text for further calculations
    length = strlen(text);
    //Calling the functions to calculate the number of letters, words and sentences
    int letters = count_letters(text);
    int words = count_words(text);
    int sentences = count_sentences(text);
    //Calculating grade level
    index = 5.88 * letters / words - 29.6 * sentences / words - 15.8;
    //Printing out the result
    if (index < 1)
    {
        printf("Before Grade 1\n");
    }
    else if (index >= 16)
    {
        printf("Grade 16+\n");
    }
    else
    {
        printf("Grade %i\n", (int) round(index));
    }
}
//Calctulating the number of letters
int count_letters(string text)
{
    int i = 0, letters = 0;
    while (i < length)
    {
        if ((text[i] >= 'A' && text[i] <= 'Z') || (text[i] >= 'a' && text[i] <= 'z'))
        {
            letters++;
        }
        i++;
    }
    return letters;
}
//Calculating the number of words
int count_words(string text)
{
    int i = 1, words = 0;
    //Checking the first symbol
    if ((text[0] >= 48 && text[0] <= 57) || (text[0] == '"') || (text[i] >= 'A' && text[i] <= 'Z') ||
        (text[i] >= 'a' && text[i] <= 'z'))
    {
        words++;
    }
    while (i < length)
    {
        //Checking whether the current symbol is a letter or not
        if ((text[i] >= 'A' && text[i] <= 'Z') || (text[i] >= 'a' && text[i] <= 'z'))
        {
            //Checking previous symbol
            if (text[i - 1] == ' ' || text[i - 1] == '"')
            {
                words++;
            }
        }
        i++;
    }
    return words;
}
//Calculating the number of sentences
int count_sentences(string text)
{
    int i = 0, sentences = 0;
    while (i < length)
    {
        //Checking whether the current symbol is a letter or not
        if ((text[i] >= 'A' && text[i] <= 'Z') || (text[i] >= 'a' && text[i] <= 'z'))
        {
            //Checking for the end of a sentence
            if (text[i + 1] == '.' || text[i + 1] == '!' || text[i + 1] == '?' || text[i + 1] == 0)
            {
                sentences++;
            }
        }
        i++;
    }
    return sentences;
}