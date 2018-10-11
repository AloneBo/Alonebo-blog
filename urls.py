from handlers import *
import tornado.web as web
import os


handlers = [
    (r'^/api/get_xsrf$', passport_handler.GetXSRF),
    (r'^/api/login$', passport_handler.LoginHandler),
    (r'^/api/check_login$', passport_handler.CheckLogin),
    (r'^/api/exit_login$', passport_handler.ExitLogin),
    (r'^/api/article_commit$', article_commit_handler.ArticleCommitHandler),
    (r'^/api/get_article$', article_push_handler.GetArticle),  # 获取文章内容
    (r'^/api/get_recent_posts$', article_push_handler.GetRecentPosts),  #
    (r'^/api/get_last_change_time$', article_push_handler.GetLastChangeTime),  #
    (r'^/api/get_article_count$', article_push_handler.GetArticleCount),  #
    (r'^/api/get_category$', article_push_handler.GetCategory),  #
    (r'^/api/get_article_info$', article_push_handler.GetArticlesInfo),  #
    (r'^/api/delete_article$', article_commit_handler.ArticleDeleteHandler),  #
    (r'^/api/get_article_by_category$', article_push_handler.GetArticleByCategory),  #
    (r'^/api/modify_category$', article_commit_handler.CategoryModifyHandler),  #
    (r'^/api/markdown_file_commit$', file_commit_handler.MarkdownImageFileHandler),  #
    (r'^/api/english_word_commit$', english_handler.EnglisWordCommithHandler),  #
    (r'^/api/english_word_push$', english_handler.EnglishWordPushHandler),  #
    # 静态文件配置 实际部署使用nginx
    (r'^/()$', web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "static_files"), \
                                       "default_filename": "index.html"}),
    (r"/(.*)", web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "static_files")}),
]