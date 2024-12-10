#!/bin/bash

# 初始化变量
envPath=""
filePath=""
rayIp=""
rayPort=""
part1Name=""
part1Ip=""
part1Port=""
part2Name=""
part2Ip=""
part2Port=""
part3Name=""
part3Ip=""
part3Port=""
hostName=""
Tdate=""
Pdate=""
psiData=""
leveledData=""
limData=""
currData=""

# 解析传递的参数
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --envPath) envPath="$2"; shift ;;
        --filePath) filePath="$2"; shift ;;
        --rayIp) rayIp="$2"; shift ;;
        --rayPort) rayPort="$2"; shift ;;
        --part1Name) part1Name="$2"; shift ;;
        --part1Ip) part1Ip="$2"; shift ;;
        --part1Port) part1Port="$2"; shift ;;
        --part2Name) part2Name="$2"; shift ;;
        --part2Ip) part2Ip="$2"; shift ;;
        --part2Port) part2Port="$2"; shift ;;
        --part3Name) part3Name="$2"; shift ;;
        --part3Ip) part3Ip="$2"; shift ;;
        --part3Port) part3Port="$2"; shift ;;
        --hostName) hostName="$2"; shift ;;
        --Tdate) Tdate="$2"; shift ;;
        --Pdate) Pdate="$2"; shift ;;
        --psiData) psiData="$2"; shift ;;
        --leveledData) leveledData="$2"; shift ;;
        --limData) limData="$2"; shift ;;
        --currData) currData="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# 打印解析后的参数（可选）
echo "envPath: $envPath"
echo "filePath: $filePath"
echo "rayIp: $rayIp"
echo "rayPort: $rayPort"
echo "part1Name: $part1Name"
echo "part1Ip: $part1Ip"
echo "part1Port: $part1Port"
echo "part2Name: $part2Name"
echo "part2Ip: $part2Ip"
echo "part2Port: $part2Port"
echo "part3Name: $part3Name"
echo "part3Ip: $part3Ip"
echo "part3Port: $part3Port"
echo "hostName: $hostName"
echo "Tdate: $Tdate"
echo "Pdate: $Pdate"
echo "psiData: $psiData"
echo "leveledData: $leveledData"
echo "limData: $limData"
echo "currData: $currData"

# 在这里添加你的脚本逻辑


# 首先在filePath释放python脚本：

echo "正在释放python脚本"

mkdir -p "$filePath/scripts"

touch $filePath/main.py
touch $filePath/train.py
touch $filePath/init.py

cat > $filePath/scripts/main.py <<EOF 
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

EOF

cat > $filePath/scripts/train.py <<EOF
import secretflow as sf
import matplotlib.pyplot as plt
import pandas as pd
from secretflow.utils.simulation.datasets import dataset
from secretflow.data.split import train_test_split
from secretflow.ml.nn import SLModel
from secretflow.utils.simulation.datasets import load_bank_marketing
from secretflow.preprocessing.scaler import MinMaxScaler
from secretflow.preprocessing.encoder import LabelEncoder
from secretflow.data.vertical import read_csv
from secretflow.security.privacy import DPStrategy, LabelDP
from secretflow.security.privacy.mechanism.tensorflow import GaussianEmbeddingDP
from secretflow.preprocessing.encoder import OneHotEncoder
import tensorflow as tf
import numpy as np
from secretflow.data.vertical import read_csv


def get_data(users, spu, self_party=None, args=None):
    """获取数据"""

    key_columns = ['ID']
    label_columns = ['ID']

    # 初始化一个空字典来存储路径
    input_path = {}
    # 接受每个用户的输入
    for user in users:
        if self_party is not None and user != self_party:
            input_path[user] = ''
            continue
        # path = input(f"[*] 请输入 {user} 的文件路径: ")
        path = args.Tdate
        input_path[user] = path

    # input_path = {
    #     alice: '/home/GPH/Documents/Commerce-Security-Governance-Over-privacy-alliance-CSGO-/DataGen/leveled_orders_JD.csv',
    #     bob:  '/home/bbbbhrrrr/CSGO/Commerce-Security-Governance-Over-privacy-alliance-CSGO-/DataGen/leveled_orders_TB.csv',
    #     carol:  '/home/lwzheng/workspace/sf/DataGen/leveled_Cit_score.csv'
    # }

    vdf = read_csv(input_path, spu=spu, keys=key_columns,
                   drop_keys=label_columns, psi_protocl="ECDH_PSI_3PC")

    return vdf


