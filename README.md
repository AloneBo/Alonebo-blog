## Blog with tornado

手动部署

```shell
$ apt install redis
$ apt install postgresql
$ su
# passwd postgres
# exit
$ su postgres
$ psql
postgres=# alter user "postgres" with password 'alonebo';
```

使用Docker部署

安装Docker以及Docker-compose
```
docker-compose up
```

将会部署到主机的三个端口`8000`、`8001`、`8002`

![demo01](https://github.com/AloneBo/Alonebo-blog/blob/master/blogdemo01.png)

