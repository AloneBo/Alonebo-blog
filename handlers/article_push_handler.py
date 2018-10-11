from . import base_handler
import config

# 数据推送类


class GetArticle(base_handler.BaseHandler):
    """
        获取文章处理逻辑 下面是请求接口参数
        /api/get_article_count?[name=android]
        /api/get_article_count?[page_index=1]&[page_size=3]
    """
    async def get(self, *args, **kwargs):
        name = self.get_argument("article", "")
        page_index = self.get_argument('page_index', "")  # 请求第几页文章 一页默认6篇文章
        page_size = self.get_argument('page_size', config.SINGLE_PAGE_SIZE)  # 每次请求多少篇文章
        article_id = self.get_argument('article_id', 0)  #
        try:
            page_size = int(page_size)
        except Exception as e:
            print("*****error***", e)
        print(name)
        if name != "":
            # 传递了name参数 则表示请求哪一篇文章
            res = await self.query_sql("select id, at_content,at_cate,at_content_src, "
                                       "at_update_time, at_create_time, at_title,"
                                       " at_summary from tb_article where at_title=%s", name)
            return_value = {}
            for i in range(len(res)):
                row = res[i]

                return_value[str(i)] = {'id': row[0], 'cate': row[2],
                                        'content_src': row[3], 'update_time': str(row[4]), 'title': row[6],
                                        'summary': row[7]}
            self.write(return_value)
        elif page_index != "":
            # 传递了参数请求页数
            count = await self.query_sql("select count(*) from tb_article")
            count = count[0][0]
            count = int(count)
            page_index = int(page_index)
            # 如果传递的是第一页 应该从 数据库size-(page_size*page_index) 开始查找
            offset = count - (page_size * page_index)  # 13 - (6*1) = 7
            print("offset: ", offset)
            if offset < 0:
                page_size = page_size-(-offset)
                offset = 0
            print("offset: ", offset, ";", page_size)
            res = await self.query_sql("select id, at_content,at_cate,at_content_src, "
                                       "at_update_time, at_create_time, at_title, at_summary from "
                                       "tb_article order by at_update_time limit %s offset %s", page_size, offset)
            return_value = {}
            count = len(res)
            for i in range(count):
                print(i)
                row = res[(count-1)-i]
                #
                # return_value[str(i)] = {'id': row[0], 'content': row[1], 'cate': row[2],
                #                         'content_src': row[3], 'update_time': str(row[4]), 'title': row[6],
                #                         'summary': row[7]}
                return_value[str(i)] = {'id': row[0], 'cate': row[2],
                                        'content_src': row[3], 'update_time': str(row[4]), 'title': row[6],
                                        'summary': row[7]}
            self.write(return_value)
        elif article_id != 0:
            print("article_id befor: {}".format(article_id))
            try:
                article_id = int(article_id)
                print("article_id: {}".format(article_id))
            except Exception as e:
                print('error: {}'.format(e))
                return self.write({'errmsg': '参数id错误:'+str(article_id), 'errcode': 1})
            else:

                res = await self.query_sql("select id, at_content,at_cate,at_content_src, "
                                       "at_update_time, at_create_time, at_title, at_summary "
                                       "from tb_article where id = %s", article_id)
                if len(res) == 1:
                    self.write({'id': res[0][0], 'content': res[0][1], 'cate': res[0][2],
                                            'content_src': res[0][3], 'update_time': str(res[0][4]), 'title': res[0][6],
                                            'summary': res[0][7], 'errcode': 0})
                else:
                    self.write({'errmsg': '内部错误', 'errcode': 1})

        else:
            # 返回全部的文章逻辑
            res = await self.query_sql("select id, at_content,at_cate,at_content_src, "
                                       "at_update_time, at_create_time, at_title, at_summary "
                                       "from tb_article order by at_update_time desc")

            return_value = {}
            for i in range(len(res)):
                row = res[i]

                return_value[str(i)] = {'id': row[0], 'content': row[1], 'cate': row[2],
                                        'content_src': row[3], 'update_time': str(row[4]), 'title': row[6], 'summary': row[7]}

            self.write(return_value)


