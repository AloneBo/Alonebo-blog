# -*- coding: utf-8 -*-
# flake8: noqa
from qiniu import Auth
from qiniu import BucketManager
access_key = '3Q5gpimnj9sM7Muma-zQZ2S1FK5sTRI740l7Z7zZ'
secret_key = 'yU0gfym9Gq3GDPIiaLEa3zQS1ZXDa6w4Q9B4_IeE'
q = Auth(access_key, secret_key)
bucket = BucketManager(q)
bucket_name = 'markdown-file'
# 前缀
prefix = None
# 列举条目
limit = 10
# 列举出除'/'的所有文件以及以'/'为分隔的所有前缀
delimiter = None
# 标记
marker = None
ret, eof, info = bucket.list(bucket_name, prefix, marker, limit, delimiter)
print(info)

"""
_ResponseInfo__response:<Response [200]>, 
exception:None, 
status_code:200, 
text_body:{
"items":[
        {"key":"1688624003.jpg","hash":"Fqokoi4GG_2uMNRFCGDGeI6FtTC-","fsize":1869540,"mimeType":"image/jpeg","putTime":15377672737517896,"type":0,"status":0},
        {"key":"image-not-found.png","hash":"Fq-IrM0ME1zaiLs70Fl5jnKsMAHv","fsize":9367,"mimeType":"image/png","putTime":15377673195447563,"type":0,"status":0},
        {"key":"jeituxxxx.png","hash":"FsCFIUr_XoA774YiiAcwZ-cT7FPt","fsize":408945,"mimeType":"image/png","putTime":15377806544551574,"type":0,"status":0},
        {"key":"jietuxxxx.png","hash":"FsCFIUr_XoA774YiiAcwZ-cT7FPt","fsize":408945,"mimeType":"image/png","putTime":15377810962569949,"type":0,"status":0},
        {"key":"test.jpg","hash":"FjMun-hNxes9F_F8L2xf3KrEoCE8","fsize":393978,"mimeType":"image/jpeg","putTime":15377679905530177,"type":0,"status":0},
        {"key":"截图_2018-09-13_23-45-13.png","hash":"FhynjzEXFK4rrtk3VbhwKKbF8VvJ","fsize":127784,"mimeType":"image/png","putTime":15377817019507789,"type":0,"status":0}
    ]
}, 
req_id:ZnkAAJE8jkU7TlcV, 
x_log:RSF:34;RSF:35;ZONEPROXY:36
"""