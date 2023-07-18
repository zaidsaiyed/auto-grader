import unittest
from student import sum

class Unit_Tests(unittest.TestCase):
    # Tests that the function returns the correct sum of two positive integers
    def test_positive_integers_sum(self):
        assert sum(2, 3) == 6

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
    


# Custom test result printer class
class TestResultPrinter(unittest.TextTestResult):
    def __init__(self, stream=None, descriptions=None, verbosity=None):
        super().__init__(stream, descriptions, verbosity)
        self.test_results = []

    def addSuccess(self, test):
        super().addSuccess(test)
        test_name = self.getDescription(test)
        self.test_results.append((test_name, 'OK'))

    def addFailure(self, test, err):
        super().addFailure(test, err)
        test_name = self.getDescription(test)
        self.test_results.append((test_name, 'FAILED'))

    def addError(self, test, err):
        super().addError(test, err)
        test_name = self.getDescription(test)
        self.test_results.append((test_name, 'ERROR'))

    def print_results(self):
#         print("""\n
# --------------------------------
# Results:
# --------------------------------\n
# """)
        for test_name, result in self.test_results:
            print(f"Test: {test_name.split('(')[0]}")
            print(result)
            print()
        print(f"Final Marks:{self.testsRun - (len(self.failures) + len(self.errors))}/{self.testsRun}")

class CustomTestRunner(unittest.TextTestRunner):
    def _makeResult(self):
        return TestResultPrinter(self.stream, self.descriptions, self.verbosity)

def main():
    test_suite = unittest.TestLoader().loadTestsFromTestCase(Unit_Tests)
    runner = CustomTestRunner()
    result = runner.run(test_suite)
    result.print_results()

main()