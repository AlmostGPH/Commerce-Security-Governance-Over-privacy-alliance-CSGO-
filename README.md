

# CSGO-联邦隐私商业安全保障


<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />


<p align="center">
  <a href="https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-/">
    <img src="https://s2.loli.net/2024/12/10/x4Ptv8DnriGqg9A.png" alt="Logo" width="120" height="120">
  </a>

  <h3 align="center">CSGO 联邦隐私商业安全保障</h3>
  <p align="center">
    一个基于隐语多方安全隐私计算框架和Tauri框架的拆分学习交易风控系统

</p>



CSGO: 联邦隐私商业安全保障 （Commerce Security & Governance Over privacy alliance） 是基于 [隐语· SecretFlow](https://www.secretflow.org.cn/zh-CN/) 隐私计算框架，针对当前“先用后付”“仅退款”等电子商务新场景，通过不同平台间购物者信用信息隐私共享，使用拆分学习，从而识别恶意用户并限制额度的交易风控系统。

 
## 目录

- [环境要求](#环境要求)
- [CLI部署](#CLI部署)
  - [获取源码](#获取源码)
  - [安装依赖环境](#安装依赖环境)
  - [调试运行](#调试运行)
  - [配置](#配置)
  - [启动 Ray 集群](#启动Ray集群)
    - [初次运行](#初次运行)
    - [非初次运行](#非初次运行)
- [GUI部署](#GUI部署)
  - [From Release](#FromRelease)
  - [From Source](#FromSource)
    - [获取源码](#获取源码)
    - [安装依赖环境](#安装依赖环境)
    - [安装必要的包](#安装必要的包)
    - [开始构建](#开始构建)
- [数据格式](#数据格式)
  - [csv数据格式](#csv数据格式)
    - [原始数据](#原始数据)
    - [统计数据](#统计数据)
    - [训练集数据](#训练集数据)
    - [测试集数据](#测试集数据)
- [CLI运行](#CLI运行)
  - [项目运行](#项目运行)
  - [生成数据集](#生成数据集)
  - [统计数据](#统计数据)
- [GUI运行](#GUI运行)
  - [GUI引导](#GUI引导)


---

# 获奖情况

本项目在山东大学×蚂蚁集团隐语SecretFlow举办的2024年数据要素流通创意大赛中获得一等奖（第一名）。


---
# 环境要求

- GNU/Linux 
  - 暂不支持 Windows 与 MacOS
- Python: 3.10
- Pip: >= 19.3
- CPU/Memory: 推荐最低配置 8C16G

# CLI部署

cmd.txt 是用于演示视频的命令

## 获取源码

```bash
git clone https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-.git
cd Commerce-Security-Governance-Over-privacy-alliance-CSGO-/
```

## 安装依赖环境

```bash
python3.10 -m venv venv # 创建 Python 3.10 虚拟环境
source venv/bin/activate # 激活虚拟环境
pip install -r requirements.txt # 安装依赖包
```

**之后的命令都要运行在刚刚创建的虚拟环境下**

## 调试运行

```bash
python main.py --debug
```
将会开启调试模式，全部计算将会在本机模拟运行


## 配置


## 启动Ray集群

将以下命令中的 `{IP}` 替换为当前运行机器的 IP 地址，将 `{Port}` 替换为你选择的用于 Ray 集群的端口，运行：
```bash
ray start --head --node-ip-address="{IP}" --port="{Port}" --include-dashboard=False --disable-usage-stats
```



### 初次运行

初次配置直接运行：
```bash
python main.py 
```
根据交互式说明即可生成配置文件。

### 非初次运行

在 `config.py` 存在的情况下，直接运行：
```bash
python main.py [-c path/to/config.py] --ray-address IP:PORT
```
即可实现全无人值守运行。


# GUI部署

## FromRelease

下载最新的 Release

## FromSource

### 获取源码

```bash
git clone https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-.git
cd Commerce-Security-Governance-Over-privacy-alliance-CSGO-/
```

### 安装依赖环境

```bash
python3.10 -m venv venv # 创建 Python 3.10 虚拟环境
source venv/bin/activate # 激活虚拟环境
pip install -r requirements.txt # 安装依赖包
```
### 安装必要的包

> *本项目GUI使用Tauri框架，请直接前往Tauri官网配置前置：*[https://v2.tauri.app/zh-cn/start/prerequisites/](https://v2.tauri.app/zh-cn/start/prerequisites/)


安装 tauri-cli
```bash
yay tauri-cli
```

### 开始构建

```bash
cd GUI
npm install
npm run tauri build --verbose
```


# 数据格式
## csv数据格式

在本项目运行时，输入文件全为csv文件，以下将介绍部分文件格式要求。

### 原始数据
以 `orders_TB.csv`文件为例，其文件索引如下所示：
```csv
Order_ID_TB,Real_Name_User(ID Card),Seller_Information_(ID Card),Product_Information_TB,Product_Amount_TB,Order_Creation_Time_TB,Payment_Time_TB,Shipping_Time_TB,Receiving_Time_TB,Refund_Time_TB,Return_Time_TB,Payment_Amount_TB,Refund_Amount_TB,Platform_Type_TB
```
分别代表订单号、用户ID、卖家ID、产品信息、产品价格、订单创建时间、订单支付时间、发货时间、收货时间、退款时间、退货时间、付款金额、退款金额、平台类型。

其他平台订单信息类似上文所述。

### 统计数据
统计数据是根据订单数据统计相关行为后得到的文件。

以 `orders_JD.csv`文件为例，其文件索引如下所示：
```csv
ID,Total_Count_JD,Refund_Only_Count_JD,Rental_Not_Returned_Count_JD,Partial_Payment_After_Receipt_Count_JD,Payment_Without_Delivery_Count_JD,Amount_of_Loss_JD
```
用户ID、总订单数量、仅退款不退货次数、租用未归还次数、仅支付订金次数、付款不发货次数、损失金额。

其中，支付平台的数据类型格式如下：
```csv
ID,Credit_Score
```
代表用户ID与信用分。

其他平台订单信息类似上文所述。


### 训练集数据

训练集数据分为train_data与train_label，train_data为各方所持有的特征数据，train_label为label持有方的标签数据。在该场景中，label为信用等级，label持有方为支付平台。

train_data与统计数据格式相同，train_label格式如下：
```csv
ID,Credit_Score,level_Total
```
level_Total即为对应的label。

### 测试集数据

测试集数据的格式与统计数据格式要求相同。

# CLI运行

## 项目运行

运行 python main.py，根据交互式终端界面输入对应的信息即可，示例信息参考 cmd.txt

点击查看[演示视频](https://www.bilibili.com/video/BV1cE4HesEph/)

## 生成数据集

在`DataGen`文件夹中运行`Data_gen.py`即可生成数据，默认生成两方电子平台与支付平台的订单信息。

若需修改总订单量，即修改对应数量即可：
```python
for _ in tqdm(range(100000)):  # 生成100000个随机订单
```
其余各类订单量同理。

## 统计数据
若要对数据集进行统计处理，运行`Data_tag.py`。

对于不同的数据集，只需修改代码中的下列文件名信息即可。
```python
if __name__ == '__main__':
    file1 = 'orders_TB.csv'
    file2 = 'orders_TB_Month.csv'
    file3 = 'orders_TB_Half_Year.csv'
    Level(file1,file2,file3)
    file4 = 'orders_JD.csv'
    file5 = 'orders_JD_Month.csv'
    file6 = 'orders_JD_Half_Year.csv'
    Level(file4,file5,file6)   
    # file7 = 'orders_Total.csv'
    # file8 = 'orders_Total_Month.csv'
    # file9 = 'orders_Total_Half_Year.csv'
    # Level(file7,file8,file9)
```
# GUI运行

部署完毕后运行可执行文件

## GUI引导

<!-- ![light.png](https://s2.loli.net/2024/12/11/aWFixzyK9HDm8Po.png) -->


![dark.png](https://s2.loli.net/2024/12/11/C2o8EafkJ3HSNue.png)

# TODO

- 配置名称顺序固定
- 图标显示修复
- 界面大小修复
- 元素宽度自适应修复
- 自动预览结果
- 环境检查与自动安装


<!-- links -->
[your-project-path]:/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-
[contributors-shield]: https://img.shields.io/github/contributors/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-.svg?style=flat-square
[contributors-url]: https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-.svg?style=flat-square
[forks-url]: https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-/network/members
[stars-shield]: https://img.shields.io/github/stars/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-.svg?style=flat-square
[stars-url]: https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-/stargazers
[issues-shield]: https://img.shields.io/github/issues/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-.svg?style=flat-square
[issues-url]: https://img.shields.io/github/issues/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-.svg
[license-shield]: https://img.shields.io/github/license/shaojintian/Best_README_template.svg?style=flat-square
[license-url]: https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/shaojintian
