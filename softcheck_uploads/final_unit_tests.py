import unittest
from student import *


class ListManipulationTests(unittest.TestCase):

    def test_find_duplicates(self):
        # Test case with duplicates
        lst1 = [1, 2, 3, 4, 5, 2, 3, 4]
        expected_duplicates1 = [2, 3, 4]
        self.assertEqual(find_duplicates(lst1), expected_duplicates1)

        # Test case without duplicates
        lst2 = [1, 2, 3, 4, 5]
        expected_duplicates2 = []
        self.assertEqual(find_duplicates(lst2), expected_duplicates2)

    def test_remove_duplicates(self):
        # Test case with duplicates
        lst1 = [1, 2, 3, 4, 5, 2, 3, 4]
        expected_result1 = [1, 2, 3, 4, 5]
        self.assertEqual(remove_duplicates(lst1), expected_result1)

        # Test case without duplicates
        lst2 = [1, 2, 3, 4, 5]
        expected_result2 = [1, 2, 3, 4, 5]
        self.assertEqual(remove_duplicates(lst2), expected_result2)

    def test_reverse_list(self):
        # Test case with elements
        lst1 = [1, 2, 3, 4, 5]
        expected_result1 = [5, 4, 3, 2, 1]
        self.assertEqual(reverse_list(lst1), expected_result1)

        # Test case with an empty list
        lst2 = []
        expected_result2 = []
        self.assertEqual(reverse_list(lst2), expected_result2)

    def test_flatten_list(self):
        # Test case with nested list
        lst1 = [1, [2, 3], [4, [5, 6]]]
        expected_result1 = [1, 2, 3, 4, 5, 6]
        self.assertEqual(flatten_list(lst1), expected_result1)

        # Test case with a flat list
        lst2 = [1, 2, 3, 4, 5]
        expected_result2 = [1, 2, 3, 4, 5]
        self.assertEqual(flatten_list(lst2), expected_result2)

        # Test case with an empty list
        lst3 = []
        expected_result3 = []
        self.assertEqual(flatten_list(lst3), expected_result3)

    def test_get_unique_elements(self):
        # Test case with duplicates
        lst1 = [1, 2, 3, 4, 5, 2, 3, 4]
        expected_result1 = [1, 2, 3, 4, 5]
        self.assertEqual(get_unique_elements(lst1), expected_result1)

        # Test case without duplicates
        lst2 = [1, 2, 3, 4, 5]
        expected_result2 = [1, 2, 3, 4, 5]
        self.assertEqual(get_unique_elements(lst2), expected_result2)

    def test_count_elements(self):
        # Test case with duplicates
        lst1 = [1, 2, 3, 4, 5, 2, 3, 4]
        expected_counts1 = {1: 1, 2: 2, 3: 2, 4: 2, 5: 1}
        self.assertEqual(count_elements(lst1), expected_counts1)

        # Test case without duplicates
        lst2 = [1, 2, 3, 4, 5]
        expected_counts2 = {1: 1, 2: 1, 3: 1, 4: 1, 5: 1}
        self.assertEqual(count_elements(lst2), expected_counts2)

    def test_find_duplicates_empty_list(self):
        # Test case with an empty list
        lst = []
        expected_duplicates = []
        self.assertEqual(find_duplicates(lst), expected_duplicates)

    def test_remove_duplicates_empty_list(self):
        # Test case with an empty list
        lst = []
        expected_result = []
        self.assertEqual(remove_duplicates(lst), expected_result)

    def test_reverse_list_empty_list(self):
        # Test case with an empty list
        lst = []
        expected_result = []
        self.assertEqual(reverse_list(lst), expected_result)

    def test_flatten_list_empty_list(self):
        # Test case with an empty list
        lst = []
        expected_result = []
        self.assertEqual(flatten_list(lst), expected_result)

    def test_get_unique_elements_empty_list(self):
        # Test case with an empty list
        lst = []
        expected_result = []
        self.assertEqual(get_unique_elements(lst), expected_result)

    def test_count_elements_empty_list(self):
        # Test case with an empty list
        lst = []
        expected_counts = {}
        self.assertEqual(count_elements(lst), expected_counts)

    def test_find_duplicates_single_element_list(self):
        # Test case with a single-element list
        lst = [1]
        expected_duplicates = []
        self.assertEqual(find_duplicates(lst), expected_duplicates)

    def test_remove_duplicates_single_element_list(self):
        # Test case with a single-element list
        lst = [1]
        expected_result = [1]
        self.assertEqual(remove_duplicates(lst), expected_result)

    def test_reverse_list_single_element_list(self):
        # Test case with a single-element list
        lst = [1]
        expected_result = [1]
        self.assertEqual(reverse_list(lst), expected_result)

    def test_flatten_list_single_element_list(self):
        # Test case with a single-element list
        lst = [1]
        expected_result = [1]
        self.assertEqual(flatten_list(lst), expected_result)

    def test_get_unique_elements_single_element_list(self):
        # Test case with a single-element list
        lst = [1]
        expected_result = [1]
        self.assertEqual(get_unique_elements(lst), expected_result)

    def test_count_elements_single_element_list(self):
        # Test case with a single-element list
        lst = [1]
        expected_counts = {1: 1}
        self.assertEqual(count_elements(lst), expected_counts)

    def test_find_duplicates_all_duplicates(self):
        # Test case with all elements being duplicates
        lst = [1, 1, 1, 1, 1]
        expected_duplicates = [1]
        self.assertEqual(find_duplicates(lst), expected_duplicates)

    def test_remove_duplicates_all_duplicates(self):
        # Test case with all elements being duplicates
        lst = [1, 1, 1, 1, 1]
        expected_result = [1]
        self.assertEqual(remove_duplicates(lst), expected_result)

    def test_reverse_list_all_duplicates(self):
        # Test case with all elements being duplicates
        lst = [1, 1, 1, 1, 1]
        expected_result = [1, 1, 1, 1, 1]
        self.assertEqual(reverse_list(lst), expected_result)

    def test_flatten_list_all_duplicates(self):
        # Test case with all elements being duplicates
        lst = [1, 1, 1, 1, 1]
        expected_result = [1, 1, 1, 1, 1]
        self.assertEqual(flatten_list(lst), expected_result)

    def test_get_unique_elements_all_duplicates(self):
        # Test case with all elements being duplicates
        lst = [1, 1, 1, 1, 1]
        expected_result = [1]
        self.assertEqual(get_unique_elements(lst), expected_result)

    def test_count_elements_all_duplicates(self):
        # Test case with all elements being duplicates
        lst = [1, 1, 1, 1, 1]
        expected_counts = {1: 5}
        self.assertEqual(count_elements(lst), expected_counts)

    def test_reverse_list_nested_lists(self):
        # Test case with nested lists
        lst = [1, [2, 3], [2, [4, 5, 6]], 3, [4, [5, 6]]]
        expected_result = [[4, [5, 6]], 3, [2, [4, 5, 6]], [2, 3], 1]
        self.assertEqual(reverse_list(lst), expected_result)

    def test_flatten_list_nested_lists(self):
        # Test case with nested lists
        lst = [1, [2, 3], [2, [4, 5, 6]], 3, [4, [5, 6]]]
        expected_result = [1, 2, 3, 2, 4, 5, 6, 3, 4, 5, 6]
        self.assertEqual(flatten_list(lst), expected_result)

if __name__ == '__main__':
    unittest.main()
