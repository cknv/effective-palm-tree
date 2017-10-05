data = [
    f'line:{i}\n'
    for i in range(500)
]

with open('input_file', 'w+') as fout:
    for each in data:
        fout.write(each)
