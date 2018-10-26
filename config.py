import urls
handlers = urls.handlers

settings = dict(
    debug=True,
    cookie_secret='YOUR_KEY',
    xsrf_cookies=True
)

postgreSetttings = dict(
    host="localhost",  # if you run in docker, replace to postgres
    port=5432,
    user="postgres",
    password="alonebo",
    dbname="alonebo_blog",
)

SINGLE_PAGE_SIZE = 6

REDIS_HOST = "localhost" # if you run in docker, replace to redis

port = 8888
