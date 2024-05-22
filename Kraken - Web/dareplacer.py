import os

files = [os.path.join(dp, f) for dp, dn, filenames in os.walk("components") for f in filenames]

def action(file):
    edit = False
    with open(file, 'r', encoding='utf-8') as filedata:
        lines = filedata.readlines()
        filedata.close()
    for _ in range(len(lines)):
        if "Cocopi" in lines[_]:
            if input(f"Replace : {lines[_].strip()} from {file} ?") == "y":
                lines[_] = lines[_].replace("Cocopi", "Kraken Bay")
                edit = True
        elif "cocopi" in lines[_]:
            if input(f"Replace : {lines[_].strip()} from {file} ?") == "y":
                lines[_] = lines[_].replace("cocopi", "kraken")
                edit = True
        else:
            pass
    if edit:
        with open(file, 'w', encoding="utf-8") as filedata:
            filedata.writelines(lines)
            filedata.close()

for file in files :
    try:
        action(file)
    except:
        print(f"error for {file}")

    
