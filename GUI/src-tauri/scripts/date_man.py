from tqdm import trange
import time

for i in trange(100):
    print("step: ", i)
    time.sleep(0.01)