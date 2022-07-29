#!/bin/bash

function addtofile() {
    echo "$1" >> my_hosts
}

rm my_hosts

cat "$(echo $PWD)/hosts.txt" | while read line; do
  case "$line" in
    haproxy*)
      addtofile "$(echo '[haproxyservers]' )"
      ;;
    etcd-1*)
      addtofile "$(echo '[etcdservers]' )"
      ;;
    pgbouncer-1*)
      addtofile "$(echo '[pgbouncerservers]' )"
      ;;
    pgsql-master*)
      addtofile "$(echo '[pgsqlservers]' )"
      ;;
  esac

  case "$line" in
    etcd*|pgbouncer*|pgsql-*|haproxy*)
      ansible_host=$(echo "$line" | cut -d '@' -f2 | cut -d ':' -f1 | cut -d ' ' -f1)
      ansible_password=$(echo "$line"  | cut -d ':' -f4)
      inventory_name=$(echo "$line"  | cut -d ' ' -f1)
      addtofile "$(echo "${inventory_name::-1} ansible_user=user ansible_host=${ansible_host} ansible_password=${ansible_password:1}" )"
      ;;
  esac

done
