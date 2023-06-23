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

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    float kernelX[3][3] = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
    float kernelY[3][3] = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};
    //Making an empty struct to store values temporarily
    RGBTRIPLE temp[height][width];
    int GxRed, GxGreen, GxBlue, GyRed, GyGreen, GyBlue;
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            //Setting to 0 the values for each channel
            GxRed = GxGreen = GxBlue = GyRed = GyGreen = GyBlue = 0;
            for (int row_count = -1; row_count < 2; row_count++)
            {
                for (int column_count = -1; column_count < 2; column_count++)
                {
                    if (i + row_count >= 0 && j + column_count >= 0 && i + row_count < height && j + column_count < width)
                    {
                        //Calculating kernel-multiplied red, green and blue values for current pixel
                        GxRed += image[i + row_count][j + column_count].rgbtRed * kernelX[row_count + 1][column_count + 1];
                        GxGreen += image[i + row_count][j + column_count].rgbtGreen * kernelX[row_count + 1][column_count + 1];
                        GxBlue += image[i + row_count][j + column_count].rgbtBlue * kernelX[row_count + 1][column_count + 1];
                        GyRed += image[i + row_count][j + column_count].rgbtRed * kernelY[row_count + 1][column_count + 1];
                        GyGreen += image[i + row_count][j + column_count].rgbtGreen * kernelY[row_count + 1][column_count + 1];
                        GyBlue += image[i + row_count][j + column_count].rgbtBlue * kernelY[row_count + 1][column_count + 1];
                    }
                }
            }
            //Capping values at 255 and copying them to the temp image struct
            temp[i][j].rgbtRed = fmin(round(sqrt(GxRed * GxRed + GyRed * GyRed)), 255);
            if (temp[i][j].rgbtRed > 255)
            {
                temp[i][j].rgbtRed = 255;
            }
            temp[i][j].rgbtGreen = fmin(round(sqrt(GxGreen * GxGreen + GyGreen * GyGreen)), 255);
            if (temp[i][j].rgbtGreen > 255)
            {
                temp[i][j].rgbtGreen = 255;
            }
            temp[i][j].rgbtBlue = fmin(round(sqrt(GxBlue * GxBlue + GyBlue * GyBlue)), 255);
            if (temp[i][j].rgbtBlue > 255)
            {
                temp[i][j].rgbtBlue = 255;
            }
        }
    }
    //Copying the filtered image back
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
