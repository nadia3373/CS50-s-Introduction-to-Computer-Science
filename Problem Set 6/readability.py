from cs50 import get_string
import re

# Prompt user for input
text = get_string("Text: ")
print(text)
# Count letters
letters = re.split("[a-zA-Z]", text)
letters = int(len(letters) - 1)
print(letters)
# Count words
words = re.split(" ", text)
words = len(words)
print(words)
# Count sentences
sentences = re.split("[.?!][\s\n]", text)
sentences = int(len(sentences))
print(sentences)
# Calculate rating
index = round(5.88 * letters / words - 29.6 * sentences / words - 15.8)
if index < 1:
    print("Before Grade 1")
elif index >= 16:
    print("Grade 16+")
else:
    print("Grade ", index)