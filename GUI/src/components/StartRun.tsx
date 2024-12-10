import React, { useState, useRef, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { readTextFile } from "@tauri-apps/plugin-fs";

const RunInterface: React.FC = () => {
  const [terminalOutput, setTerminalOutput] = useState<string>("等待连接...\n");
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleStartProcessing = async () => {
    const config = await readTextFile("runtime.conf.json");
    const configData = JSON.parse(config);
    const envPath = configData.python_env_path;
    const filePath = configData.file_save_path;
    const rayIp = configData.ray_cluster.ip;
    const rayPort = configData.ray_cluster.port;
    const part1Name = configData.participants[0].name;
    const part1Ip = configData.participants[0].ip;
    const part1Port = configData.participants[0].port;
    const part2Name = configData.participants[1].name;
    const part2Ip = configData.participants[1].ip;
    const part2Port = configData.participants[1].port;
    const part3Name = configData.participants[2].name;
    const part3Ip = configData.participants[2].ip;
    const part3Port = configData.participants[2].port;
    const hostName = configData.host_name;
    const Tdate = configData.training_data_path;
    const Pdate = configData.prediction_data_path;
    const psiData = configData.results.psi_results;
    const leveledData = configData.results.leveled_results;
    const limData = configData.results.limited_results;
    const currData = configData.results.currency_results;

    if (
      !envPath ||
      !filePath ||
      !rayIp ||
      !rayPort ||
      !part1Name ||
      !part1Ip ||
      !part1Port ||
      !part2Name ||
      !part2Ip ||
      !part2Port ||
      !part3Name ||
      !part3Ip ||
      !part3Port ||
      !hostName ||
      !Tdate ||
      !Pdate ||
      !psiData ||
      !leveledData ||
      !limData ||
      !currData
    ) {
      setTerminalOutput((prev) => prev + "[错误]: 请先正确设置！\n");
      return;
    }

    try {
      // 创建命令并动态传递参数
      const command = Command.create("sh", [
        "scripts/start.sh",
        "--envPath",
        envPath,
        "--filePath",
        filePath,
        "--rayIp",
        rayIp,
        "--rayPort",
        String(rayPort),
        "--part1Name",
        part1Name,
        "--part1Ip",
        part1Ip,
        "--part1Port",
        String(part1Port),
        "--part2Name",
        part2Name,
        "--part2Ip",
        part2Ip,
        "--part2Port",
        String(part2Port),
        "--part3Name",
        part3Name,
        "--part3Ip",
        part3Ip,
        "--part3Port",
        String(part3Port),
        "--hostName",
        hostName,
        "--Tdate",
        Tdate,
        "--Pdate",
        Pdate,
        "--psiData",
        psiData,
        "--leveledData",
        leveledData,
        "--limData",
        limData,
        "--currData",
        currData,
      ]);
      console.log(command);
      // 监听命令输出
      command.on("close", (data) => {
        setTerminalOutput(
          (prev) => prev + `\n[完成]: 进程退出，代码: ${data.code}\n`
        );
      });

      command.on("error", (error) => {
        setTerminalOutput((prev) => prev + `[错误]: ${error}\n`);
      });

      command.stdout.on("data", (line) => {
        setTerminalOutput((prev) => prev + `[输出]: ${line}\n`);
      });

      command.stderr.on("data", (line) => {
        if (!line.includes("RuntimeWarning") && !line.includes("getattr")) {
          setTerminalOutput((prev) => prev + `[提示]: ${line}\n`);
        }
      });

      // 启动命令
      await command.spawn();
      setTerminalOutput((prev) => prev + "连接成功！\n");
    } catch (error) {
      console.error("Error executing command:", error);
      setTerminalOutput((prev) => prev + "[错误]: 执行失败！\n");
    }
  };

  // 自动滚动到最新内容
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleStopProcessing = async () => {
    try {
      const command = Command.create("sh", ["-c", "pkill -f scripts/start.sh"]);
      await command.spawn();
      setTerminalOutput((prev) => prev + "[提示]: 终止运行命令已发送。\n");
    } catch (error) {
      console.error("Error stopping command:", error);
      console.log(error);
      setTerminalOutput((prev) => prev + "[错误]: 终止运行失败！\n");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "0rem",
        paddingLeft: "1rem",
        gap: "1rem",
      }}
    >
      {/* 按钮框 */}
      <div
        style={{
          height: "14%",
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          padding: "1rem",
        }}
      >
        <button
          onClick={handleStartProcessing}
          onMouseDown={(e) =>
            (e.currentTarget.style.backgroundColor = "#2A5DB0")
          }
          onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#3572EF")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#3572EF")
          }
          style={{
            flex: "1 1 auto",
            padding: "0rem",
            fontSize: "1.5rem",
            borderRadius: "8px",
            backgroundColor: "#3572EF",
            color: "white",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          开始运行
        </button>

        <button
          onClick={handleStopProcessing}
          onMouseDown={(e) =>
            (e.currentTarget.style.backgroundColor = "#040A7A")
          }
          onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#050C9C")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#050C9C")
          }
          style={{
            flex: "1 1 auto",
            padding: "0rem",
            fontSize: "1.5rem",
            borderRadius: "8px",
            backgroundColor: "#050C9C",
            color: "white",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          终止运行
        </button>
      </div>

      {/* 终端界面框 */}
      <div
        style={{
          flex: "1 1 auto",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ margin: 0, paddingBottom: "0.5rem" }}>终端界面</h2>
        <div
          style={{
            flex: 1,
            backgroundColor: "#000",
            color: "#0f0",
            borderRadius: "8px",
            padding: "0.5rem",
            overflowY: "auto",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            maxHeight: "calc(100vh - 300px)",
          }}
          ref={terminalRef}
        >
          {terminalOutput}
        </div>
      </div>
    </div>
  );
};
export default RunInterface;
