
#output "my_ids" {
#  value = data.aws_ami_ids.ubuntu.ids
#}

output "public_ip" {
  value = values(aws_instance.app_servers)[*].public_ip
}

output "private_ip" {
  value = values(aws_instance.app_servers)[*].private_ip
}
