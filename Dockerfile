FROM node:16.17.0 AS development

RUN apt update

WORKDIR /supermovies/src/app

RUN mkdir node_modules

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3001
