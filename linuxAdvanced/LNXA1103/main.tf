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

#resource "digitalocean_ssh_key" "mysshKey" {
#  name       = "mgainutdinov"
#  public_key = file("/home/mgaynutdinov/.ssh/id_rsa.pub")
#}
data "digitalocean_ssh_key" "mysshKey" {
  name = "mgainutdinov"
}

## Create a new SSH key
#data "digitalocean_ssh_key" "myKey" {
#  name = "mgainutdinov"
#}

resource "digitalocean_volume" "disk1" {
  region                  = "fra1"
  name                    = "disk1"
  size                    = 20
  initial_filesystem_type = "ext4"
  description             = "an example volume1"
}

resource "digitalocean_volume" "disk2" {
  region                  = "fra1"
  name                    = "disk2"
  size                    = 20
  initial_filesystem_type = "ext4"
  description             = "an example volume2"
}

resource "digitalocean_volume" "disk3" {
  region                  = "fra1"
  name                    = "disk3"
  size                    = 20
  initial_filesystem_type = "ext4"
  description             = "an example volume3"
}

resource "digitalocean_volume" "disk4" {
  region                  = "fra1"
  name                    = "disk4"
  size                    = 20
  initial_filesystem_type = "ext4"
  description             = "an example volume4"
}

resource "digitalocean_volume_attachment" "disksattach1" {
  droplet_id = digitalocean_droplet.web[0].id
  volume_id  = digitalocean_volume.disk1.id
}

resource "digitalocean_volume_attachment" "disksattach2" {
  droplet_id = digitalocean_droplet.web[0].id
  volume_id  = digitalocean_volume.disk2.id
}

resource "digitalocean_volume_attachment" "disksattach3" {
  droplet_id = digitalocean_droplet.web[1].id
  volume_id  = digitalocean_volume.disk3.id
}

resource "digitalocean_volume_attachment" "disksattach4" {
  droplet_id = digitalocean_droplet.web[1].id
  volume_id  = digitalocean_volume.disk4.id
}

resource "digitalocean_droplet" "web" {
  count = var.instances_per_subnet 
  image    = "ubuntu-18-04-x64"
  name     = "${var.task_number}-${count.index}"
  region   = "FRA1"
  size     = "s-2vcpu-${var.ram_memory}gb"
  ssh_keys = [ 
    data.digitalocean_ssh_key.mentorsKey.id,
    data.digitalocean_ssh_key.mysshKey.id
  ]
  tags = [
    "m_gaynutdinov_at_mail_ru",
    "linux",
  ]
}

output "instance_ip_addr" {
  value = digitalocean_droplet.web[*].ipv4_address
}
