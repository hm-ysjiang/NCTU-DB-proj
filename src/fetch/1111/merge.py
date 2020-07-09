import data
import os

if __name__ == '__main__':
    d_fn = data.d_fn
    path = os.path.dirname(os.path.realpath(__file__)) + '/result'
    with open(path + '/joball.csv', 'w') as out:
        out.write('job_id,com_id,pos_id,area_id\n')
        for f, n in d_fn.values():
            print(f'{f}/{n}')
            with open(path + f'/{f}/{n}.csv', 'r') as _in:
                for idx, line in enumerate(_in.readlines()):
                    if idx:
                        out.write(line)
