FROM ubuntu:18.04

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN apt-get update && apt-get install python3 python3-pip python python-pip  -y && pip3 install --no-cache-dir -r requirements.txt -i http://pypi.douban.com/simple --trusted-host pypi.douban.com && pip install supervisor

