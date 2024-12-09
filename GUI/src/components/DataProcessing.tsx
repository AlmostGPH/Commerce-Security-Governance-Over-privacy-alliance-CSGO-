import React, { useState, useRef, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { open } from "@tauri-apps/plugin-dialog";

const DataProcessing: React.FC = () => {
  const [terminalOutput, setTerminalOutput] = useState<string>("等待连接...\n");
  const [weeklyPath, setWeeklyPath] = useState<string>("");
  const [monthlyPath, setMonthlyPath] = useState<string>("");
  const [yearlyPath, setYearlyPath] = useState<string>("");
  const terminalRef = useRef<HTMLDivElement>(null);

  // 开始处理的按钮点击事件
  const handleStartProcessing = async () => {
    if (!weeklyPath || !monthlyPath || !yearlyPath) {
      setTerminalOutput((prev) => prev + "[错误]: 请先选择所有必要的文件路径！\n");
      return;
    }

    try {
      // 创建命令并动态传递参数
      const command = Command.create("python3", [
        "scripts/date_man.py",
        "--weekly", weeklyPath,
        "--monthly", monthlyPath,
        "--yearly", yearlyPath,
      ]);

      // 监听命令输出
      command.on("close", (data) => {
        setTerminalOutput((prev) => prev + `\n[完成]: 进程退出，代码: ${data.code}\n`);
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

  // 文件选择逻辑
  const handleFileSelect = async (setPath: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const filePath = await open({
        multiple: false,
        directory: false,
      });
      if (typeof filePath === "string") {
        setPath(filePath);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  // 自动滚动到最新内容
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }}>
      <div style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", padding: "1rem", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
        数据处理
      </div>

      <div style={{ flex: "0 1 auto", display: "flex", flexDirection: "column", gap: "0rem", backgroundColor: "#f4f4f4", borderRadius: "8px", padding: "1rem" }}>
        <h2 style={{ margin: 0, paddingBottom: "1rem" }}>文件路径</h2>

        <div style={{ display: "flex", height: "100%", gap: "1rem" }}>
          <div style={{ flex: "3 1 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "周记录文件路径:", path: weeklyPath, setPath: setWeeklyPath },
              { label: "月记录文件路径:", path: monthlyPath, setPath: setMonthlyPath },
              { label: "年记录文件路径:", path: yearlyPath, setPath: setYearlyPath },
            ].map(({ label, path, setPath }, index) => (
              <div key={index}>
                <label style={{ fontWeight: "bold" }}>{label}</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input type="text" value={path} readOnly style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem" }} />
                  <button onClick={() => handleFileSelect(setPath)} style={{ padding: "0.5rem 1rem", backgroundColor: "#3572EF", color: "white", border: "none", borderRadius: "8px" }}>
                    选择文件
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              style={{
                padding: "1rem",
                fontSize: "1.2rem",
                borderRadius: "8px",
                backgroundColor: "#050C9C",
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

      <div style={{ flex: "2 1 auto", backgroundColor: "#f4f4f4", borderRadius: "8px", padding: "1rem", display: "flex", flexDirection: "column" }}>
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
            maxHeight: "calc(100vh - 525px)",
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
