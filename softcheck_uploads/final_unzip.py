import shutil
import os
import glob
import zipfile
import re
import sys
import time
import subprocess
from csv import DictReader
from csv import DictWriter

# Prevents the creation of .pyc files
sys.dont_write_bytecode = True


def sub_process():
    result2 = subprocess.run(
        ['python', 'final_unit_tests.py'], capture_output=True, text=True)
    if result2.stderr:
        return result2.stderr
    else:
        return result2.stdout


def process_grades(grades):
    # Process the grades obtained from unit tests
    grades = grades.split("\n")
    grades = grades[0]
    total_tests = len(grades)
    for i in grades:
        if i == "F":
            total_tests -= 1
        elif i == "E":
            total_tests -= 1
    grades = str(total_tests)
    return grades


def delete_zips(dir):
    # Delete all .zip files in the directory
    os.chdir(dir)
    student_zips = glob.glob("*.zip")
    for student_zip in student_zips:
        os.remove(student_zip)


def get_student_file(dir):
    # Get the student file from the directory
    os.chdir(dir)
    files = glob.glob("*")
    for i in files:
        if i.endswith(".py"):
            continue
    if os.path.isdir(i):
        get_student_file(i)


def return_main_dir():
    # Return to the main directory
    os.chdir("..")
    files = glob.glob("*.py")
    if files == []:
        return_main_dir()


def unzip_last_layer(file_path, target_dir):
    # Extract the contents of the last layer of the zip file to the target directory
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        zip_ref.extractall(target_dir)


def unzip_nested_zip(file_path, target_dir):
    # Extract the contents of the nested zip file to the target directory
    flag = False
    support_list = []

    while True:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            nested_zip_files = [
                f for f in zip_ref.namelist() if f.endswith('.zip')]

            if not flag:
                support_list.extend(nested_zip_files)

            if nested_zip_files:
                unzip_last_layer(file_path, target_dir)
                nested_zip_path = os.path.join(target_dir, nested_zip_files[0])
                file_path = nested_zip_path
                flag = True
            else:
                student_name = find_student_name(support_list[0])
                target_dir_stud = os.path.join(target_dir, student_name)
                unzip_last_layer(file_path, target_dir_stud)
                support_list = support_list[1:]
                if support_list:
                    file_path = f'{temp_dir}\\' + support_list[0]
                    flag = True
                else:
                    break


def find_student_name(zip_file):
    # Extract the student name from the zip file name
    student_name = None
    zip_file_basename = os.path.basename(zip_file)
    matches = re.findall(r"[A-Z][a-z]+", zip_file_basename)

    if len(matches) >= 2:
        student_name = " ".join(matches[:2])
    return student_name


def csv_update(courseId):
    input_file_path = f'{courseId}.csv'
    output_file_path = 'updated_data.csv'

    file_path = 'grades.txt'

    with open(file_path, 'r') as file:
        lines = [line.strip() for line in file]
        header_text = lines[0]
        assignment_name = header_text.split(',')[1].split(':')[1].strip()
        marks = lines[1:]
        elements = [element.split(',') for element in marks]
        new_dict = {}
        for element in elements:
            name = element[0]
            grade = element[1].strip()
            if grade == '':
                grade = 0
            grade = int(grade)
            key_val = {name: grade}
            new_dict.update(key_val)
        # print(new_dict)
        # print(f'this is from TXT {assignment_name}\n')

    data = []
    with open(input_file_path, 'r') as csv_file:
        csv_reader = DictReader(csv_file)

        for row in csv_reader:
            data.append(row)

        normal_data = list(csv_reader)
        headers = csv_reader.fieldnames
        list_of_assigments_draft = headers[3:len(headers)-1]
        list_of_assigments = []
        for i in list_of_assigments_draft:
            new_i = i.split(' Points')[0]
            if new_i == assignment_name:
                list_of_assigments.append(i)
        # print(f'\nThe assgn name u want to edit{list_of_assigments}')

        for row in data:
            student_name = row['First Name'] + " " + row['Last Name']
            # print(student_name)
            if student_name in new_dict.keys():
                new_dict_grade = new_dict[student_name]
                # print(f'From CVS {student_name}: From TXT {new_dict_grade}')
                row[list_of_assigments[0]] = new_dict_grade

        # print(f'\n\nFinal Updated data: {data}')

        with open(output_file_path, 'w', newline='') as csv_file:
            csv_writer = DictWriter(csv_file, fieldnames=headers)
            csv_writer.writeheader()
            csv_writer.writerows(data)


