variable "ram_memory" {
  type    = number
  default = 4
}

variable "task_number" {
  type    = string
}

variable "instances_per_subnet" {
  description = "Number of EC2 instances in each private subnet"
  type        = number
}
