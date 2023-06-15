FROM node:18

WORKDIR /client

COPY ./ /client

RUN apt-get update && apt-get install -y xdg-utils

RUN npm install vite

RUN npm run build

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
