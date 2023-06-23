#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

int BLOCK_SIZE = 512;
typedef uint8_t BYTE;

int main(int argc, char *argv[])
{
    //Check whether arguments count is correct or not
    if (argc != 2)
    {
        printf("Usage: ./recover filename\n");
        return 1;
    }
    //Open source file for reading
    FILE *source = fopen(argv[1], "r");
    //Returning error if the file can't be opened
    if (source == NULL)
    {
        printf("Cannot open file\n");
        return 1;
    }
    //Setting counter to 0, allocating memory for the name of out file, allocating memory for the buffer
    int count = 0;
    char *name = malloc(8 * sizeof(char));
    FILE *out;
    BYTE *buffer = malloc(BLOCK_SIZE);
    //Looping through the entire source file, reading 512 bytes blocks one by one and checking whether they contain jpeg signatures or not
    while (fread(buffer, sizeof(BYTE), BLOCK_SIZE, source) == BLOCK_SIZE)
    {
        //If the block read starts with a signature, start a new source file and write the block there
        if (buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0)
        {
            sprintf(name, "%03d.jpg", count);
            out = fopen(name, "w");
            fwrite(buffer, sizeof(BYTE), BLOCK_SIZE, out);
            fclose(out);
            count++;
        }
        //If the block doesn't start with a signature and this is not the first block, continue writing to the previous file
        else if (count > 0)
        {
            sprintf(name, "%03d.jpg", count - 1);
            out = fopen(name, "a");
            fwrite(buffer, 1, BLOCK_SIZE, out);
            fclose(out);
        }
    }
    fclose(source);
    free(name);
    free(buffer);
}
