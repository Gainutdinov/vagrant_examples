terraform {
  required_version = "~> 1.0.0"
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "> 2.0"
    }
  }
}

#   module: linux
#   email: m_gaynutdinov_at_mail_ru
#   ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDNm4pL78YE6j9FTD6lGPzGIXl94q2118orskmYoSfr5qzZspXhhLlMu2Y9R20/8KVns1T8j9Q/fb9X33MtjuPRoNmz5LPIqoIYblbujdFqt+5vpz2YbfHPEBC5GrN2XHw4wFzyXCki5DaYC6Ktj2brJGUJomrIc2hwzK+wV2ncGLZv73E1+sDUdGuuLFeU60lvrK6fp03KN3Dyouc61RDPmG81omA5obcf4jBdA6FjoOpVq64XYqR0kzUhM2DXKsnagfkV9oFBfDdz3U+JZRz7ubR4iPtojq5LyQE8Ah3q2CDPxrEBKkJbglRoPBRQ0NGtyNH83HfIPZctkLMx8ja3


variable "do_token" {
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "web" {
  image    = "ubuntu-20-04-x64"
  name     = "first-task-1"
  region   = "FRA1"
  size     = "s-2vcpu-4gb"
  ssh-keys = [ 
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDNm4pL78YE6j9FTD6lGPzGIXl94q2118orskmYoSfr5qzZspXhhLlMu2Y9R20/8KVns1T8j9Q/fb9X33MtjuPRoNmz5LPIqoIYblbujdFqt+5vpz2YbfHPEBC5GrN2XHw4wFzyXCki5DaYC6Ktj2brJGUJomrIc2hwzK+wV2ncGLZv73E1+sDUdGuuLFeU60lvrK6fp03KN3Dyouc61RDPmG81omA5obcf4jBdA6FjoOpVq64XYqR0kzUhM2DXKsnagfkV9oFBfDdz3U+JZRz7ubR4iPtojq5LyQE8Ah3q2CDPxrEBKkJbglRoPBRQ0NGtyNH83HfIPZctkLMx8ja3",
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2IBlB12yWzdoW0LHdjl97W7Me7v+aLUio7WxS2ZnK1C6gJmedRcQryK5JVZchwenErTx7AwvEvdNhCk+FGhjTBuAydlI/tPqg0N0ymueuimdky7Pbj9gIwMv7Ae2zVje0Svv0PflUUI0jvDzRZfoiq8XZ4qBhLJkMY32BLEp2GtfkAYrU8f2gn+uNMICOumEJ7q+8o8cxssn+O+/2BW7Yn2Wu9oBx94wqxnhWIxnZc6kU7Qs4vAG8FJdtNwqI9U96bmNDp+1Pnx/zUgVDo+aGuSna3FAztpzxN95/8Hydm0Ua13t0fI6nFRoFzSKNkOy8VUkRGKSdWXyVEJUgKhZR mgaynutdinov@mgaynutidnov-pc"
  ]
  tags = [
    "m_gaynutdinov_at_mail_ru",
    "linux",
  ]
}
