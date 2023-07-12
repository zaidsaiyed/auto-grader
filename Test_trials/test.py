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

class CustomTestRunner(unittest.TextTestRunner):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Additional initialization if needed

    def run(self, test):
        # Customize the test result output
        result = self._makeResult()
        self.stream.writeln("Custom Test Runner - Starting the tests")
        test(result)
        self.stream.writeln("Custom Test Runner - Finished the tests")
        self.stream.writeln("Custom Test Runner - Results:")
        self.stream.writeln(result.separator2)
        
        # test1 = test._testMethodName
        # print("this is test:", test1)
        # print("------------------------------------------")
        # print(result.errors)
        # print("Done")
        
        # for test_case in test._tests:
        #     test_name = test_case.id().split(".")[-1]
        #     self.stream.writeln(f"Test: {test_name}")
        #     self.stream.writeln("OK")
        #     self.stream.writeln("")

        for test_case, failure in result.failures:
            test_name = test_case.id().split(".")[-1]
            self.stream.writeln(f"Test: {test_name}")
            self.stream.writeln("FAILED")
            self.stream.writeln("")

        for test_case, error in result.errors:
            test_name = test_case.id().split(".")[-1]
            self.stream.writeln(f"Test: {test_name}")
            self.stream.writeln("ERROR")
            self.stream.writeln("")

        passed_tests = result.testsRun - len(result.failures) - len(result.errors)
        total_tests = result.testsRun
        self.stream.writeln(f"Final marks: {passed_tests} / {total_tests}")

        return result



# Create a test suite
test_suite = unittest.TestLoader().loadTestsFromTestCase(TestSum)

# Create a custom test runner and run the tests
custom_runner = CustomTestRunner()
custom_runner.run(test_suite)