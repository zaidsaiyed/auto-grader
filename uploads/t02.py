"""
-------------------------------------------------------
[Product of the two digits for given two-digit integer]
-------------------------------------------------------
Author:  Zaid Saiyed
ID:      169015983
Email:   saiy5983@mylaurier.ca
__updated__ = "2022-01-26"
-------------------------------------------------------
"""
# Getting integer input from user
number = int(input("Enter a positive digit number: "))

# Obtaining tens digit
tens_digit = number // 10

# Obtaining unit's digit
units_digit = number % 10

# Product of two digits
product_of_digits = tens_digit * units_digit

print(f'\nThe product of the digits of {number} is {product_of_digits}')