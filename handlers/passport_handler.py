from . import base_handler
import constant
from . import session


class LoginHandler(base_handler.BaseHandler):
    async def post(self, *args, **kwargs):
        """登陆请求"""
        user_name = self.json_args.get("user_name")
        user_passwd = self.json_args.get("user_passwd")
        print(user_name)
        if not user_name or not user_passwd:
            return self.write({"errcode": 0, "errmsg": "参数缺失"})
        try:
            res = await self.query_sql("select id, u_name, u_passwd from tb_user where u_name=%s", user_name)
            print(res)
            print("*" * 20)
        except Exception as e:
            print("***error***", e)
            return self.write({"errmsg": "查询数据库失败", "errcode": 1})
        if res:
            res = await self.query_sql("select id, u_name, u_passwd from tb_user where u_passwd=%s", user_passwd)
            if res:
                # 登陆成功 保存状态
                print("login success")
                session_ = session.Session(self)
                await session_.init()
                data = {"user_name": user_name}
                await session_.save(data)
                return self.write(constant.LOGIN_SUCCESS)
        else:
            self.write(constant.LOGIN_ERROR)
            return self.write({"errmsg": "查询数据库失败", "errcode": 1})


class CheckLogin(base_handler.BaseHandler):
    async def get(self, *args, **kwargs):
        session_id = self.get_secure_cookie(constant.SESSION_ID)  # 从浏览器获取cookie
        if session_id:
            try:
                res = await self.get_redis(session_id)
                if res:
                    self.write(constant.LOGINED)
                else:
                    self.write(constant.NOT_LOGINED)
            except Exception as e:
                print(e)
        else:
            print("session_id not true")
            self.write(constant.NOT_LOGINED)


class ExitLogin(base_handler.BaseHandler):
    async def get(self, *args, **kwargs):
        print("clear....")
        redis_key = self.get_secure_cookie(constant.SESSION_ID)
        try:
            await self.delete_key(redis_key)
        except Exception as e:
            print(e)
        self.clear_cookie(constant.SESSION_ID)
        self.write({"errcode": 0, "errmsg": "ok"})


class GetXSRF(base_handler.BaseHandler):
    def get(self, *args, **kwargs):
        self.xsrf_token
        self.xsrf_form_html()

