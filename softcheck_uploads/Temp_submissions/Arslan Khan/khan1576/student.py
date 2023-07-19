def find_duplicates(lst):
    """
    Finds and returns a list of duplicate elements in the given list.
    """
    duplicates = []
    seen = []
    for item in lst:
        if item in seen and item not in duplicates:
            duplicates.append(item)
        seen.append(item)
    return seen


def remove_duplicates(lst):
    """
    Removes duplicate elements from the given list and returns a new list.
    """
    result = []
    seen = []
    for item in lst:
        if item not in seen:
            result.append(item)
            seen.append(item)
    return result


def reverse_list(lst):
    """
    Reverses the order of elements in the given list and returns the reversed list.
    """
    result = []
    for i in range(len(lst) - 1, -1, -1):
        result.append(lst[i])
    return result


def flatten_list(lst):
    """
    Flattens a nested list and returns a new list with all elements at the top level.
    """
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten_list(item))
        else:
            result.append(item)
    return result


def get_unique_elements(lst):
    """
    Returns a list containing only the unique elements from the given list.
    """
    result = []
    seen = []
    for item in lst:
        if item not in seen:
            result.append(item)
            seen.append(item)
    return result


def count_elements(lst):
    """
    Counts the occurrences of each element in the given list and returns a dictionary with the counts.
    """
    counts = {}
    for item in lst:
        if item in counts:
            counts[item] += 1
        else:
            counts[item] = 1
    return counts
