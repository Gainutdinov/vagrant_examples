#!/usr/bin/sudo /bin/bash
cat <<EOT >> /etc/dhcp/dhcpd.conf
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.103 192.168.1.200;
  option routers 192.168.1.101;
  filename "boot/bios/pxelinux.0";
}
EOT

mkdir -p /srv/tftp/boot/bios/pxelinux.cfg
mkdir -p /srv/tftp/init

cat <<EOT >> /srv/tftp/boot/bios/pxelinux.cfg/default
MENU TITLE PXE System Installation

DEFAULT install
 LABEL install
  KERNEL ../../../vmlinuz
  INITRD ../../../initrd
  APPEND autoinstall ip=dhcp ds=nocloud-net;s=http://192.168.1.101/ubuntu-20.10-live-server-amd64.iso url=http:///192.168.1.101/ubuntu-server-20.10/
EOT
cp /usr/lib/PXELINUX/pxelinux.0 /srv/tftp/boot/bios/.
cp -R /usr/lib/syslinux/modules/bios/* /srv/tftp/boot/bios/.

cd /tmp
mkdir /tmp/iso_mount/
mount -o loop /tmp/ubuntu-20.10-live-server-amd64.iso /tmp/iso_mount/
cp -p /tmp/iso_mount/casper/vmlinuz /srv/tftp/init/
cp -p /tmp/iso_mount/casper/initrd /srv/tftp/init/
umount /tmp/iso_mount

cp /tmp/ubuntu-20.10-live-server-amd64.iso /var/www/html/
