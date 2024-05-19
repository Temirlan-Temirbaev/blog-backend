FROM node

WORKDIR /usr/src/apiGateway

COPY ./apps/api .apps/api
COPY ./nest-cli.json .
COPY ./tsconfig.* .
COPY ./package*.json .
COPY .eslintrc.* .
COPY ./libs ./libs

RUN npm install

# COPY . .