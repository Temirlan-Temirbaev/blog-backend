FROM node

WORKDIR /usr/src/imageService

COPY ./apps/image .apps/image
COPY ./nest-cli.json .
COPY ./tsconfig.* .
COPY ./package*.json .
COPY .eslintrc.* .
COPY ./libs ./libs

RUN npm install

# COPY . .