def get_pict_data(users, spu, self_party=None,args=None):
    """获取预测数据"""

    # 初始化一个空字典来存储路径

    input_path = {}
    # 接受每个用户的输入
    for user in users:
        if self_party is not None and user != self_party:
            input_path[user] = ''
            continue
        # path = input(f"[*] 请输入 {user} 的文件路径: ")
        path = args.Pdate
        input_path[user] = path

    output_path = {}
    
    for user in users:
        if self_party is not None and user != self_party:
            output_path[user] = ''
            continue
        # path = input(f"[*] 请输入 {user} 的输出路径: ")
        path = args.psiData
        output_path[user] = path

    # print(f"input_path = {input_path}")
    # print(f"output_path = {output_path}")

    spu.psi_csv(
        ['ID'], input_path, output_path, 'carol', protocol='ECDH_PSI_3PC', precheck_input=False, broadcast_result=False
    )

    spu.psi_csv(
        ['ID'], input_path, output_path, 'bob', protocol='ECDH_PSI_3PC', precheck_input=False, broadcast_result=False
    )

    spu.psi_csv(
        ['ID'], input_path, output_path, 'alice', protocol='ECDH_PSI_3PC', precheck_input=False, broadcast_result=False
    )

    print(f"[✓] 隐私求交数据已保存到 {output_path}")

    vdf2 = read_csv(output_path, spu=spu, keys='ID',
                    drop_keys='ID', psi_protocl="ECDH_PSI_3PC")

    return vdf2, output_path, input_path


def gen_train_data(vdf):
    """生成训练数据"""

    label_JD = vdf["level_JD"]
    label_TB = vdf["level_TB"]
    label = vdf["level_Total"]

    # 删除标签列
    data = vdf.drop(columns=["level_JD", "level_TB", "level_Total"])

    # 对数据进行编码
    encoder = LabelEncoder()
    data['Total_Count_JD'] = encoder.fit_transform(data['Total_Count_JD'])
    data['Total_Count_TB'] = encoder.fit_transform(data['Total_Count_TB'])
    data['Refund_Only_Count_JD'] = encoder.fit_transform(
        data['Refund_Only_Count_JD'])
    data['Refund_Only_Count_TB'] = encoder.fit_transform(
        data['Refund_Only_Count_TB'])
    data['Rental_Not_Returned_Count_JD'] = encoder.fit_transform(
        data['Rental_Not_Returned_Count_JD'])
    data['Rental_Not_Returned_Count_TB'] = encoder.fit_transform(
        data['Rental_Not_Returned_Count_TB'])
    data['Partial_Payment_After_Receipt_Count_JD'] = encoder.fit_transform(
        data['Partial_Payment_After_Receipt_Count_JD'])
    data['Partial_Payment_After_Receipt_Count_TB'] = encoder.fit_transform(
        data['Partial_Payment_After_Receipt_Count_TB'])
    data['Payment_Without_Delivery_Count_JD'] = encoder.fit_transform(
        data['Payment_Without_Delivery_Count_JD'])
    data['Payment_Without_Delivery_Count_TB'] = encoder.fit_transform(
        data['Payment_Without_Delivery_Count_TB'])
    data['Amount_of_Loss_JD'] = encoder.fit_transform(
        data['Amount_of_Loss_JD'])
    data['Amount_of_Loss_TB'] = encoder.fit_transform(
        data['Amount_of_Loss_TB'])
    data['Cit_Score'] = encoder.fit_transform(data['Cit_Score'])

    encoder = OneHotEncoder()
    label_JD = encoder.fit_transform(label_JD)
    label_TB = encoder.fit_transform(label_TB)
    label = encoder.fit_transform(label)

    scaler = MinMaxScaler()
    data = scaler.fit_transform(data)

    # 划分数据集
    random_state = 1234
    train_data, test_data = train_test_split(
        data, train_size=0.85, random_state=random_state
    )
    train_label, test_label = train_test_split(
        label, train_size=0.85, random_state=random_state
    )

    return train_data, test_data, train_label, test_label


