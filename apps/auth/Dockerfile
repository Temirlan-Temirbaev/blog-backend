FROM node

WORKDIR /usr/src/authService

COPY ./apps/auth .apps/auth
COPY ./nest-cli.json .
COPY ./tsconfig.* .
COPY ./package*.json .
COPY .eslintrc.* .
COPY ./libs ./libs

RUN npm install

# COPY . .