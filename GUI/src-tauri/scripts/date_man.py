'''
id 行为总次数 仅退款不退货次数 租用不还次数 收货后仅支付订金次数 付款不发货次数


'''
import argparse
import csv
from collections import defaultdict
import pandas as pd
import numpy as np
from tqdm import tqdm

def Count(file):
    # 定义结果存储字典
    results = defaultdict(lambda: [0, 0, 0, 0, 0, 0])  # 初始化每个ID的统计信息

    # 打开CSV文件
    with open(file, mode='r', encoding='utf-8') as file2count:
        # 创建一个CSV读取器
        csv_reader = csv.reader(file2count)

        # 读取表头
        header = next(csv_reader)
        # print(header)

        # 逐行读取CSV文件中的数据
        for row in tqdm(csv_reader):
            # print(row)  # 打印每一行的数据
            # print(row[0])  # 打印每一行的第一个元素
            Consumer_ID = row[1]
            Producer_ID = row[2]
            Product_Amount = row[4]
            Return_Time = row[10]
            Payment_Amount = row[11]
            Refund_Amount = row[12]
            Shipping_Time = row[7]
            Payment_Time = row[6]
            Platform_Type = row[13]

            results[Consumer_ID][0] += 1
            results[Producer_ID][0] += 1

            Amount_of_Loss = float(Product_Amount)  # 初始化造成损失金额
            # 初始化消费者造成损失金额

            if Platform_Type == 'lease_platform':
                if Return_Time == '9999':           # 租用不还
                    results[Consumer_ID][2] += 1
                    results[Consumer_ID][5] += Amount_of_Loss
                if Return_Time == '9999' and Refund_Amount == Product_Amount:   # 仅退款不退货
                    results[Consumer_ID][1] += 1
                    results[Consumer_ID][5] += Amount_of_Loss
                if Product_Amount > Payment_Amount:     # 收货后仅支付订金
                    # 计算损失金额
                    results[Consumer_ID][5] += float(Product_Amount) - \
                        float(Payment_Amount)
                    results[Consumer_ID][3] += 1
                if Payment_Amount != 0 and Shipping_Time == '9999':     # 付款不发货
                    results[Producer_ID][4] += 1
                    # 付款不发货，生产者造成损失金额为Amount_of_Loss
                    results[Producer_ID][5] += Amount_of_Loss
            else:
                if Return_Time == '9999' and Refund_Amount == Product_Amount:   # 仅退款不退货
                    results[Consumer_ID][1] += 1
                    results[Consumer_ID][5] += Amount_of_Loss
                if Product_Amount > Payment_Amount:     # 收货后仅支付订金
                    results[Consumer_ID][5] += float(Product_Amount) - \
                        float(Payment_Amount)
                    results[Consumer_ID][3] += 1
                if Payment_Amount != 0 and Shipping_Time == '9999':     # 付款不发货
                    results[Producer_ID][4] += 1
                    # 付款不发货，生产者造成损失金额为Amount_of_Loss
                    results[Producer_ID][5] += Amount_of_Loss

    file_name = file.split('/')[-1]
    file_path = file.split(file_name)[0]

    result_file_name = file_path + 'count_' + file_name

    Platform_Type = '_'+file_name.split('_')[1].split('.')[0]
    print("保存数据中...")
    # 创建并写入新的CSV文件
    with open(result_file_name, mode='w', encoding='utf-8', newline='') as file:
        csv_writer = csv.writer(file)

        # 写入表头
        csv_writer.writerow(['ID', 'Total_Count'+Platform_Type, 'Refund_Only_Count'+Platform_Type, 'Rental_Not_Returned_Count'+Platform_Type,
                            'Partial_Payment_After_Receipt_Count'+Platform_Type, 'Payment_Without_Delivery_Count'+Platform_Type, 'Amount_of_Loss'+Platform_Type])

        # 写入每个用户的统计信息
        for user_id, counts in results.items():
            csv_writer.writerow([user_id] + counts)
    print("行为统计数据已保存到：", result_file_name)


'''
用户等级：1、2、3、4、5分别对应
优先用户、普通用户、风险用户、恶意用户、封禁用户
'''


def classify_user(data_row, data_month, data_half_year, plantform):
    # 从data_row中提取单行数据
    total_score = data_row['Total_Score'+ "_"+plantform]
    total_count = data_row['Total_Count'+ "_"+plantform]

    # 获取对应行在data_month和data_half_year中的数据
    if data_row.name in data_month.index:
        month_score = data_month.loc[data_row.name, 'Total_Score'+"_"+plantform]
    else:
        month_score = 0
    if data_row.name in data_half_year.index:
        half_year_score = data_half_year.loc[data_row.name, 'Total_Score'+"_"+plantform]
    else:
        half_year_score = 0

    if total_score > 10:
        return 5  # 封禁用户
    elif (total_count > 10 and total_score == 0) or \
         (total_count > 4 and month_score == 0 and total_score == 0) or \
         (total_count >= 15 and half_year_score == 0 and total_score == 0):
        return 1  # 优先用户
    elif (total_count > 100 and month_score / total_count > 0.01) or \
         (total_count <= 100 and month_score < 5 and total_score != 0):
        return 3  # 风险用户
    elif (total_count > 100 and month_score / total_count > 0.05) or \
         (total_count <= 100 and month_score >= 5):
        return 4  # 恶意用户
    else:
        return 2  # 普通用户


