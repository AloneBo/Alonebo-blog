import asyncio
import concurrent.futures
import time
"""
demo

def blocking_io():
    # File operations (such as logging) can block the
    # event loop: run them in a thread pool.
    with open('/dev/urandom', 'rb') as f:
        return f.read(100)

def cpu_bound():
    # CPU-bound operations will block the event loop:
    # in general it is preferable to run them in a
    # process pool.
    return sum(i * i for i in range(10 ** 7))

async def main():
    loop = asyncio.get_event_loop()

    ## Options:

    # 1. Run in the default loop's executor:
    result = await loop.run_in_executor(
        None, blocking_io)
    print('default thread pool', result)

    # 2. Run in a custom thread pool:
    with concurrent.futures.ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(
            pool, blocking_io)
        print('custom thread pool', result)

    # 3. Run in a custom process pool:
    with concurrent.futures.ProcessPoolExecutor() as pool:
        result = await loop.run_in_executor(
            pool, cpu_bound)
        print('custom process pool', result)

# asyncio.run(main())
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
"""

start = time.time()

async def so_some_work():
    await asyncio.sleep(3)

def save_file_to_qiniu():
    time.sleep(3)
    print('save success...')
    return 'sadsd'

async def main():
    loop = asyncio.get_event_loop()
    # result = await loop.run_in_executor(
    #     None, save_file_to_qiniu)
    # await so_some_work()
    await so_some_work()
    with concurrent.futures.ThreadPoolExecutor() as pool:
        result = await loop.run_in_executor(
            pool, save_file_to_qiniu)
        print('custom thread pool', result)

    print('default thread pool', result)
    print('Done: {}'.format(time.time()-start))


asyncio.get_event_loop().run_until_complete(main())