class GetRecentPosts(base_handler.BaseHandler):
    """
    获取最近更新的文章
    """
    async def get(self, *args, **kwargs):
        try:
            res = await self.query_sql("select id, at_title, at_update_time, at_cate from tb_article order by at_update_time desc")
            return_value = {}
            print(res)
            loop_value = len(res)
            if len(res) > 8:
                loop_value = 8
            for i in range(loop_value):
                row = res[i]
                return_value[str(i)] = {'id': row[0], 'title': row[1], 'create_time': str(row[2])}

            self.write(return_value)
        except Exception as e:
            print('error:', e)
            return self.write({'errcode': 1, 'errmsg': '获取失败'})


class GetLastChangeTime(base_handler.BaseHandler):
    """
    获取最后的更新时间
    """
    async def get(self, *args, **kwargs):
        res = await self.query_sql(
            "select id, at_title, at_update_time, at_cate from tb_article order by at_update_time desc")
        if len(res) != 0:

            return_value = {'last_change_time': str(res[0][2])}
            print(str(return_value))
            self.write(return_value)
        else:
            self.write({'error': '找不到数据'})


class GetArticleCount(base_handler.BaseHandler):
    """
    获取文章的篇数
    """
    async def get(self, *args, **kwargs):
        try:
            res = await self.query_sql("select count(*) from tb_article")
        except Exception as e:
            print("******error****", e)
        # print(res)
        if res:
            self.write({"article_count": res[0][0]})
        else:
            self.write({"article_count": 0})


class GetCategory(base_handler.BaseHandler):
    """
    获取所有类别的项目
    """
    async def get(self, *args, **kwargs):
        row_data = self.get_argument('row_data', False)
        if row_data:
            try:
                result = await self.query_sql("select tb_category.id, count(at_cate),ct_title from tb_category left join  tb_article on at_cate=ct_title group by ct_title,tb_category.id order by tb_category.id")
            except Exception as e:
                print("****error****", e)
                return self.write({'errmsg': 'error', 'errcode': 1})
            else:
                return_value = {}
                for i in range(len(result)):
                    row = result[i]
                    return_value[str(i)] = {'category_count': row[1], 'category_title': row[2], 'category_id': row[0]}

                self.write(return_value)
        else:
            try:
                result = await self.query_sql("select count(*),at_cate from tb_article inner join tb_category on at_cate=ct_title group by at_cate")
                print('start')
                print(result)
            except Exception as e:
                print("****error****", e)
            return_value = {}
            for i in range(len(result)):
                row = result[i]
                return_value[str(i)] = {'category_count': row[0], 'category_title': row[1]}

            self.write(return_value)


class GetArticlesInfo(base_handler.BaseHandler):
    """
    获取博客 根据page_index
    """
    async def get(self, *args, **kwargs):
        page_index = self.get_argument('page_index', "")
        if page_index != "":
            try:
                page_index = int(page_index)
            except Exception as e:
                print("error:", e)
                page_index = 1
            count = await self.query_sql("select count(*) from tb_article")
            count = count[0][0]
            count = int(count)
            page_size = config.SINGLE_PAGE_SIZE * 2
            # 如果传递的是第一页 应该从 数据库size-(page_size*page_index) 开始查找
            offset = count - (page_size * page_index)  # 10 - (6*2) = -2
            if offset < 0:  # 如果这一页不够 应该从
                page_size = page_size - (-offset)
                offset = 0
            res = await self.query_sql("select id, at_title from tb_article order by at_update_time desc limit %s offset %s", page_size, offset)
            return_value = {}
            for i in range(len(res)):
                row = res[i]
                return_value[str(i)] = {'id': row[0], 'title': row[1]}
            self.write(return_value)
        else:
            res = await self.query_sql("select id, at_title from tb_article order by at_update_time desc")
            return_value = {}
            for i in range(len(res)):
                row = res[i]
                return_value[str(i)] = {'id': row[0], 'title': row[1]}
            self.write(return_value)


class GetArticleByCategory(base_handler.BaseHandler):
    async def get(self, *args, **kwargs):
        category = self.get_argument('category', '')
        if category == '':
            return self.write({'errmsg': '参数category错误', 'errcode': 1})
        try:
            res = await self.query_sql("select id, at_update_time, at_title, at_cate from tb_article where at_cate = %s order by at_update_time desc", category)
            return_value = {}
            for i in range(len(res)):
                row = res[i]
                return_value[str(i)] = {'id': row[0], 'update_time': str(row[1]), 'title': row[2], 'category': row[3]}
            self.write(return_value)
        except Exception as e:
            print('error: {}'.format(e))