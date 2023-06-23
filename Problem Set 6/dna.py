import csv
import sys


def main():

    # Check for command-line usage
    if len(sys.argv) != 3:
        print("Usage: dna.py database.csv sequence.txt")
        sys.exit()

    # Read database file into a variable
    names = {}
    with open(sys.argv[1], "r") as database:
        reader = csv.DictReader(database)
        for row in reader:
            name = row["name"]
      #      names[name] = {}
            del row["name"]
            names[name] = row

    # Read DNA sequence file into a variable
    with open(sys.argv[2], "r") as sequence:
        sequence = sequence.read()

    # Find longest match of each STR in DNA sequence
    counts = {}
    for key, value in names.items():
        for key1 in value:
            if key1 not in counts:
                counts[key1] = 0
    for piece in counts:
        counts[piece] = longest_match(sequence, piece)

    match = check(counts, names)
    if match != None:
        print(match)
    else:
        print("No match")


# Check database for matching profiles
def check(counts, database):
    match = False
    for name in database:
        count = 0
        for piece in counts:
            if counts[piece] == int(database[name][piece]):
                match = True
                count += 1
            else:
                break
        if match == True and count == len(counts):
            return name


def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
