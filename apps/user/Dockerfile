FROM node

WORKDIR /usr/src/userService

COPY ./apps/user .apps/user
COPY ./nest-cli.json .
COPY ./tsconfig.* .
COPY ./package*.json .
COPY .eslintrc.* .
COPY ./libs ./libs

RUN npm install

# COPY . .