def man_pict_data(vdf):
    """处理预测数据"""

    # label_JD = vdf["level_JD"]
    # label_TB = vdf["level_TB"]
    # label = vdf["level_Total"]

    # 删除标签列
    # data = vdf.drop(columns=["level_JD", "level_TB", "level_Total"])
    data = vdf
    # 对数据进行编码
    encoder = LabelEncoder()
    data['Total_Count_JD'] = encoder.fit_transform(data['Total_Count_JD'])
    data['Total_Count_TB'] = encoder.fit_transform(data['Total_Count_TB'])
    data['Refund_Only_Count_JD'] = encoder.fit_transform(
        data['Refund_Only_Count_JD'])
    data['Refund_Only_Count_TB'] = encoder.fit_transform(
        data['Refund_Only_Count_TB'])
    data['Rental_Not_Returned_Count_JD'] = encoder.fit_transform(
        data['Rental_Not_Returned_Count_JD'])
    data['Rental_Not_Returned_Count_TB'] = encoder.fit_transform(
        data['Rental_Not_Returned_Count_TB'])
    data['Partial_Payment_After_Receipt_Count_JD'] = encoder.fit_transform(
        data['Partial_Payment_After_Receipt_Count_JD'])
    data['Partial_Payment_After_Receipt_Count_TB'] = encoder.fit_transform(
        data['Partial_Payment_After_Receipt_Count_TB'])
    data['Payment_Without_Delivery_Count_JD'] = encoder.fit_transform(
        data['Payment_Without_Delivery_Count_JD'])
    data['Payment_Without_Delivery_Count_TB'] = encoder.fit_transform(
        data['Payment_Without_Delivery_Count_TB'])
    data['Amount_of_Loss_JD'] = encoder.fit_transform(
        data['Amount_of_Loss_JD'])
    data['Amount_of_Loss_TB'] = encoder.fit_transform(
        data['Amount_of_Loss_TB'])
    data['Cit_Score'] = encoder.fit_transform(data['Cit_Score'])

    # encoder = OneHotEncoder()
    # label_JD = encoder.fit_transform(label_JD)
    # label_TB = encoder.fit_transform(label_TB)
    # label = encoder.fit_transform(label)

    scaler = MinMaxScaler()
    data = scaler.fit_transform(data)

    return data


def create_base_model(input_dim, output_dim, name='base_model'):
    """创建基础模型"""
    # Create model
    def create_model():
        from tensorflow import keras
        import keras.layers as layers
        import tensorflow as tf

        model = keras.Sequential(
            [
                keras.Input(shape=input_dim),
                layers.Dense(100, activation="relu"),
                layers.Dense(output_dim, activation="relu"),
            ]
        )
        # Compile model
        model.summary()
        model.compile(
            loss='categorical_crossentropy',
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            metrics=["accuracy", tf.keras.metrics.AUC()],
        )
        return model

    return create_model


def create_fuse_model(input_dim, output_dim, party_nums, name='fuse_model'):
    """创建融合模型"""
    def create_model():
        from tensorflow import keras
        import keras.layers as layers
        import tensorflow as tf

        # input
        input_layers = []
        for i in range(party_nums):
            input_layers.append(
                keras.Input(
                    input_dim,
                )
            )

        merged_layer = layers.concatenate(input_layers)
        fuse_layer = layers.Dense(64, activation='relu')(merged_layer)
        output = layers.Dense(output_dim, activation='sigmoid')(fuse_layer)

        model = keras.Model(inputs=input_layers, outputs=output)
        model.summary()

        model.compile(
            loss='categorical_crossentropy',
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            metrics=["accuracy", tf.keras.metrics.AUC()],
        )
        return model

    return create_model


