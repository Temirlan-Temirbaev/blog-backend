FROM node

WORKDIR /usr/src/postService

COPY ./apps/post .apps/post
COPY ./nest-cli.json .
COPY ./tsconfig.* .
COPY ./package*.json .
COPY .eslintrc.* .
COPY ./libs ./libs


RUN npm install

# COPY . .