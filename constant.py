LOGIN_ERROR_CODE = 401
LOGIN_SUCCESS_CODE = 200
LOGGINED_code = 0
NOT_LOGGINED_code = 1

LOGIN_ERROR = {"errcode": LOGIN_ERROR_CODE, "err_msg": "登陆错误"}
LOGIN_SUCCESS = {"errcode": LOGIN_SUCCESS_CODE, "err_msg": "登陆成功"}
LOGINED = {"errcode": LOGGINED_code, "err_msg": "已经登陆"}
NOT_LOGINED = {"errcode": NOT_LOGGINED_code, "err_msg": "没有登陆"}
SUBMIT_ARTICLE_SUCCESS = {"errcode": 0, "err_msg": "提交成功"}
SUBMIT_ARTICLE_ERROR = {"errcode": 1, "err_msg": "提交失败"}

SESSION_ID = "SESSION_ID"
