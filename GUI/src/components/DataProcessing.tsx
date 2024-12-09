import React, { useState, useRef, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";

const DataProcessing: React.FC = () => {
  const [terminalOutput, setTerminalOutput] = useState<string>("连接中...\n");
  const terminalRef = useRef<HTMLDivElement>(null);

  // 按钮点击事件处理函数
  const handleStartProcessing = async () => {
    try {
      // 创建 Shell 命令实例
      const command = Command.create("python3", ["scripts/date_man.py"]);

      // 监听命令输出
      command.on("close", (data) => {
        setTerminalOutput((prev) => prev + `\n[完成]: 进程退出，代码: ${data.code}\n`);
      });

      command.on("error", (error) => {
        setTerminalOutput((prev) => prev + `[错误]: ${error}\n`);
      });

      command.stdout.on("data", (line) => {
        setTerminalOutput((prev) => prev + line);
      });

      command.stderr.on("data", (line) => {
        setTerminalOutput((prev) => prev + `[进程]: ${line}\n`);
      });

      // 启动命令
      await command.spawn();
      setTerminalOutput((prev) => prev + "处理完成！\n");
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
      {/* 头栏 */}
      <div
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          padding: "1rem",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        数据处理
      </div>

      {/* 文件路径框 */}
      <div
        style={{
          flex: "0 1 auto",
          display: "flex",
          flexDirection: "column",
          gap: "0rem",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ margin: 0, paddingBottom: "1rem" }}>文件路径</h2>

        <div
          style={{
            display: "flex",
            height: "100%",
            gap: "1rem",
          }}
        >
          <div
            style={{
              flex: "3 1 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "1rem 0",
            }}
          >
            <div>
              <label htmlFor="weekly-path" style={{ fontWeight: "bold" }}>
                周记录文件路径:
              </label>
              <input
                type="file"
                id="weekly-path"
                style={{
                  width: "98.5%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                }}
                placeholder="请选择周记录文件"
              />
            </div>

            <div>
              <label htmlFor="monthly-path" style={{ fontWeight: "bold" }}>
                月记录文件路径:
              </label>
              <input
                type="file"
                id="monthly-path"
                style={{
                  width: "98.5%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                }}
                placeholder="请选择月记录文件"
              />
            </div>

            <div>
              <label htmlFor="yearly-path" style={{ fontWeight: "bold" }}>
                年记录文件路径:
              </label>
              <input
                type="file"
                id="yearly-path"
                style={{
                  width: "98.5%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                }}
                placeholder="请选择年记录文件"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0rem",
                gap: "1rem",
                padding: "0rem",
              }}
            >
              <button
                style={{
                  flex: "1 1 auto",
                  padding: "1rem",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "#3572EF",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                加载上一次配置
              </button>
              <button
                style={{
                  flex: "1 1 auto",
                  padding: "1rem",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "#050C9C",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                保存
              </button>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                padding: "1rem",
                fontSize: "1.2rem",
                borderRadius: "8px",
                backgroundColor: "#3572EF",
                color: "white",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                width: "100%",
                height: "100%",
              }}
              onClick={handleStartProcessing}
            >
              开始处理！
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: "2 1 auto",
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
            flex: 1, // 让终端界面填满剩余空间
            backgroundColor: "#000",
            color: "#0f0",
            borderRadius: "8px",
            padding: "0.5rem",
            overflowY: "auto", // 确保终端界面内容溢出时启用滚动条
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            maxHeight: "calc(100vh - 645px)", // 动态高度：整个视窗高度减去其他固定部分
          }}
          ref={terminalRef}
        >
          {terminalOutput}
        </div>
      </div>
    </div>
  );
};

export default DataProcessing;
