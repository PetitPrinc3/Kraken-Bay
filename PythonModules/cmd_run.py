from .prints import *
import subprocess

def cmd_run(cmd, succ = "", err = "", critical = False):
    try:
        if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=300) != 0:
            warning('Process failed once. Trying again.')
            try:
                if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                    fail('Process failed. This is critical.                                                  ')
                    if err != "" : warning(err)
                    if critical: exit()
                    return 1
            except subprocess.TimeoutExpired:
                    fail('Command timed out. This is critical.                                               ')
                    if err != "" : warning(err)
                    if critical: exit()
                    return 1
    except subprocess.TimeoutExpired:
        warning('Command timed out. Trying again.')
        try:
            if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                fail('Process failed. This is critical.')
                if err != "" : warning(err)
                if critical: exit()
                return 1
        except subprocess.TimeoutExpired:
                fail('Command timed out twice. This is critical.')
                if err != "" : warning(err)
                if critical: exit()
                return 1
    if succ != "" : success(succ)
    return 0