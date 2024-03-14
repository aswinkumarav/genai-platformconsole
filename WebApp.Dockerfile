# FROM node:20-alpine AS frontend  

# WORKDIR /app

# COPY . .

# RUN npm ci
# RUN npm run build

# COPY --from=frontend /app/dist .

# FROM python:3.11-alpine  

# WORKDIR /code

# COPY requirements.txt .

# RUN pip install --no-cache-dir --upgrade -r requirements.txt

# EXPOSE 8000

# CMD ["gunicorn", "app:app"]


FROM node:20-alpine AS frontend  
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app 
COPY ./package*.json ./  
USER node
RUN npm ci  
COPY --chown=node:node ./ ./  
COPY --chown=node:node ./dist/ ./dist  
WORKDIR /home/node/app
RUN npm run build
  
FROM python:3.11-alpine 



COPY requirements.txt /usr/src/app/  
RUN pip install --no-cache-dir -r /usr/src/app/requirements.txt
  
COPY . /usr/src/app/  
COPY --from=frontend /home/node/app/dist  /usr/src/app/dist/
WORKDIR /usr/src/app  
EXPOSE 8000
CMD ["gunicorn", "app:app"]  
