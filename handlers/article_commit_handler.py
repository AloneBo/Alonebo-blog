from . import base_handler
from utils import ab_utils
from . import commons


class ArticleCommitHandler(base_handler.BaseHandler):
    # 数据提交类
    @commons.require_login
    async def post(self, *args, **kwargs):
        title = self.json_args.get('title')
        content = self.json_args.get('content')
        category = self.json_args.get('category')
        summary = self.json_args.get('summary')
        is_modify = self.json_args.get('is_modify')
        modify_id = self.json_args.get('modify_id')
        current_time = ab_utils.get_current_time()
        if not (title and content and category and summary):
            return self.write({'errcode': 1, 'errmsg': '参数缺失'})
        if is_modify:
            try:
                await self.execute_sql('update tb_article set at_title=%s, at_content=%s, at_cate=%s, at_summary=%s where id=%s',
                                       title, content, category, summary, modify_id)
                self.write({'errcode:': 0, 'errmsg:': 'success'})
            except Exception as e:
                print(e)
                return self.write({"errcode": 1, "errmsg": "modify error"})
        else:
            try:
                # 查询标题是否唯一
                res_tmp = await self.query_sql('select count(*) from tb_article where at_title=%s', title)
                print(res_tmp)
                if res_tmp[0][0] != 0:
                    return self.write({'errmsg': '错误，存在相同的标题', 'errcode': 1})
                await self.execute_sql('insert into tb_article(at_title, at_content, '
                                       'at_cate, at_summary, at_create_time, at_update_time) '
                                       'values (%s, %s, %s, %s, %s, %s)', title, content, category, summary, current_time, current_time)
            except Exception as e:
                print('*************error***************：', e)
                self.write({"errcode": 1, "errmsg": "提交博文失败"})
            else:
                self.write({'errcode:': 0, 'errmsg:': 'success'})


class ArticleDeleteHandler(base_handler.BaseHandler):
    @commons.require_login
    async def post(self, *args, **kwargs):
        article_id = self.json_args.get('article_id')
        if not article_id:
            print("article_id:", article_id)
            return self.write({'errmsg': '参数错误', 'errcode': 1})
        # 删除
        try:
            res = await self.execute_sql("delete from tb_article where id = %s", article_id)
            print("tb_article数据,执行结果:", res.statusmessage, " id:", article_id)
        except Exception as e:
            print("error:", e)
            self.write({"errcode": 1, "errmsg": "删除失败"})
        else:
            self.write({"errcode": 0, "errmsg": "success"})


class CategoryModifyHandler(base_handler.BaseHandler):
    @commons.require_login
    async def post(self, *args, **kwargs):
        is_delete = self.get_argument('is_delete', False)
        category = self.json_args.get('category')
        new_category = self.json_args.get('new_category')
        if is_delete and category:
            res = await self.execute_sql("delete from tb_article where at_cate=%s", category)
            print(res.statusmessage)
            self.write({"errcode": 0, "errmsg": "success, {}".format(res.statusmessage)})
        elif new_category:
            pass
        else:
            self.write({"errcode": 1, "errmsg": "error"})
