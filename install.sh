function success() {
    echo -e "[\033[0;32m+\033[0m] $*"
}

function info() {
    echo -e "[\033[0;34mi\033[0m] $*"
}

function question() {
    echo -e "[\033[0;34m?\033[0m] $*"
}

function warning() {
    echo -e "[\033[0;33m!\033[0m] $*"
}

function fail() {
    echo -e "[\033[0;31m-\033[0m] $*"
}

info Begining CocoPi installation.

apt install npm -y
npm install -D tailwindcss postcss autoprefixer