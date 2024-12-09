#!/bin/bash

# 初始化变量
envPath=""
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


# 首先source envPath

echo "正在启动环境"
source $envPath
echo "环境启动成功"
# 然后启动ray集群，示例：ray start --head --node-ip-address="192.168.141.89" --port="20000" --include-dashboard=False --disable-usage-stats

echo "正在启动ray集群"
ray start --head --node-ip-address=$rayIp --port=$rayPort --include-dashboard=False --disable-usage-stats
echo "ray集群启动成功"
# 然后运行python脚本，并将剩下的参数当作参数输入，输给脚本

echo "正在运行项目脚本"
python3 $envPath/src-tauri/scripts/main.py --part1Name $part1Name --part1Ip $part1Ip --part1Port $part1Port --part2Name $part2Name --part2Ip $part2Ip --part2Port $part2Port --part3Name $part3Name --part3Ip $part3Ip --part3Port $part3Port --hostName $hostName --Tdate $Tdate --Pdate $Pdate --psiData $psiData --leveledData $leveledData --limData $limData --currData $currData
echo "项目运行成功"