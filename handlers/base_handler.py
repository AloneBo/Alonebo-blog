import tornado.web
import json


class BaseHandler(tornado.web.RequestHandler):

    def data_received(self, chunk):
        pass

    def prepare(self):
        """预解析数据，判断是否携带json是则提取"""
        if self.request.headers.get('Content-Type', '').startswith('application/json'):
            self.json_args = json.loads(self.request.body.decode())  # bytes->str decode()
        else:
            self.json_args = {}

    @property
    def postgreDB(self):
        return self.application.postgreDB

    @property
    def redisDB(self):
        return self.application.redisDB

    async def execute_sql(self, stmt, *args):
        with(await self.postgreDB.cursor()) as cur:
            await cur.execute(stmt, args)

            return cur

    async def query_sql(self, stmt, *args):
        with(await self.postgreDB.cursor()) as cur:
            await cur.execute(stmt, args)
            # async for row in cur:
            #     print(row)
            return await cur.fetchall()

    async def set_redis(self, key, value, expire_time=60*60*24):
        res = await self.redisDB.execute('set', key, value)
        await self.redisDB.execute('expire', key, expire_time)
        return res

    async def get_redis(self, key):
        return await self.redisDB.execute('get', key)

    async def delete_key(self, key):
        return await self.redisDB.execute('del', key)

