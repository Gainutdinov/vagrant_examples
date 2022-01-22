terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

#   module: linux
#   email: m_gaynutdinov_at_mail_ru
#   ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDNm4pL78YE6j9FTD6lGPzGIXl94q2118orskmYoSfr5qzZspXhhLlMu2Y9R20/8KVns1T8j9Q/fb9X33MtjuPRoNmz5LPIqoIYblbujdFqt+5vpz2YbfHPEBC5GrN2XHw4wFzyXCki5DaYC6Ktj2brJGUJomrIc2hwzK+wV2ncGLZv73E1+sDUdGuuLFeU60lvrK6fp03KN3Dyouc61RDPmG81omA5obcf4jBdA6FjoOpVq64XYqR0kzUhM2DXKsnagfkV9oFBfDdz3U+JZRz7ubR4iPtojq5LyQE8Ah3q2CDPxrEBKkJbglRoPBRQ0NGtyNH83HfIPZctkLMx8ja3

data "digitalocean_ssh_key" "mentorsKey" {
  name = "REBRAIN.SSH.PUB.KEY"
}

variable "do_token" {
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_ssh_key" "mysshKey" {
  name       = "mgainutdinov"
  public_key = file("/home/mgaynutdinov/.ssh/id_rsa.pub")
}

## Create a new SSH key
#data "digitalocean_ssh_key" "myKey" {
#  name = "mgainutdinov"
#}


resource "digitalocean_droplet" "web" {
  image    = "ubuntu-20-04-x64"
  name     = "first-task-1"
  region   = "FRA1"
  size     = "s-4vcpu-${var.ram_memory}gb"
  ssh_keys = [ 
    data.digitalocean_ssh_key.mentorsKey.id,
    digitalocean_ssh_key.mysshKey.id
  ]
  tags = [
    "m_gaynutdinov_at_mail_ru",
    "linux",
  ]
}

output "instance_ip_addr" {
  value = digitalocean_droplet.web.ipv4_address
}
