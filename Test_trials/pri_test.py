import unittest
from student import sum

class TestSum(unittest.TestCase):
    def test_sum_2_plus_2(self):
        a, b = 2, 2
        expected_result = 4
        result = sum(a, b)
        self.assertEqual(result, expected_result)

    def test_sum_99_plus_1(self):
        a, b = 99, 1
        expected_result = 100
        result = sum(a, b)
        self.assertEqual(result, expected_result)

    def test_sum_22_33_11_55_44(self):
        values = [22, 33, 11, 55, 44]
        expected_result = 165
        result = sum(*values)
        self.assertEqual(result, expected_result)

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
        print("Testing: List_array Lab")
        for test_name, result in self.test_results:
            print(f"Test: {test_name}")
            print(result)
            print()

class CustomTestRunner(unittest.TextTestRunner):
    def _makeResult(self):
        return TestResultPrinter(self.stream, self.descriptions, self.verbosity)

if __name__ == '__main__':
    test_suite = unittest.TestLoader().loadTestsFromTestCase(TestSum)
    runner = CustomTestRunner()
    result = runner.run(test_suite)
    result.print_results()
