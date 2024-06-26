FROM node:20-buster

ENV PORT 80
EXPOSE 80

# add curl for healthcheck
# add tini for proper signal handling
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    # IRL use 'apt-cache policy <package-name>' to get installed versions
    # example: curl=7.64.0-4+deb10u2
    curl \
    tini \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g npm@latest

# have nodemon available for local dev use (file watching)
RUN npm install -g nodemon@2.*

# always copy in package dependencies and install them before copying in source code
# this ensures proper build layer caching and makes for faster re-builds
COPY package*.json ./

RUN npm ci \
 && npm cache clean --force \
 # move node_modules up a directory so they still work with bind-mounted code in development
 && mv /app/node_modules /node_modules

COPY . .

CMD ["tini", "--", "node", "server.js"]
