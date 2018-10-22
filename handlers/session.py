import uuid
import constant
import json


class Session(object):
    """必须调用init方法"""
    def __init__(self, request_handler):
        self.__request_handler = request_handler
        self.__session_id = request_handler.get_secure_cookie(constant.SESSION_ID)  # 获取浏览器登陆的cookie标记
        self.__is_login = True  # 是否登陆
        self.user_data = {}
        if self.__session_id:
            self.__is_login = True  # 可能是以前遗留的cookie 这个并不是最终结果
        else:
            self.__is_login = False
            self.__session_id = uuid.uuid4().hex

    # 这个初始化方法必须调用
    async def init(self):
        if self.__is_login:  # 从用户那里找到了登陆的cookie 如果都没有传递cookie 那么不用判断
            try:
                res = await self.__request_handler.get_redis(self.__session_id)  # 从redis数据库里面拿
                # print("res0000:", res) -》 b'{"user_name": "alonebo"}'
                if res:
                    self.__is_login = True  # 又从redis里面找到了数据 标识为登陆了的用户
                else:
                    self.__is_login = False

            except Exception as e:
                print(e)
            else:
                self.user_data = await self.__request_handler.get_redis(self.__session_id)

    async def save(self, user_data):
        """保存用户状态"""
        if self.__is_login:  # 存在session
            print("has login")
        else:
            print("not login")
            self.__request_handler.set_secure_cookie(constant.SESSION_ID, self.__session_id)
            await self.__request_handler.set_redis(self.__session_id, json.dumps(user_data))

    @property
    def is_login(self):
        return self.__is_login

