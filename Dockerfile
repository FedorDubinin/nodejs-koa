FROM node:carbon as build

ADD ./package*.json /opt/
RUN cd /opt && npm install --no-color --production

ADD ./ /opt/

FROM node:carbon-alpine
COPY --from=build /opt/ /opt/

ADD ./ /opt/

WORKDIR /opt/

CMD ["npm", "start"]