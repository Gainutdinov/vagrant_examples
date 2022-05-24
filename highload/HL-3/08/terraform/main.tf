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

resource "aws_subnet" "public" {
  for_each = var.public_subnet_numbers
  vpc_id            = aws_vpc.vpc.id
  availability_zone = each.key

  # 2,048 IP addresses each
  cidr_block = cidrsubnet(aws_vpc.vpc.cidr_block, 8, each.value)

  tags = {
    Name        = "cloudcasts-${each.value}-public-subnet"
    Project     = "cloudcasts.io"
    Role        = "public"
    ManagedBy   = "terraform"
    Subnet      = "${each.key}-${each.value}"
  }
}

resource "aws_key_pair" "mgainutdinov-keypair" {
  key_name   = "mgainutdinov-keypair"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2IBlB12yWzdoW0LHdjl97W7Me7v+aLUio7WxS2ZnK1C6gJmedRcQryK5JVZchwenErTx7AwvEvdNhCk+FGhjTBuAydlI/tPqg0N0ymueuimdky7Pbj9gIwMv7Ae2zVje0Svv0PflUUI0jvDzRZfoiq8XZ4qBhLJkMY32BLEp2GtfkAYrU8f2gn+uNMICOumEJ7q+8o8cxssn+O+/2BW7Yn2Wu9oBx94wqxnhWIxnZc6kU7Qs4vAG8FJdtNwqI9U96bmNDp+1Pnx/zUgVDo+aGuSna3FAztpzxN95/8Hydm0Ua13t0fI6nFRoFzSKNkOy8VUkRGKSdWXyVEJUgKhZR gainutdinov@atlas.ru"
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

resource "aws_security_group" "allow-http-ssh" {
  vpc_id      = aws_vpc.vpc.id
  description = "SSH and HTTP allow"            
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
  }
  ]
}

resource "aws_launch_template" "mgainutdinov-template" {
  name = "mgainutdinov-template"
  image_id = "ami-0cb4e786f15603b0d"
  instance_type = "t2.nano"
  key_name   = "mgainutdinov-keypair"

#  vpc_security_group_ids = [aws_security_group.allow-http-ssh.id]

  user_data = filebase64("${path.module}/example.sh")
  network_interfaces {
    associate_public_ip_address = true
    security_groups = [aws_security_group.allow-http-ssh.id]
#    subnet_id                   = aws_subnet.name1.id
#    delete_on_termination       = true 
  }

}

resource "aws_autoscaling_group" "scale-mgainutdinov" {
  name                      = "scale-mgainutdinov"
  desired_capacity          = 2
  min_size                  = 2
  max_size                  = 2

  launch_template {
    id      = aws_launch_template.mgainutdinov-template.id
    version = "$Latest"
  }
  vpc_zone_identifier       = [for s in aws_subnet.public: s.id]
  target_group_arns         = [aws_lb_target_group.mgainutdinov-target-group.arn]

#  placement_group           = aws_placement_group.test.id
}

resource "aws_lb_target_group" "mgainutdinov-target-group" {
  name     = "mgainutdinov-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id
}

resource "aws_lb" "mgainutdinov-elb" {
  name               = "mgainutdinov-elb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow-http-ssh.id]
  subnets            = [for s in aws_subnet.public: s.id]
}

resource "aws_lb_listener" "mgainutdinov_elb_listener" {
  load_balancer_arn = aws_lb.mgainutdinov-elb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.mgainutdinov-target-group.arn
  }
}
