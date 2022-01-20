

yum remove -y postgresql-contrib-10.17-2.module+el8.5.0+11838+8dca950a.x86_64 postgresql-server-10.17-2.module+el8.5.0+11838+8dca950a.x86_64 postgresql-10.17-2.module+el8.5.0+11838+8dca950a.x86_64
rm -rf /mnt/db/{db01,db02}


rm -f /etc/systemd/system/postgresql.service.d/override.conf
systemctl daemon-reload




