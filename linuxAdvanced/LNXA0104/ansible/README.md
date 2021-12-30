Используется формат логов с именем logz, который содержит только информацию о том, откуда был произведен запрос, в какое время, какой был произведен запрос и какой HTTP код был возвращен при запросе.

log_format logz '$remote_addr - $time_local - $request - $status';  


Order allow,deny
Deny from 10.10.10.10
Allow from 127.0.0.1

LogFormat "%h - %t - %m - %s" logz
CustomLog ${APACHE_LOG_DIR}/xip.access.log logz


DocumentRoot /var/www/html
DirectoryIndex index.nginx-debian.html


https://timeweb.com/ru/community/articles/kak-ispolzovat-apache-v-kachestve-obratnogo-proksi-pri-pomoshchi-mod-proxy-na-ubuntu-16-04-1

<LocationMatch ^rbm_images/.*$>
DocumentRoot /var/www/html

</LocationMatch>



##	<Location "/example/">
##ProxyPass balancer://mycluster/search/
##ProxyPassReverse balancer://mycluster/search/
##	</Location>
