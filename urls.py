from handlers import *
import tornado.web as web
import os


handlers = [
    (r'^/api/get_xsrf$', passport_handler.GetXSRF),  # 获取xsrf token
    (r'^/api/login$', passport_handler.LoginHandler),  # 登陆
    (r'^/api/check_login$', passport_handler.CheckLogin),  # 检查登陆
    (r'^/api/exit_login$', passport_handler.ExitLogin),  # 退出登陆
    (r'^/api/article_commit$', article_commit_handler.ArticleCommitHandler),  # 博文提交
    (r'^/api/get_article$', article_push_handler.GetArticle),  # 获取博文内容
    (r'^/api/get_recent_posts$', article_push_handler.GetRecentPosts),  # 获取最近博文
    (r'^/api/get_last_change_time$', article_push_handler.GetLastChangeTime),  # 最后更新时间
    (r'^/api/get_article_count$', article_push_handler.GetArticleCount),  # 博文数量
    (r'^/api/get_category$', article_push_handler.GetCategory),  # 博文类别
    (r'^/api/get_article_info$', article_push_handler.GetArticlesInfo),  # 博文详情
    (r'^/api/delete_article$', article_commit_handler.ArticleDeleteHandler),  # 删除博文
    (r'^/api/get_article_by_category$', article_push_handler.GetArticleByCategory),  # 根据类别获取博文
    (r'^/api/modify_category$', article_commit_handler.CategoryModifyHandler),  # 更改博文
    (r'^/api/markdown_file_commit$', file_commit_handler.MarkdownImageFileHandler),  # md格式上传 博文
    (r'^/api/english_word_commit$', english_handler.EnglisWordCommithHandler),  # 英语单词提交
    (r'^/api/english_word_push$', english_handler.EnglishWordPushHandler),  # 获取英语单词列表
    (r'^/api/search_article', article_push_handler.ArticleSearch),  # 查询博客
    # 静态文件配置 实际部署使用nginx
    (r'^/()$', web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "static_files"), \
                                       "default_filename": "index.html"}),
    (r"/(.*)", web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "static_files")}),
]