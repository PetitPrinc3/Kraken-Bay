#!/usr/bin/python3.10


################################################################################


# A simple python library to print things beautifully.
# This library is not licensed


################################################################################


from datetime import datetime

# Print green
def success(text, style = "classic", time = False):  
    
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[+]' + time + ' \033[92m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[92m\033[1m+\033[0m]' + time + ' ' + str(text)
    
    print(text)

# Print blue
def info(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[*]' + time + ' \033[94m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[94m\033[1m*\033[0m]' + time + ' ' + str(text)
    
    print(text)

# Print blue updating current row
def infor(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[*]' + time + ' \033[94m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[94m\033[1m*\033[0m]' + time + ' ' + str(text)
    
    print(text, end = '\r')

# Print orange
def warning(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[!]' + time + ' \033[93m' + str(text) + '\033[0m'
    elif style == 'discreet': text = '[\033[93m\033[1m!\033[0m]' + time + ' ' + str(text)

    print(text)

# Print red
def fail(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[-]' + time + ' \033[91m' + text + '\033[0m'
    elif style == 'discreet': text = '[\033[91m\033[1m-\033[0m]' + time + ' ' + str(text)

    print(text)

# Print ?
def question(text, style = "classic", time = False):
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[?]' + time + ' \033[94m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[94m\033[1m?\033[0m]' + time + ' ' + str(text)

    print(text)
    return input("[\033[94m\033[1m>\033[0m] ")

################################################################################


if __name__ == "__main__":
    success('Success !')
    success('Success, but discreet !', 'discreet')
    success('Success, but discreet, with time !', 'discreet', True)
    info('Info !')
    info('Info, but discreet !', 'discreet')
    info('Info, but discreet, with time !', 'discreet', True)
    warning('Warning !')
    warning('Warning, but discreet !', 'discreet')
    warning('Warning, but discreet, with time !', 'discreet', True)
    fail('Fail !')
    fail('Fail, but discreet !', 'discreet')
    fail('Fail, but discreet, with time !', 'discreet', True)
    q = question("What's what ?", 'discreet')
    info(q)

    exit()

