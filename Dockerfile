FROM registry.access.redhat.com/ubi8/nodejs-10
USER root
RUN mkdir -p /home/node/app/node_modules && chown -R root:root /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY --chown=root:root . .
RUN npm install
EXPOSE 3030
CMD [ "npm", "start" ]
