
#output "my_ids" {
#  value = data.aws_ami_ids.ubuntu.ids
#}

output "public_ip" {
#  value = [aws_instance.app_server1.public_ip,aws_instance.app_server2.public_ip,aws_instance.app_server3.public_ip,aws_instance.app_server4.public_ip,aws_instance.app_server5.public_ip]
#  value = [aws_instance.app_server1.public_ip]
  value = [aws_instance.app_servers[*]]




}
