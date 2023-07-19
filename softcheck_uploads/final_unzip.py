import shutil
import os
import glob
import zipfile
import csv
import re
import sys
import time
import subprocess

# Prevents the creation of .pyc files
sys.dont_write_bytecode = True

def sub_process():
    result2 = subprocess.run(['python', 'final_unit_tests.py'], capture_output=True, text=True)
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
            nested_zip_files = [f for f in zip_ref.namelist() if f.endswith('.zip')]

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

# Delete this function
def update_grades_csv(grade_csv_file, assignment_name, student_name, grades):
    results_directory = "results"
    os.makedirs(results_directory, exist_ok=True)
    results_csv_file = os.path.join(results_directory, "results.csv")
    if not os.path.exists(results_csv_file):
        shutil.copy2(grade_csv_file, results_csv_file)

    header = []
    data = []

    with open(results_csv_file, "r") as csv_file:
        reader = csv.reader(csv_file)
        header = next(reader)
        assignment_position = None

        for idx, col in enumerate(header):
            if assignment_name.lower() in col.lower():
                assignment_position = idx
                break

        if assignment_position is None:
            print("Assignment name not found.")
            return

        for row in reader:
            name = row[2] + " " + row[1]
            if name == student_name:
                row[assignment_position] = grades[0]
            data.append(row)

    with open(results_csv_file, "w", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(header)
        writer.writerows(data)
    
    shutil.copy2(results_csv_file, grade_csv_file)

def generate_custom_output():
    folder_des = 'softcheck_uploads'
    
    current_directory = os.getcwd()
    folders = [item for item in os.listdir(current_directory) if os.path.isdir(item)]
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

        # grades_csv_file = "grades.csv"
        # update_grades_csv(grades_csv_file, assignment_name, student_folder, grades)

        for file_name in file_list:
            os.remove(file_name)
            #print(file_name)
            time.sleep(1)

        os.chdir(temp_dir)
        
    return grades_dict

def run_code():
    # assignment_name = input("Enter assignment name: ")
    grades_dict = generate_custom_output()
    print(grades_dict)
    
temp_dir = "Temp_submissions"
run_code()