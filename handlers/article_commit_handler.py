from . import base_handler
import constant
from utils import ab_utils
from . import commons

# 数据提交类


class ArticleCommitHandler(base_handler.BaseHandler):
    @commons.require_login
    async def post(self, *args, **kwargs):
        title = self.json_args.get("title")
        content = self.json_args.get('content')
        content_src = self.json_args.get('content_src')
        category = self.json_args.get('category')
        summary = self.json_args.get('summary')
        is_modify = self.json_args.get('is_modify')
        modify_id = self.json_args.get('modify_id')
        current_time = ab_utils.get_current_time()
        print(type(current_time))
        if not (title and content and content_src and category and summary):
            print('ArticleCommitHandler---必须参数缺失')
            return self.write({'errcode': 1, 'errmsg': '参数缺失'})

        if is_modify:

            try:
                res = await self.execute_sql('update tb_article set at_title=%s, at_content=%s, at_cate=%s, at_content_src=%s, at_summary=%s where id=%s',
                                       title, content, category, content_src, summary, modify_id)

                res_ct = await self.query_sql('select id, ct_title from tb_category where ct_title=%s', category)

                # 判断到没有这个类别的记录 存储
                if len(res_ct) == 0:
                    await self.execute_sql('insert into tb_category(ct_title) values (%s)', category)
                self.write({'errcode:': 0, 'errmsg:': res.statusmessage})
            except Exception as e:

                return self.write({"errcode": 1, "errmsg": "modify error"})
        else:
            try:
                # 查询标题是否唯一
                res_tmp = await self.query_sql('select count(*) from tb_article where at_title=%s', title)
                if res_tmp[0][0] != 0:

                    return self.write({'errmsg': '错误，存在相同的标题', 'errcode': 1})
                await self.execute_sql('insert into tb_article(at_title, at_content, '
                                       'at_cate, at_content_src, at_summary, at_create_time, at_update_time) '
                                       'values (%s, %s, %s, %s, %s, %s, %s)', title, content, category, content_src, summary, current_time, current_time)
                res_ct = await self.query_sql('select id, ct_title from tb_category where ct_title=%s', category)

                # 判断到没有这个类别的记录 存储
                if len(res_ct) == 0:
                    await self.execute_sql('insert into tb_category(ct_title) values (%s)', category)
                # 更新最近文章
                await self.execute_sql('insert into tb_recent_posts(rp_title, rp_update_time, rp_cate) '
                                       'values (%s, %s, %s)', title, current_time, category)
            except Exception as e:
                print('*************error***************：', e)
                self.write(constant.SUBMIT_ARTICLE_ERROR)
            else:
                self.write(constant.SUBMIT_ARTICLE_SUCCESS)


class ArticleDeleteHandler(base_handler.BaseHandler):
    @commons.require_login
    async def post(self, *args, **kwargs):
        # article_id = self.get_argument('article_id')
        article_id = self.json_args.get('article_id')
        if not article_id:
            print("article_id:", article_id)
            return self.write({'errmsg': '参数错误'})
        # 删除
        try:
            res = await self.execute_sql("delete from tb_recent_posts where rp_title=(select at_title from tb_article where id=%s)", article_id)
            print("删除tb_recent_posts数据，执行结果:", res.statusmessage, " id:", article_id)
            res = await self.execute_sql("delete from tb_article where id = %s", article_id)
            print("tb_article数据,执行结果:", res.statusmessage, " id:", article_id)
        except Exception as e:
            print("error:  ", e)
            self.write({"errcode": 1, "errmsg": "error "})
        else:
            self.write({"errcode": 0, "errmsg": "success"})


class CategoryModifyHandler(base_handler.BaseHandler):
    @commons.require_login
    async def post(self, *args, **kwargs):
        is_delete = self.get_argument('is_delete', False)
        category_id = self.json_args.get('category_id')
        new_category = self.json_args.get('new_category')
        if is_delete and category_id:
            res = await self.query_sql('select ct_title from tb_category where id = %s', category_id)

            category_title = res[0][0]

            res = await self.execute_sql("delete from tb_recent_posts where rp_cate=%s", category_title)
            print(res.statusmessage)
            res = await self.execute_sql("delete from tb_article where at_cate=%s", category_title)
            print(res.statusmessage)
            res = await self.execute_sql("delete from tb_category where ct_title=%s", category_title)
            print(res.statusmessage)
            self.write({"errcode": 0, "errmsg": "success, {}".format(res.statusmessage)})
        elif new_category:
            pass
        else:
            self.write({"errcode": 1, "errmsg": "error "})