def Cale_Total(data, plantform):
    data['Refund_Only_Score_'+plantform] = np.log(data['Refund_Only_Count_'+plantform] + np.log(data['Amount_of_Loss_'+plantform]) + np.exp(
        1) * np.exp(10 * data['Refund_Only_Count_'+plantform] / data['Total_Count_'+plantform])).fillna(0)
    data['Rental_Not_Returned_Score_'+plantform] = np.log(50 * data['Rental_Not_Returned_Count_'+plantform] + np.exp(1) * np.log(
        data['Amount_of_Loss_'+plantform]) + np.exp(1) * np.exp(10 * data['Rental_Not_Returned_Count_'+plantform] / data['Total_Count_'+plantform])).fillna(0)
    data['Partial_Payment_After_Receipt_Score_'+plantform] = np.log(data['Partial_Payment_After_Receipt_Count_'+plantform] + np.exp(1) * np.log(
        data['Amount_of_Loss_'+plantform]) + np.exp(1) * np.exp(10 * data['Partial_Payment_After_Receipt_Count_'+plantform] / data['Total_Count_'+plantform])).fillna(0)
    data['Payment_Without_Delivery_Score_'+plantform] = np.log(data['Payment_Without_Delivery_Count_'+plantform] + np.log(
        data['Amount_of_Loss_'+plantform]) + 50 * np.exp(1) * np.exp(10 * data['Payment_Without_Delivery_Count_'+plantform] / data['Total_Count_'+plantform])).fillna(0)
    data['Total_Score_'+plantform] = (1/100*(2**(3 * (0.4*data['Refund_Only_Score_'+plantform] + 0.2*data['Rental_Not_Returned_Score_'+plantform] +
                           0.3*data['Partial_Payment_After_Receipt_Score_'+plantform] + 0.1*data['Payment_Without_Delivery_Score_'+plantform]))-1)).fillna(0)
    return data



def Level(weekly_file, monthly_file, yearly_file):
    print("数据标记中...")
    Count(weekly_file)
    Count(monthly_file)
    Count(yearly_file)
    # 获取平台名称
    short_name = weekly_file.split('/')[-1]
    plantform = short_name.split('_')[1].split('.')[0]

    file_path = weekly_file.split(short_name)[0]
    file_name_weekly = weekly_file.split('/')[-1]
    file_name_monthly = monthly_file.split('/')[-1]
    file_name_yearly = yearly_file.split('/')[-1]

    # 加载数据
    data1 = pd.read_csv(file_path + 'count_' + file_name_weekly)
    data2 = pd.read_csv(file_path + 'count_' + file_name_monthly)
    data3 = pd.read_csv(file_path + 'count_' + file_name_yearly)

    print("等级划分中...")
    # 计算恶意行为分数
    data1 = Cale_Total(data1, plantform)
    data2 = Cale_Total(data2, plantform)
    data3 = Cale_Total(data3, plantform)

    # 分类用户等级
    data1['level_' + plantform] = data1.apply(classify_user, args=(data2, data3, plantform), axis=1)
    plantform = "_" + plantform

    # 删除多余的列
    columns_to_drop = [
        'Refund_Only_Score' + plantform,
        'Rental_Not_Returned_Score' + plantform,
        'Partial_Payment_After_Receipt_Score' + plantform,
        'Payment_Without_Delivery_Score' + plantform,
        'Total_Score' + plantform
    ]
    data_to_save = data1.drop(columns=columns_to_drop)
    plantform = plantform.split('_')[1]

    print("保存数据中...")
    # 保存结果
    data_to_save.to_csv(
        file_path + 'leveled_' + short_name,
        index=False,
        header=[
            'ID',
            'Total_Count_' + plantform,
            'Refund_Only_Count_' + plantform,
            'Rental_Not_Returned_Count_' + plantform,
            'Partial_Payment_After_Receipt_Count_' + plantform,
            'Payment_Without_Delivery_Count_' + plantform,
            'Amount_of_Loss_' + plantform,
            'level_' + plantform
        ]
    )
    print("用户等级数据已保存到：", file_path + 'leveled_' + short_name)

# 使用 argparse 获取参数
def main():
    parser = argparse.ArgumentParser(description="处理订单文件")
    parser.add_argument("--weekly", required=True, help="周记录文件路径")
    parser.add_argument("--monthly", required=True, help="月记录文件路径")
    parser.add_argument("--yearly", required=True, help="年记录文件路径")
    args = parser.parse_args()

    # for i in vars(args):
    #     print(i, getattr(args, i))

    # 调用 Level 函数处理数据
    Level(args.weekly, args.monthly, args.yearly)
    print("数据处理完成！")

if __name__ == "__main__":
    main()