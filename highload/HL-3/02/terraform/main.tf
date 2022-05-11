terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region  = "us-west-2"
}

## vpc.tf
resource "aws_vpc" "vpc" {
  cidr_block           = var.cidr_block
  tags = {
    Name = "${var.env}_vpc"
    Env  = var.env
  }
}
resource "aws_subnet" "subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.subnet
  availability_zone = "us-west-2c"
  map_public_ip_on_launch = "true"
  tags = {
    Name = "${var.env}_subnet"
    Env  = var.env
  }
}
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${var.env}_gw"
    Env  = var.env
  }
}
resource "aws_default_route_table" "route_table" {
  default_route_table_id = aws_vpc.vpc.default_route_table_id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
  tags = {
    Name = "default route table"
    env  = var.env
  }
}


resource "aws_key_pair" "mykey" {
  key_name   = "mykey"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2IBlB12yWzdoW0LHdjl97W7Me7v+aLUio7WxS2ZnK1C6gJmedRcQryK5JVZchwenErTx7AwvEvdNhCk+FGhjTBuAydlI/tPqg0N0ymueuimdky7Pbj9gIwMv7Ae2zVje0Svv0PflUUI0jvDzRZfoiq8XZ4qBhLJkMY32BLEp2GtfkAYrU8f2gn+uNMICOumEJ7q+8o8cxssn+O+/2BW7Yn2Wu9oBx94wqxnhWIxnZc6kU7Qs4vAG8FJdtNwqI9U96bmNDp+1Pnx/zUgVDo+aGuSna3FAztpzxN95/8Hydm0Ua13t0fI6nFRoFzSKNkOy8VUkRGKSdWXyVEJUgKhZR gainutdinov@atlas.ru"
}

resource "aws_instance" "app_servers" {

  for_each = {
    "VM1" = { vm_size = "t2.small" }
    "VM2" = { vm_size = "t2.micro" }
    "VM3" = { vm_size = "t2.small" }
#    "VM4" = { vm_size = "t2.medium" }
  }
  ami           = "ami-0892d3c7ee96c0bf7"
  instance_type = each.value.vm_size
  associate_public_ip_address = true
  subnet_id = aws_subnet.subnet.id
  key_name = "mykey"
  vpc_security_group_ids = [aws_security_group.mysecgroup.id]

  tags = {
    Name = each.key
  }

  root_block_device {
    volume_size = 25
  } 

  provisioner "file" {
    source      = "script.sh"
    destination = "/home/ubuntu/script.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "touch hello.txt",
      "echo helloworld remote ${each.key} provisioner >> hello.txt",
    ]
  }

#      "/bin/bash /home/ubuntu/script.sh",

  connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ubuntu"
      private_key = file("~/.ssh/id_rsa")
      timeout     = "4m"
   }
}

resource "aws_security_group" "mysecgroup" {
  vpc_id      = aws_vpc.vpc.id
  egress = [
    {
      cidr_blocks      = [ "0.0.0.0/0", ]
      description      = ""
      from_port        = 0
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "-1"
      security_groups  = []
      self             = false
      to_port          = 0
    }
  ]
 ingress                = [
   {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 22
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 22
  },
  {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 80
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 80
  },
  {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 9200
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 9200
  },
  {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 5601
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "tcp"
     security_groups  = []
     self             = false
     to_port          = 5601
  },
  {
     cidr_blocks      = [ "0.0.0.0/0", ]
     description      = ""
     from_port        = 0
     ipv6_cidr_blocks = []
     prefix_list_ids  = []
     protocol         = "-1"
     security_groups  = []
     self             = false
     to_port          = 0
  }
  ]
}