def find_course_name():
    with open("grades.txt", "r") as file:
        for line in file:
            if line.startswith("Course"):
                line = line.split(",")[0].strip()
                courseId = line.split(":")[1].strip()
                break
    file.close()
    return courseId


def delete_files_except_given(folder_path, files_to_keep):
    try:
        # Loop through all items (files and subfolders) in the folder
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)

            # Check if it's a file
            if os.path.isfile(item_path):
                # If it's a file and not in the list of files to keep, delete it
                if item not in files_to_keep:
                    os.remove(item_path)
                    print(f"Deleted file: {item}")

            # Check if it's a subfolder
            elif os.path.isdir(item_path):
                # Recursively call the function for the subfolder
                delete_files_except_given(item_path, files_to_keep)

        # After deleting unwanted files, check if the current folder is empty
        if not os.listdir(folder_path):
            # If the folder is empty, delete it
            shutil.rmtree(folder_path)
            print(f"Deleted folder: {folder_path}")

    except Exception as e:
        print(f"Error: {e}")


def copy_course_csv(course_id):
    try:
        # Source file path (assuming it is in the current directory)
        source_file = f"{course_id}.csv"
        os.chdir('..')
        target_dir = f"./courses/{course_id}"
        # Target file path in the target directory
        target_file = os.path.join(target_dir, f"{course_id}.csv")

        # Copy the file to the target directory
        shutil.copy(source_file, target_file)

        print(f"Successfully copied {source_file} to {target_file}")
        os.chdir('softcheck_uploads')
    except Exception as e:
        print(f"Error: {e}")


def rename_csv(course_id):
    os.remove(f'{course_id}.csv')
    os.rename('updated_data.csv', f'{course_id}.csv')


def generate_custom_output():
    folder_des = 'softcheck_uploads'

    current_directory = os.getcwd()  # Project directory

    folders = [item for item in os.listdir(
        current_directory) if os.path.isdir(item)]
    for f in folders:
        if f == folder_des:
            # print("found",f)
            os.chdir(f)
    root_destination_dir = os.getcwd()
    submission_directory = glob.glob("*.zip")

    # print(os.getcwd())
    os.makedirs(temp_dir, exist_ok=True)

    unzip_nested_zip(submission_directory[0], temp_dir)

    delete_zips(temp_dir)

    student_folders = glob.glob("*")

    destination_list = []
    grades_dict = {}
    for student_folder in student_folders:
        get_student_file(student_folder)
        destination_list.append(os.getcwd())
        # print(f"Running unit tests for student: {student_folder}")
        sys.path.append(os.getcwd())

        source_dir = os.getcwd()
        file_list = os.listdir(source_dir)
        for file_name in file_list:
            source_file = os.path.join(source_dir, file_name)
            destination_file = os.path.join(root_destination_dir, file_name)
            # print(source_file)
            # print(destination_file)
            shutil.copy(source_file, destination_file)

        return_main_dir()
        marks = sub_process()
        grades = process_grades(marks)
        grades_dict[student_folder] = grades
        # print(grades_dict)

        for file_name in file_list:
            os.remove(file_name)
            # print(file_name)
            time.sleep(1)
        # creating a text file for all grades and appending the grades to it in the format of student name grades

        with open("grades.txt", "a") as f:
            f.write(f"{student_folder}, {grades}\n")
            f.close()

        os.chdir(temp_dir)
    os.chdir('..')
    courseId = find_course_name()
    csv_update(courseId)
    rename_csv(courseId)
    copy_course_csv(courseId)
    folder_path = "softcheck_uploads"
    files_to_keep = [f"{courseId}.csv",
                     "stu_final_unit_tests.py", "final_unzip.py"]
    delete_files_except_given(folder_path, files_to_keep)
    return grades_dict

def run_code():
    # assignment_name = input("Enter assignment name: ")
    grades_dict = generate_custom_output()
    print(grades_dict)

temp_dir = "Temp_submissions"
run_code()