from . import base_handler
from utils import qiniu_utils
from . import commons
import asyncio


class MarkdownImageFileHandler(base_handler.BaseHandler):
    @commons.require_login
    async def post(self, *args, **kwargs):
        # 获取表单信息
        file_bin = self.request.files['editormd-image-file'][0]['body']
        original_fname = self.request.files['editormd-image-file'][0]['filename']
        try:
            # url = qiniu_utils.save_file_to_qiniu(original_fname, file_bin) 耗时操作
            url = await asyncio.get_event_loop().run_in_executor(None, qiniu_utils.save_file_to_qiniu, original_fname, file_bin)

        except Exception as e:
            print(e)
            return self.write({'errcode': 0})
        else:
            result = dict(success=1, message="success",
                          url=url)
            self.write(result)
