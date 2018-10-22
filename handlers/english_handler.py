from . import base_handler
from utils import googletrans
import tornado.ioloop


class EnglisWordCommithHandler(base_handler.BaseHandler):
    async def get(self, *args, **kwargs):
        en_word = self.get_argument("word")
        secure_key = self.get_argument("secure_key", "")
        if secure_key != "976447044":
            return self.write({"errcode": 1, "errmsg": "error"})
        trans = googletrans.Translator(service_urls=['translate.google.cn'])
        def query(word):
            return trans.translate(word, dest="zh-CN")
        result = await tornado.ioloop.IOLoop.current().run_in_executor(None, query, en_word)
        sound = result.extra_data.get('translation')[1][-1]
        data = result.text
        # print(result.extra_data)
        if result.extra_data.get('all-translations'):
            data = ','.join(result.extra_data.get('all-translations')[0][1])
        res = await self.query_sql("select * from tb_english_word where ew_en=%s", en_word)
        if len(res) == 0:
            await self.execute_sql("insert into tb_english_word(ew_en, ew_trans, ew_sound) values (%s, %s, %s)", en_word.lower(), data, sound)
        self.write({"word": en_word.lower(), "sound": sound,  "data_trans": data})


class EnglishWordPushHandler(base_handler.BaseHandler):
    async def get(self, *args, **kwargs):
        res = await self.query_sql("select ew_en,ew_trans,ew_sound from tb_english_word group by ew_en,ew_trans,ew_sound order by ew_en;")
        return_value = {}
        for i in range(len(res)):
            return_value[str(i)] = res[i]
        self.write(return_value)
