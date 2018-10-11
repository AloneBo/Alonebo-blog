import urls
import os
handlers = urls.handlers

settings = dict(
    debug=True,
    cookie_secret='YBf4Uh22Syii/bCbfo3vSQ5XPKUs5EAngmNU3kesnbU=',
    xsrf_cookies=True
)

postgreSetttings = dict(
    host="0.0.0.0",
    port=5432,
    user="postgres",
    password="alonebo",
    dbname="alonebo_blog",
)

SINGLE_PAGE_SIZE = 6

REDIS_HOST = "localhost"

port = 8888
