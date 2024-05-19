FROM node

WORKDIR /usr/src/commentService

COPY ./apps/comment .apps/comment
COPY ./nest-cli.json .
COPY ./tsconfig.* .
COPY ./package*.json .
COPY .eslintrc.* .
COPY ./libs ./libs


RUN npm install

# COPY . .