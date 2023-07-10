"""
-------------------------------------------------------
[Number of pieces of cake per person and left over]
-------------------------------------------------------
Author:  Zaid Saiyed
ID:      169015983
Email:   saiy5983@mylaurier.ca
__updated__ = "2022-01-26"
-------------------------------------------------------
"""
# Getting inputs from user
pieces_of_cake = int(input("Number of pieces of cake: "))
num_party_goers = int(input("Number of party-goers: "))

# Calculating cake data
cake_distributed = pieces_of_cake // num_party_goers
cake_left = pieces_of_cake % num_party_goers

# Printing values
print(f'\nEach party-goer receives {cake_distributed} pieces of cake')
print(f'Pieces of cake that won’t be distributed: {cake_left}')
