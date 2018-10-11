# -*- coding: utf-8 -*-

import logging

from qiniu import Auth, put_data


# 需要填写你的 Access Key 和 Secret Key
access_key = '3Q5gpimnj9sM7Muma-zQZ2S1FK5sTRI740l7Z7zZ'
secret_key = 'yU0gfym9Gq3GDPIiaLEa3zQS1ZXDa6w4Q9B4_IeE'
domain = "http://pfjlqfqib.bkt.clouddn.com"


def save_file_to_qiniu(file_name, file_data):
    
    try:
        # 构建鉴权对象
        q = Auth(access_key, secret_key)

        # 要上传的空间
        bucket_name = 'markdown-file'

        # 上传到七牛后保存的文件名
        # key = 'my-python-logo.png';
        # 生成上传 Token，可以指定过期时间等
        token = q.upload_token(bucket_name)

        # 要上传文件的本地路径
        # localfile = './sync/bbb.jpg'
        # ret, info = put_file(token, key, localfile)
        ret, info = put_data(token, file_name, file_data)
    except Exception as e:
        logging.error(e)
        raise e
    print(ret)
    print("*"*16)
    print('info:{}'.format(info))
    print(type(info))
    print(info.status_code)
    if 200 == info.status_code:
        return domain+'/'+ret["key"]
    else:
        raise Exception("上传失败")


if __name__ == "__main__":
    file_name = input("input file name")
    print(__file__)
    with open(file_name, "rb") as file:
        file_data = file.read()
        print(save_file_to_qiniu(file_name, file_data))