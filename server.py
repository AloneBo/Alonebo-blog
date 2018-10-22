import tornado.ioloop
import tornado.locks
import tornado.gen
import tornado.web
import aiopg
import psycopg2
import aioredis

from tornado.options import options, define

import config


define("port", default=config.port, help="run server by the given port", type=int)


async def initdb(db):
    try:
        with(await db.cursor()) as cur:
            await cur.execute("SELECT COUNT(*) FROM tb_user LIMIT 1")
            await cur.fetchone()
    except psycopg2.ProgrammingError:
        with open('schema.sql') as f:
            schema = f.read()
        with (await db.cursor()) as cur:
            await cur.execute(schema)


class Application(tornado.web.Application):
    def __init__(self, postgredb, redisdb):
        self.postgreDB = postgredb
        self.redisDB = redisdb
        handlers = config.handlers
        settings = config.settings
        super().__init__(handlers, **settings)


async def start():
    async with aiopg.create_pool(**config.postgreSetttings) as portgres_db:
        redis_db = await aioredis.create_pool("redis://"+config.REDIS_HOST)
        await initdb(portgres_db)
        options.parse_command_line()
        app = Application(portgres_db, redis_db)
        app.listen(options.port)
        shutdown_event = tornado.locks.Event()
        await shutdown_event.wait()

if __name__ == '__main__':
    tornado.ioloop.IOLoop.current().run_sync(start)

