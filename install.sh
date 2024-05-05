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
npm install -D tailwindcss postcss autoprefixer prisma @prisma/client next next-auth bcrypt @types/bcrypt
npm install -D react-icons @types/lodash
npm install axios swr lodash zustand

# DB : A essayer

apt install mongodb
systemctl start mongod.service
systemctl enable mongod.service

mongo
use test
db.createUser( { user: "cocopi", pwd: "cocopi", roles: ["readWrite"] })

npx prisma db push #Pousse les models de schema.prisma vers la db dans .env

docker build -t mongo Docker #Docker pour réplication de la db pour prisma