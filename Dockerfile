#FROM ubuntu:latest
#LABEL authors="Owner"
#
#ENTRYPOINT ["top", "-b"]


#FROM node:latest as builder
#
#RUN mdkir -p /app
#
#WORKDIR /app
#
#COPY ..
#
#RUN npm install
#RUN npm run build --prod
#
#CMD ["npm","start"]
