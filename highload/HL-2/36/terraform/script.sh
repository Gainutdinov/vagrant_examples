#!/bin/bash
# Ask for the user password
# Script only works if sudo caches the password for a few minutes
sudo true

swapoff -a; sed -i '/swap/d' /etc/fstab

sleep 120
sudo apt update

sleep 10
sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common




sleep 10
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt update
sleep 10
sudo apt install -y docker-ce=5:19.03.10~3-0~ubuntu-focal containerd.io

sleep 10
https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list

sudo apt update 
sleep 10
sudo apt install -y kubeadm=1.19.2-00 kubelet=1.19.2-00 kubectl=1.19.2-00


