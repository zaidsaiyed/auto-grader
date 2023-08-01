import csv

input_file_path = './softcheck_uploads/Test1.csv'
output_file_path = './softcheck_uploads/updated_data.csv'

file_path = './softcheck_uploads/grades.txt'

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
    csv_reader = csv.DictReader(csv_file)  
    
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
    csv_writer = csv.DictWriter(csv_file, fieldnames=headers)
    csv_writer.writeheader()
    csv_writer.writerows(data)