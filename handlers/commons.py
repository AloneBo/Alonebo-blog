import functools
from . import session


def require_login(fun):
    @functools.wraps(fun)
    async def wrapper(request_handler_obj, *args, **kwargs):
        # 调用get_current_user方法判断用户是否登录
        session_ = session.Session(request_handler_obj)
        await session_.init()
        if not session_.is_login:
            request_handler_obj.write(dict(errmsg="用户未登录", errcode=0))
        else:
            await fun(request_handler_obj, *args, **kwargs)
    return wrapper
