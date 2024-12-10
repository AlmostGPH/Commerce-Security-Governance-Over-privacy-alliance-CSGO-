#!/bin/bash

envPath=""

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --envPath) envPath="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

if [ -z "$envPath" ]; then
    echo "Error: --envPath is required"
    exit 1
fi


echo envPath:$envPath

echo "正在关闭ray集群"
$envPath/ray stop
echo "ray集群关闭成功"