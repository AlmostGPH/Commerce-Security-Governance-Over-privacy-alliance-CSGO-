import sys
import traceback
import os
import spu
from secretflow.utils.simulation.datasets import dataset
from secretflow.data.split import train_test_split
from secretflow.utils.simulation.datasets import load_bank_marketing
from secretflow.data.vertical import read_csv
import re

ENDC = '\033[0m'
RED = '\033[91m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
BLUE = '\033[94m'


def welcome():
    print(f"{BLUE}[*] 欢迎使用本项目，首先我们需要进行一些环境检测……")
    print("[*] 可以使用 --no-check 参数运行 main.py 跳过检测")
    print(f"{ENDC}")


def check_pyver():

    pyver = sys.version.split()[0]
    print(f"{BLUE}[*] 您正在使用的 Python 版本是：{pyver}{ENDC}")

    if pyver[0:4] != '3.10':
        print(f"{RED}[x] 本项目不兼容 Python {pyver}!{ENDC}")
        print(f"{RED}[x] 请使用 Python 3.10 版本运行本项目{ENDC}")
        exit(1)
    else:
        print(f"{GREEN}[✓]该 Python 版本与本项目兼容{ENDC}")

    print("")


def check_sf():

    print(f"{BLUE}[*] 正在检测依赖{ENDC}")

    try:
        import secretflow as sf

    except ModuleNotFoundError:
        print(f"{RED}[x] 检测到您没有安装 secretflow 依赖包{ENDC}")
        print(f"{RED}[x] 建议运行 pip install -r requirements.txt 以安装本项目的依赖包{ENDC}")
        exit(1)

    except Exception as e:
        print(f"{RED}[x] 未知错误，以下是错误信息: {ENDC}")
        tb = traceback.format_exc()
        print(f"{type(e).__name__}: {str(e)}")
        print(tb)
        exit(1)

    else:
        print(f"{GREEN}[✓] 检测到所有依赖已经满足{ENDC}")


def env_check():
    check_pyver()
    check_sf()


def skip_check():
    print(f"{YELLOW}[*] 跳过环境检测{ENDC}")
    print()


def is_valid_ip_port(address):
    """检查输入的地址是否是有效的 IP:PORT 格式"""
    pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$'
    if re.match(pattern, address):
        return True
    else:
        return False


def get_party_info():
    """通过交互方式获取参与方信息"""
    parties = {}
    num_parties = int(input("[*] 输入参与方数量: "))

    if num_parties != 3:
        print(f"{RED}[x] 本项目只支持 3 个参与方{ENDC}")
        exit(1)

    for i in range(num_parties):
        party_name = input(f"{BLUE}[*] 输入参与方{i+1}名称: {ENDC}").strip()
        address = input(
            f"{BLUE}[*] 输入 {party_name} 的 IP 和 Proxy 端口 (格式: IP:PORT): {ENDC}").strip()
        while not is_valid_ip_port(address):
            print(f"{RED}[x] 输入的地址格式错误，请重新输入。{ENDC}")
            address = input(
                f"{BLUE}[*] 输入 {party_name} 的 IP 和 Proxy 端口 (格式: IP:PORT): {ENDC}").strip()
        # listen_port = input(f"[*] 输入 {party_name} 的 Proxy 监听端口: ").strip()
        listen_port = address.split(":")[1]

        parties[party_name] = {
            'address': address,
            'listen_addr': f'0.0.0.0:{listen_port}'
        }

    return parties


def create_cluster_config():
    """通过交互生成 cluster_config"""
    parties = get_party_info()
    self_party = input(f"{BLUE}[*] 输入当前参与方 (self_party) 的名称: {ENDC}").strip()

    cluster_config = {
        'parties': parties,
        'self_party': self_party
    }

    return cluster_config


def save_config(cluster_config, directory='config.py'):
    """将 cluster_config 保存到指定的文件路径"""
    try:
        with open(directory, 'w') as f:
            f.write(f"cluster_config = {cluster_config}\n")
        print(f"\n{GREEN}[✓] 配置已保存到 {directory}{ENDC}")
    except Exception as e:
        print(f"{RED}[x] 保存配置时出现错误: {e}{ENDC}")


def load_config(path):
    """尝试从指定路径加载配置"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"{RED}[x] 配置文件 {path} 不存在。{ENDC}")

    try:
        config = {}
        with open(path, 'r') as f:
            exec(f.read(), {}, config)
        if 'cluster_config' not in config:
            raise ValueError("配置文件中未找到 'cluster_config'。")
        return config['cluster_config']
    except Exception as e:
        raise RuntimeError(f"{RED}[x] 加载配置时出现错误: {e}{ENDC}")


def get_cluster_config(config_path='config.py'):
    """
    获取 cluster_config。如果配置文件不存在或格式错误，
    则通过交互生成一个新的 cluster_config 并返回。
    """
    try:
        print(f"{BLUE}[*] 尝试从 {config_path} 加载配置...{ENDC}")
        cluster_config = load_config(config_path)
        return cluster_config
    except (FileNotFoundError, ValueError, RuntimeError) as e:
        print(f"\n{e}")
        create_new = input(f"{BLUE}[*] 是否创建新的 cluster_config？(y/N): {ENDC}").strip().lower()
        if create_new == 'y':
            cluster_config= create_cluster_config()
            save_path = input(f"{BLUE}[*] 请输入保存目录和文件名（默认: {config_path}）: {ENDC}").strip()
            print(f"{BLUE}[*] 默认使用各节点的 Proxy 端口 + 10000 作为 SPU 端口{ENDC}")
            print(f"{BLUE}[*] 请保证接下来输入的 Proxy 端口 小于 50000{ENDC}")

            # 如果用户没有输入保存路径，则使用默认路径
            if not save_path:
                save_path = config_path

            save_config(cluster_config, save_path)
            return cluster_config
        else:
            return None


def gen_cluster_def_from_cc(cluster_config: dict) -> dict:
    print(f"{BLUE}[*] 默认使用各节点的 Proxy 端口 + 10000 作为 SPU 端口{ENDC}")
    cluster_def = {
        'nodes': [],
        'runtime_config': {
            'protocol': spu.spu_pb2.SEMI2K,
            'field': spu.spu_pb2.FM128,
        }
    }

    party_ids = []
    for i in range(len(cluster_config)):
        party_ids.append(f'local"{i}')

    for i, (party, addr) in enumerate(cluster_config['parties'].items()):
        #    print(i)
        cluster_def["nodes"].append(
            {
                'party': party,
                'id': f'local:{i}',
                'address': addr['address'].split(":")[0] + ":" + str(int(addr['address'].split(":")[1]) + 10000)
            }
        )

    # print(cluster_def)
    return cluster_def


def get_config_triplets(args):
    cluster_config = get_cluster_config(args.c)
    if cluster_config is None:
        print(f"{RED}[x] 配置文件读取失败，请重试……{ENDC}")
    else:
        # print("配置文件读取成功")
        # print("加载的 cluster_config:")
        # print(cluster_config)
        pass
    cluster_def = gen_cluster_def_from_cc(cluster_config)

    link_desc = {
        'recv_timeout_ms': 3600000
    }
    self_party = cluster_config['self_party']
    return cluster_config, cluster_def, link_desc, self_party