def training(train_data, train_label, test_data, test_label, users):
    """训练模型"""

    alice = users[0]
    bob = users[1]
    carol = users[2]
    # prepare model
    hidden_size = 64

    model_base_alice = create_base_model(6, hidden_size)
    model_base_bob = create_base_model(6, hidden_size)
    carol_model = create_base_model(1, hidden_size)

    model_base_alice()
    model_base_bob()
    carol_model()

    model_fuse = create_fuse_model(
        input_dim=hidden_size, party_nums=3, output_dim=5)
    model_fuse()

    base_model_dict = {alice: model_base_alice,
                       bob: model_base_bob, carol: carol_model}

    # Define DP operations
    train_batch_size = 1000
    gaussian_embedding_dp = GaussianEmbeddingDP(
        noise_multiplier=0.5,
        l2_norm_clip=1.0,
        batch_size=train_batch_size,
        num_samples=train_data.values.partition_shape()[carol][0],
        is_secure_generator=False,
    )
    label_dp = LabelDP(eps=64.0)
    dp_strategy_carol = DPStrategy(label_dp=label_dp)
    dp_strategy_bob = DPStrategy(embedding_dp=gaussian_embedding_dp)
    dp_strategy_alice = DPStrategy(embedding_dp=gaussian_embedding_dp)
    dp_strategy_dict = {alice: dp_strategy_alice,
                        bob: dp_strategy_bob, carol: dp_strategy_carol}
    dp_spent_step_freq = 10

    sl_model = SLModel(
        base_model_dict=base_model_dict,
        device_y=carol,
        model_fuse=model_fuse,
        dp_strategy_dict=dp_strategy_dict,
    )

    history = sl_model.fit(
        train_data,
        train_label,
        validation_data=(test_data, test_label),
        epochs=50,
        batch_size=train_batch_size,
        shuffle=True,
        verbose=1,
        validation_freq=1,
        dp_spent_step_freq=dp_spent_step_freq,
    )

    # Evaluate the model
    evaluator = sl_model.evaluate(test_data, test_label, batch_size=10)
    print(evaluator)

    return history, sl_model


def level_pict(sl_model, test_data, output_path, self_party,args):
    """预测"""

    # pict the test data
    y_p = sl_model.pict(test_data)
    # print(f"type(y_p) = {type(y_p)}")

    # print(sf.reveal(y_p))    

    data = sf.reveal(y_p)

    # 将预测结果转换为 tensor张量

    # 找到最大行数
    max_rows = max(tensor.shape[0] for tensor in data)

    # 填充或裁剪数据，使其形状一致
    padded_data = []
    for tensor in data:
        if tensor.shape[0] < max_rows:
            # 填充
            padding = np.zeros(
                (max_rows - tensor.shape[0], tensor.shape[1]), dtype=np.float32)
            padded_tensor = np.vstack((tensor, padding))
        else:
            # 裁剪
            padded_tensor = tensor[:max_rows, :]
        padded_data.append(padded_tensor)

    # 将数据转换为TensorFlow张量
    tensor = tf.convert_to_tensor(padded_data, dtype=tf.float32)
    # 将 tensor 转换为5列的形式
    tensor = tf.reshape(tensor, [-1, 5])

    # 找到每行最大值的索引
    max_indices = tf.argmax(tensor, axis=1)
    # 将索引转换为 one-hot 编码
    picted_one_hot = tf.one_hot(max_indices, depth=tensor.shape[1])

    # 打印预测结果和真实标签，作为对比
    # print(f"picted_one_hot = {picted_one_hot}")

    # print(sf.reveal(test_label.partitions[carol].data))

    df = pd.DataFrame(1 + tf.argmax(picted_one_hot, axis=1))

    # output_file = "Commerce-Security-Governance-Over-privacy-alliance-CSGO/Commerce-Security-Governance-Over-privacy-alliance-CSGO--main/DataGen/result.csv"

    # output_file = input(f'{}[*] 请输入等级预测结果保存路径: {}')
    output_file = args.leveledData

    df.to_csv(output_file, index=False)

    # 读取 Cit_score_psi.csv 和 result.csv，跳过 result.csv 的第一行
    cit_score_df = pd.read_csv(output_path[self_party])
    result_df = pd.read_csv(output_file, header=None, skiprows=1)

    # 合并数据

    merge_data(cit_score_df, result_df, output_file)

    print(f"[✓] 等级预测结果已保存到： {output_file}")

    return output_file


