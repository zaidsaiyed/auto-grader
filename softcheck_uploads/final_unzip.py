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

def csv_update():
    input_file_path = 'Test1.csv'
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
            key_val = {name:grade}
            new_dict.update(key_val)
        #print(new_dict)
        #print(f'this is from TXT {assignment_name}\n')
            
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
        #print(f'\nThe assgn name u want to edit{list_of_assigments}')
    
        for row in data:
            student_name = row['First Name'] + " " + row['Last Name']
            #print(student_name)
            if student_name in new_dict.keys():
                new_dict_grade = new_dict[student_name]
                #print(f'From CVS {student_name}: From TXT {new_dict_grade}')
                row[list_of_assigments[0]] = new_dict_grade

                
        #print(f'\n\nFinal Updated data: {data}')

        with open(output_file_path, 'w', newline='') as csv_file:
            csv_writer = DictWriter(csv_file, fieldnames=headers)
            csv_writer.writeheader()
            csv_writer.writerows(data)




def generate_custom_output():
    folder_des = 'softcheck_uploads'
    
    current_directory = os.getcwd() # Project directory
    
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

        for file_name in file_list:
            os.remove(file_name)
            #print(file_name)
            time.sleep(1)
        # creating a text file for all grades and appending the grades to it in the format of student name grades
        
        with open("grades.txt", "a") as f:
            f.write(f"{student_folder}, {grades}\n")
            f.close()
            
        
        csv_update()
        os.chdir(temp_dir)
        
    return grades_dict

def run_code():
    # assignment_name = input("Enter assignment name: ")
    grades_dict = generate_custom_output()
    print(grades_dict)
    
temp_dir = "Temp_submissions"
run_code()