from python:3.9-slim

WORKDIR /app

COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .


RUN uvicorn main:app --host 0.0.0.0 --port 4003 --reload