def merge_data(cit_score_df, result_df, output_file):
    """合并数据"""

    # 找到两者中较短的行数，进行截断
    min_length = min(len(cit_score_df), len(result_df))

    # 如果 Cit_score_psi.csv 更长，进行截断
    cit_score_df = cit_score_df.iloc[:min_length]

    # 如果 result.csv 更长，进行截断
    result_df = result_df.iloc[:min_length]

    # 将 result.csv 中的数值替换到 cit_score_df 的 level 列
    cit_score_df['level'] = result_df[0]

    # 将修改后的数据保存到新的 CSV 文件中，或者覆盖原文件
    cit_score_df.to_csv(output_file, index=False)

    # print(f"已成功更新 level 列，处理后的行数为 {min_length} 行。")


def calculate_transaction_limits(plantform,order_amount_path, output_path,self_party_name):

    if self_party_name == 'carol':
        print(f"[x] 无交易额度计算数据，跳过计算")
        return
    
    # 读取订单金额数据和评级
    order_amount_df = pd.read_csv(order_amount_path)

    # 合并数据
    # merged_df1 = pd.merge(order_amount_df, on='ID')
    merged_df = order_amount_df

    # 计算加权额度
    # 假设 'Amount_of_Loss_Total' 是订单误差金额列，'Cit_Score' 是信誉分列
    merged_df['Weighted_Amount'] = (merged_df['Amount_of_Loss' + plantform].max() - merged_df['Amount_of_Loss'+ plantform]) * (
        merged_df['level'].max() - merged_df['level'] + 0.5) * (merged_df['level'].max() - merged_df['level'] + 0.5)
    merged_df['Transaction_Limit'] = merged_df.groupby(
        'ID')['Weighted_Amount'].transform('sum')

    # 去除重复的 ID 行，保留每个 ID 的交易额度
    transaction_limits = merged_df[[
        'ID', 'Transaction_Limit']].drop_duplicates()

    transaction_limits.to_csv(output_path, index=False)

    print(f"[✓] 交易额度已保存到 {output_path}")


import plotly.graph_objects as go
import plotly.io as pio
from plotly.subplots import make_subplots

def show_mode_result(history,args):
    """显示模型结果"""

    # Create subplots
    fig = make_subplots(rows=1, cols=3, subplot_titles=("Model loss", "Model accuracy", "Model Area Under Curve"))

    # Plot the change of loss during training
    fig.add_trace(go.Scatter(y=history['train_loss'], mode='lines', name='Train Loss'), row=1, col=1)
    fig.add_trace(go.Scatter(y=history['val_loss'], mode='lines', name='Val Loss'), row=1, col=1)

    # Plot the change of accuracy during training
    fig.add_trace(go.Scatter(y=history['train_accuracy'], mode='lines', name='Train Accuracy'), row=1, col=2)
    fig.add_trace(go.Scatter(y=history['val_accuracy'], mode='lines', name='Val Accuracy'), row=1, col=2)

    # Plot the Area Under Curve(AUC) of loss during training
    fig.add_trace(go.Scatter(y=history['train_auc_1'], mode='lines', name='Train AUC'), row=1, col=3)
    fig.add_trace(go.Scatter(y=history['val_auc_1'], mode='lines', name='Val AUC'), row=1, col=3)

    # Update layout
    fig.update_layout(title_text="Model Training Results", height=600, width=1200)

    # output_path = input(f"[*] 请输入模型展示图片保存路径：")
    output_path = args.currData
    
    # Save the figure as an HTML file
    pio.write_html(fig, file=output_path, auto_open=True)

EOF

cat > $filePath/scripts/init.py <<EOF
import sys
import traceback
import os
import spu
from secretflow.utils.simulation.datasets import dataset
from secretflow.data.split import train_test_split
from secretflow.utils.simulation.datasets import load_bank_marketing
from secretflow.data.vertical import read_csv
import re

def welcome():
    print(f"[*] 欢迎使用本项目，首先我们需要进行一些环境检测……")
    print("[*] 可以使用 --no-check 参数运行 main.py 跳过检测")
    print(f"")


def check_pyver():

    pyver = sys.version.split()[0]
    print(f"[*] 您正在使用的 Python 版本是：{pyver}")

    if pyver[0:4] != '3.10':
        print(f"[x] 本项目不兼容 Python {pyver}!")
        print(f"[x] 请使用 Python 3.10 版本运行本项目")
        exit(1)
    else:
        print(f"[✓]该 Python 版本与本项目兼容")

    print("")


