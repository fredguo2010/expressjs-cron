FROM node:18

# Create app directory
ENV HOME /RockiiApp

WORKDIR ${HOME}
ADD . $HOME

RUN npm config set registry https://registry.npm.taobao.org
RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
