## Blog with tornado

### 环境要求
Ubuntu 18.04
```shell
$ apt install redis
$ apt install postgresql
$ su
# passwd postgres
# exit
$ su postgres
$ psql
postgres=# alter user "postgres" with password 'alonebo';
postgres=# \q
```

表单图片上传格式：
{'editormd-image-file': [{'filename': 'not_found.jpg', 'body': b'\xff\x00\x00\x00\xdd\x7f\xff\xd9', 'content_type': 'image/jpeg'}]}
INFO:tornado.access:200 POST /api/markdown_file_commit?_xsrf=2|175b9008|d0c434d79a31791a0dc91aa5b805de1a|1537759234&guid=1537778663688 (::1) 19.66ms
INFO:tornado.general:/home/alonebo/PycharmProjects/MyBlog2/handlers/file_commit_handler.py modified; restarting server

