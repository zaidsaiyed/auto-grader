"""
-------------------------------------------------------
[Program to calculate the annual tax paid by a company]
-------------------------------------------------------
Author:  Zaid Saiyed
ID:      169015983
Email:   saiy5983@mylaurier.ca
__updated__ = "2022-01-26"
-------------------------------------------------------
"""
# Constants
ANNUAL_TAX = 18.50

def main():
    total_sales = int(input("Enter the total sales: $"))


    print("\nProjected Tax Report")
    print(f'{"-":-<30}')
    print(f'Total sales:   $ {total_sales:,.2f}')
    print(f'Annual tax:    % {ANNUAL_TAX:.2f}')
    print(f'{"-":-<30}')
    print(f'Tax:           $ {percent(total_sales,ANNUAL_TAX):9,.2f}')
    


def percent(num,percentage):
    """
    -------------------------------------------------------
    Discription:
        Calculates part for given Percentage
    Use: 
        part_value = percent(num,percentage)
    Example:
        For Eg: 10% of 300 then write percentage(300,10)
    -------------------------------------------------------
    Parameters:
        num - number (int)
        percentage - percentage (float)
    Returns:
        part_value - part of that percentage (float)
    ------------------------------------------------------
    """
    part = num * percentage / 100
    return part

main()