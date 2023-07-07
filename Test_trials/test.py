import unittest
from student import sum

class TestSum(unittest.TestCase):
    # Tests that the function returns the correct sum of two positive integers
    def test_positive_integers_sum(self):
        assert sum(2, 3) == 5

    # Tests that the function returns the correct sum of two negative integers
    def test_negative_integers_sum(self):
        assert sum(-2, -3) == -5

    # Tests that the function returns the correct sum of one positive and one negative integer
    def test_positive_and_negative_integers_sum(self):
        assert sum(2, -3) == -1

    # Tests that the function returns the correct sum of zero and a positive integer
    def test_zero_and_positive_integer_sum(self):
        assert sum(0, 5) == 5

    # Tests that the function returns the correct sum of the maximum possible integer values
    def test_maximum_integer_values_sum(self):
        assert sum(2147483647, 2147483647) == 4294967294
        
    # Tests that the function returns the correct sum of the minimum possible integer values
    def test_minimum_integer_values_sum(self):
        assert sum(-2147483648, -2147483648) == -4294967296
    
    

    
# run the tests
if __name__ == '__main__':
    unittest.main()