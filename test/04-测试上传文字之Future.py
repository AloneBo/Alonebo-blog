import time
import asyncio
import threading

now = lambda: time.time()


async def do_some_work(x):
    loop = asyncio.get_event_loop()
    fut = loop.create_future()
    await upload(fut)
    return await fut


async def upload(fut):
    print(id(fut))
    fut.add_done_callback(done_callback)
    # await asyncio.sleep(2)  # 模拟创建线程 提交数据
    # t = threading.Thread(target=save_file_to_qiqiu, args=(fut,))
    # t.start()
    save_file_to_qiqiu(fut)
    print('started..')
    # fut.set_result('sajdhsdh')


def save_file_to_qiqiu(future):
    print(id(future))
    print('开始上传文件。。。')
    time.sleep(2)
    print('上传文件成功。。。')
    future.set_result('上传成功！')


def done_callback(future):
    print('hahahaha')
    print('done...{}'.format(future))


def callback(future):
    print(type(future))
    print('Callback: ', future.result())


start = now()

coroutine = do_some_work(2)

loop = asyncio.get_event_loop()

task = asyncio.ensure_future(coroutine)  # 创建一个task

task.add_done_callback(callback)  # 给do_some_work设置完成后的毁掉

loop.run_until_complete(task)

print('TIME: ', now() - start)