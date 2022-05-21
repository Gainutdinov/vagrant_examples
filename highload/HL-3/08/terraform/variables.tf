#variable "subnet" {
#  default = "10.11.0.0/24"
#}
#
variable "cidr_block" {
  default = "10.11.0.0/16"
}
variable "env" {
  default = "k8s"
}

variable "public_subnet_numbers" {
  type = map(number)
  description = "Map of AZ to a number that should be used for public subnets"
  default = {
    "us-west-2a" = 1
    "us-west-2b" = 2
    "us-west-2c" = 3
  }
}

variable "vpc_cidr" {
  type        = string
  description = "The IP range to use for the VPC"
  default     = "10.0.0.0/16"
}
