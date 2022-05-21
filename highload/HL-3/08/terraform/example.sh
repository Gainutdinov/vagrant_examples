#!/bin/bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

docker run -d -p 80:80 nginxdemos/hello:0.2
