from prints import *
from hashlib import md5
import os
import json
hshs = json.loads('{ "data": []}')
folders = [_ for _ in os.walk("Assets") if len(_[1]) == 0 and len(_[2]) > 0]
for folder in folders:
    files = [os.path.join(folder[0], _) for _ in folder[2]]
    info(f"Folder {folders.index(folder)}/{len(folders)}", "discreet")
    for file in files:
        infor(f"File {files.index(file)}/{len(files)}", "discreet", True)
        if not os.path.exists(file):
            fail("not exist")
        elif not os.path.isfile(file):
            fail("not file")
        else :
            hsh = md5(open(file, 'rb').read()).hexdigest()
            hshs["data"].append({
                f"{os.path.join(folder[0], file)}": hsh
            })
    print()


with open("hashes.txt", "w", encoding="utf-8") as hashes:
    json.dump(hshs, hashes, indent=4, ensure_ascii=False)


info(len(hshs))


with open("hashes.txt", "r", encoding="utf-8") as hashes:
    data = hashes["data"]

folders = [_ for _ in os.walk("Assets") if len(_[1]) == 0 and len(_[2]) > 0]
for folder in folders:
    files = [os.path.join(folder[0], _) for _ in folder[2]]
    info(f"Folder {folders.index(folder)} + 1/{len(folders)}", "discreet")
    for file in files:
        infor(f"File {files.index(file) + 1}/{len(files)}", "discreet", True)
        if not os.path.exists(file):
            fail("not exist")
        elif not os.path.isfile(file):
            fail("not file")
        else :
            hsh = md5(open(file, 'rb').read()).hexdigest()
            if hsh != data[os.path.join(folder[0], file)]:
                fail(f"Different hash for {os.path.join(folder[0], file)}")
    print()