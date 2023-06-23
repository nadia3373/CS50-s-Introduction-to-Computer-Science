// Implements a dictionary's functionality

#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "dictionary.h"

#define DICTIONARY "dictionaries/large"

// Represents a node in a hash table
typedef struct node
{
    char word[LENGTH + 1];
    struct node *next;
}
node;

// TODO: Choose number of buckets in hash table
const unsigned int N = 456976;

// Hash table
node *table[N];

int word_count = 0;

// Returns true if word is in dictionary, else false
bool check(const char *word)
{
    // TODO
    int code = hash(word);
    node *cursor = table[code];
    while (cursor != NULL)
    {
        if (strcasecmp(cursor->word, word) == 0)
        {
            return true;
        }
        cursor = cursor->next;
    }
    return false;
}

// Hashes word to a number
unsigned int hash(const char *word)
{
    // TODO: Improve this hash function
    if (isalpha(word[0]) && isalpha(word[1]) && isalpha(word[2]) && isalpha(word[3]))
    {
        return 17576 * (tolower(word[0]) - 'a') + 676 * (tolower(word[1]) - 'a') + 26 * (tolower(word[2]) - 'a') + (tolower(word[3]) - 'a');
    }
    else if (isalpha(word[0]) && isalpha(word[1]) && isalpha(word[2]))
    {
        return 676 * (tolower(word[0]) - 'a') + 26 * (tolower(word[1]) - 'a') + (tolower(word[2]) - 'a');
    }
    else if (isalpha(word[0]) && isalpha(word[1]))
    {
        return 26 * (tolower(word[0]) - 'a') + (tolower(word[1]) - 'a');
    }
    else
    {
        return 26 * (tolower(word[0]) - 'a');
    }
}

// Loads dictionary into memory, returning true if successful, else false
bool load(const char *dictionary)
{
    // TODO
    FILE *dict = fopen(dictionary, "r");
    if (dict == NULL)
    {
        return false;
    }
    char temp[LENGTH + 1];
    while (fscanf(dict, "%s", temp) != EOF)
    {
        node *n = malloc(sizeof(node));
        if (n == NULL)
        {
            return 1;
        }
        int code = hash(temp);
        strcpy(n->word, temp);
        n->next = table[code];
        table[code] = n;
        word_count++;
    }
    fclose(dict);
    return true;
}

// Returns number of words in dictionary if loaded, else 0 if not yet loaded
unsigned int size(void)
{
    // TODO
    return word_count;
}

// Unloads dictionary from memory, returning true if successful, else false
bool unload(void)
{
    // TODO
    int i;
    for (i = 0; i < N; i++)
    {
        node *cursor = table[i];
        node *temp = cursor;
        while (cursor != NULL)
        {
            cursor = cursor->next;
            free(temp);
            temp = cursor;
        }
    }
    if (i == N)
    {
        return true;
    }
    else
    {
        return false;
    }
}
