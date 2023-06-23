#include <stdio.h>
#include <math.h>
#include "helpers.h"

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            float average = (image[i][j].rgbtBlue + image[i][j].rgbtGreen + image[i][j].rgbtRed) / 3.0;
            image[i][j].rgbtBlue = image[i][j].rgbtGreen = image[i][j].rgbtRed = (int) round(average);
        }
    }
    return;
}

// Convert image to sepia
void sepia(int height, int width, RGBTRIPLE image[height][width])
{
    //Nested loop for moving from pixel to pixel
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            //Calculating sepia values for current pixel
            float sepiaRed = .393 * image[i][j].rgbtRed + .769 * image[i][j].rgbtGreen + .189 * image[i][j].rgbtBlue;
            float sepiaGreen = .349 * image[i][j].rgbtRed + .686 * image[i][j].rgbtGreen + .168 * image[i][j].rgbtBlue;
            float sepiaBlue = .272 * image[i][j].rgbtRed + .534 * image[i][j].rgbtGreen + .131 * image[i][j].rgbtBlue;
            //Checking whether the red value is less than 255 or not, and writing it back to the image
            if (sepiaRed > 255)
            {
                image[i][j].rgbtRed = 255;
            }
            else
            {
                image[i][j].rgbtRed = (int) round(sepiaRed);
            }
            //Checking whether the green value is less than 255 or not, and writing it back to the image
            if (sepiaGreen > 255)
            {
                image[i][j].rgbtGreen = 255;
            }
            else
            {
                image[i][j].rgbtGreen = (int) round(sepiaGreen);
            }
            //Checking whether the blue value is less than 255 or not, and writing it back to the image
            if (sepiaBlue > 255)
            {
                image[i][j].rgbtBlue = 255;
            }
            else
            {
                image[i][j].rgbtBlue = (int) round(sepiaBlue);
            }
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        int k = width - 1;
        for (int j = 0; j < k; j++)
        {
            //Swapping the pixels using the temp variable
            int temp = image[i][k].rgbtRed;
            image[i][k].rgbtRed = image[i][j].rgbtRed;
            image[i][j].rgbtRed = temp;
            temp = image[i][k].rgbtGreen;
            image[i][k].rgbtGreen = image[i][j].rgbtGreen;
            image[i][j].rgbtGreen = temp;
            temp = image[i][k].rgbtBlue;
            image[i][k].rgbtBlue = image[i][j].rgbtBlue;
            image[i][j].rgbtBlue = temp;
            k--;
        }
    }
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    //Making an empty struct to store values temporarily
    RGBTRIPLE temp[height][width];
    int sumRed, sumGreen, sumBlue;
    float elements;
    //Nested loop to move from pixel to pixel
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            sumRed = 0;
            sumGreen = 0;
            sumBlue = 0;
            elements = 0;
            //Nested loop to check neigboring pixels' values and summarize them
            for (int row_count = -1; row_count < 2; row_count++)
            {
                for (int column_count = -1; column_count < 2; column_count++)
                {
                    if (i + row_count >= 0 && j + column_count >= 0 && i + row_count < height && j + column_count < width)
                    {
                        sumRed += image[i + row_count][j + column_count].rgbtRed;
                        sumGreen += image[i + row_count][j + column_count].rgbtGreen;
                        sumBlue += image[i + row_count][j + column_count].rgbtBlue;
                        elements++;
                    }
                }
            }
            //Writing the averaged values to the temporary struct
            temp[i][j].rgbtRed = (int) round(sumRed / elements);
            temp[i][j].rgbtGreen = (int) round(sumGreen / elements);
            temp[i][j].rgbtBlue = (int) round(sumBlue / elements);
        }
    }
    //Copying the blurred image back
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            image[i][j].rgbtRed = temp[i][j].rgbtRed;
            image[i][j].rgbtGreen = temp[i][j].rgbtGreen;
            image[i][j].rgbtBlue = temp[i][j].rgbtBlue;
        }
    }
    return;
}
