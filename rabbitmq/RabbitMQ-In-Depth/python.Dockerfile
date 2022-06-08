FROM python:3.6.10-buster
WORKDIR /notebooks
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN apt update && apt install libgl1 -y
EXPOSE 8888 8883
