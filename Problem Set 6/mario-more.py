while True:
    try:
        # Prompt user for input
        height = int(input("Height: "))
        # Print a pyramid if the input is greater than 0 and less than 9
        if height > 0 and height < 9:
            for i in range(1, height + 1):
                print(" " * (height - i), end="")
                print("#" * i, end="")
                print("  ", end="")
                print("#" * i)
            break
    # Continue the loop if the input is not numerical
    except ValueError:
        continue