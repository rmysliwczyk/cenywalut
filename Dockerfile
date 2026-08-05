FROM node

COPY . /

RUN npm install

EXPOSE 8615

ENV PORT=8615
ENTRYPOINT ["node","index.js"]