def check_sf():

    print(f"[*] 正在检测依赖")

    try:
        import secretflow as sf

    except ModuleNotFoundError:
        print(f"[x] 检测到您没有安装 secretflow 依赖包")
        print(f"[x] 建议运行 pip install -r requirements.txt 以安装本项目的依赖包")
        exit(1)

    except Exception as e:
        print(f"[x] 未知错误，以下是错误信息: ")
        tb = traceback.format_exc()
        print(f"{type(e).__name__}: {str(e)}")
        print(tb)
        exit(1)

    else:
        print(f"[✓] 检测到所有依赖已经满足")


def env_check():
    check_pyver()
    check_sf()


def skip_check():
    print(f"[*] 跳过环境检测")
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
        print(f"[x] 本项目只支持 3 个参与方")
        exit(1)

    for i in range(num_parties):
        party_name = input(f"[*] 输入参与方{i+1}名称: ").strip()
        address = input(
            f"[*] 输入 {party_name} 的 IP 和 Proxy 端口 (格式: IP:PORT): ").strip()
        while not is_valid_ip_port(address):
            print(f"[x] 输入的地址格式错误，请重新输入。")
            address = input(
                f"[*] 输入 {party_name} 的 IP 和 Proxy 端口 (格式: IP:PORT): ").strip()
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
    self_party = input(f"[*] 输入当前参与方 (self_party) 的名称: ").strip()

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
        print(f"\n[✓] 配置已保存到 {directory}")
    except Exception as e:
        print(f"[x] 保存配置时出现错误: {e}")


def load_config(path):
    """尝试从指定路径加载配置"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"[x] 配置文件 {path} 不存在。")

    try:
        config = {}
        with open(path, 'r') as f:
            exec(f.read(), {}, config)
        if 'cluster_config' not in config:
            raise ValueError("配置文件中未找到 'cluster_config'。")
        return config['cluster_config']
    except Exception as e:
        raise RuntimeError(f"[x] 加载配置时出现错误: {e}")


def get_cluster_config(args):
    """
    获取 cluster_config。
    """
    create_new = 'y'
    if create_new == 'y':
        cluster_config = {
            'parties': {
                args.part1Name: {
                    'address': f"{args.part1Ip}:{args.part1Port}",
                    'listen_addr': f"0.0.0.0:{args.part1Port}"
                },
                args.part2Name: {
                    'address': f"{args.part2Ip}:{args.part2Port}",
                    'listen_addr': f"0.0.0.0:{args.part2Port}"
                },
                args.part3Name: {
                    'address': f"{args.part3Ip}:{args.part3Port}",
                    'listen_addr': f"0.0.0.0:{args.part3Port}"
                }
            },
            'self_party': args.part1Name
        }
        print(f"[*] 默认使用各节点的 Proxy 端口 + 10000 作为 SPU 端口")
        print(f"[*] 请保证接下来输入的 Proxy 端口 小于 50000")
        return cluster_config
    else:
        return None


def gen_cluster_def_from_cc(cluster_config: dict) -> dict:
    print(f"[*] 默认使用各节点的 Proxy 端口 + 10000 作为 SPU 端口")
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
    cluster_config = get_cluster_config(args)
    if cluster_config is None:
        print(f"[x] 配置读取失败，请重试……")
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

EOF


# 然后启动ray集群，示例：ray start --head --node-ip-address="192.168.141.89" --port="20000" --include-dashboard=False --disable-usage-stats

echo "正在启动ray集群"
$envPath/ray start --head --node-ip-address=$rayIp --port=$rayPort --include-dashboard=False --disable-usage-stats
echo "ray集群启动成功"
# 然后运行python脚本，并将剩下的参数当作参数输入，输给脚本

echo "正在运行项目脚本"
$envPath/python3 $filePath/scripts/main.py --part1Name $part1Name --part1Ip $part1Ip --part1Port $part1Port --part2Name $part2Name --part2Ip $part2Ip --part2Port $part2Port --part3Name $part3Name --part3Ip $part3Ip --part3Port $part3Port --hostName $hostName --Tdate $Tdate --Pdate $Pdate --psiData $psiData --leveledData $leveledData --limData $limData --currData $currData --ray-address $rayIp:$rayPort
echo "项目运行结束"

# 最后关闭ray集群

echo "正在关闭ray集群"
$envPath/ray stop
echo "ray集群关闭成功"