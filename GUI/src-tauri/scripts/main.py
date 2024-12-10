import argparse
import secretflow as sf
from init import welcome, env_check, skip_check, get_config_triplets
from train import get_data, gen_train_data, training, show_mode_result, get_pict_data, man_pict_data, level_pict, calculate_transaction_limits



def work(users, spu, self_party=None, self_party_name=None, args=None):

    print(f"[*] 开始收集数据……")

    vdf = get_data(users, spu, self_party, args)

    print(f"[✓] 数据收集完成: {vdf}")

    print(f"[*] 开始生成训练数据……")

    train_data, test_data, train_label, test_label = gen_train_data(vdf)

    print(
        f"[✓] 训练数据生成完成: {train_data, test_data, train_label, test_label}")

    print(f"[*] 开始训练模型……")

    history, sl_model = training(
        train_data, train_label, test_data, test_label, users)

    print(f"[✓] 训练完成: {history}")

    print(f"[*] 开始读取预测数据……")

    vdf2, output_path, input_path = get_pict_data(users, spu, self_party,args)

    print(f"[✓] 预测数据读取完成: {vdf2}")

    print(f"[*] 开始处理预测数据……")

    data_pri = man_pict_data(vdf2)

    print(f"[✓] 预测数据处理完成: {data_pri}")

    print(f"[*] 开始预测……")

    if self_party is None:  # 本地调试模式下，self_party 设为 alice
        self_party = users[0]
        self_party_name = 'alice'

    output_file = level_pict(sl_model, data_pri, output_path, self_party, args)

    print(f"[*] 开始计算用户额度限制……")

    plantform = '_' + \
        input_path[self_party].split('/')[-1].split('_')[-1].split('.')[0]

    # result_path = input(f"[*] 请输入额度限制结果文件路径：")
    result_path = args.limData

    calculate_transaction_limits(
        plantform, output_file, result_path, self_party_name)

    print(f"[*] 训练结果展示：")
    show_mode_result(history, args)

    print(f"[✓] 所有任务完成，程序正常退出")

    exit(0)


def main(args):

    if args.debug:

        print(f"[*] 正在本地调试模式下运行……")

        n = int(input(f"[*] 请输入参与方数量: "))
        if n != 3:
            raise Exception("调试模式下参与方数量必须为 3")

        print(f"[*] 正在初始化本地调试 Secretflow 环境……")
        sf.init(['alice', 'bob', 'carol'], address='local')

        print(f"[*] 正在初始化本地调试 SPU 环境……")
        spu = sf.SPU(sf.utils.testing.cluster_def(['alice', 'bob', 'carol']))

        print(f"[*] 正在初始化本地调试 PYU……")
        alice, bob, carol = sf.PYU('alice'), sf.PYU('bob'), sf.PYU('carol')
        users = [alice, bob, carol]

        print(f"[✓] 调试环境初始化完成")

        work(users, spu)

    else:
        cluster_config, cluster_def, link_desc, self_party_name = get_config_triplets(
            args)

        print(f"[✓] 读取的 cluster_config: {cluster_config}")
        print(f"[✓] cluster_def: {cluster_def}")

        if args.ray_address is None:
            ray_address = input("[*] 请输入本节点 Ray 集群的 URL, 格式为 IP:PORT :")
            if not ray_address:
                print(f"[✗] 未输入 Ray 集群的 URL，程序退出")
                exit(1)
        else:
            ray_address = args.ray_address[0]

        print(f"[*] 正在初始化 Secretflow 环境……")
        sf.init(address=ray_address, log_to_driver=True,
                cluster_config=cluster_config)

        print(f"[*] 正在初始化 SPU 环境……")
        spu = sf.SPU(cluster_def, link_desc)

        print(f"[*] 正在初始化 PYU ……")
        partis = cluster_config['parties'].keys()  # 仍然是 dict_keys
        users = [f'party_{i+1}' for i in range(len(partis))]
        for i, key in enumerate(partis):  # 直接使用 partis，无需再调用 .keys()
            users[i] = sf.PYU(key)  # 使用 dict 的键而不是通过下标访问
            if key == self_party_name:
                self_party = users[i]

        print(f"[✓] 生产环境初始化完成")

        work(users, spu, self_party, self_party_name, args)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ray-address", nargs=1, metavar="IP:PORT",
                        default=None, type=str, help="指定 Ray 集群的地址")

    parser.add_argument("-c", nargs=1, metavar="config.py",
                        default="config.py", type=str, help="自定义 config.py 路径")
    parser.add_argument("--no-check", action="store_true",  help="跳过环境检测")

    parser.add_argument("--debug", action="store_true", help="开启调试模式")

    parser.add_argument("--part1Name", required=True, type=str, help="参与方1的名称")
    parser.add_argument("--part1Ip", required=True, type=str, help="参与方1的IP地址")
    parser.add_argument("--part1Port", required=True, type=int, help="参与方1的端口")
    parser.add_argument("--part2Name", required=True, type=str, help="参与方2的名称")
    parser.add_argument("--part2Ip", required=True, type=str, help="参与方2的IP地址")
    parser.add_argument("--part2Port", required=True, type=int, help="参与方2的端口")
    parser.add_argument("--part3Name", required=True, type=str, help="参与方3的名称")
    parser.add_argument("--part3Ip", required=True, type=str, help="参与方3的IP地址")
    parser.add_argument("--part3Port", required=True, type=int, help="参与方3的端口")
    parser.add_argument("--hostName", required=True, type=str, help="主机名称")
    parser.add_argument("--Tdate", required=True, type=str, help="训练数据")
    parser.add_argument("--Pdate", required=True, type=str, help="预测数据")
    parser.add_argument("--psiData", required=True, type=str, help="PSI数据路径")
    parser.add_argument("--leveledData", required=True,
                        type=str, help="分级数据路径")
    parser.add_argument("--limData", required=True, type=str, help="限制数据路径")
    parser.add_argument("--currData", required=True, type=str, help="准确率数据路径")

    args = parser.parse_args()

    welcome()
    if not args.no_check:
        env_check()
    else:
        skip_check()

    main(args)
