import React from "react";
import { Command } from "@tauri-apps/plugin-shell";

const DataProcessing: React.FC = () => {
  // 按钮点击事件处理函数
  const handleStartProcessing = async () => {
    try {
      // 创建并运行 Shell 命令
      const command = Command.create("python3", ["scripts/date_man.py"]);
      const output = await command.execute();

      console.log("Command output:", output);
      alert("处理完成！请检查日志或结果。");
    } catch (error) {
      console.error("Error executing command:", error);
      alert("处理失败，请检查脚本或配置！");
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
          {/* 第一列：文件路径选择框 */}
          <div
            style={{
              flex: "3 1 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "0rem",
              paddingRight: "0rem",
              paddingBottom: "0rem",
              paddingLeft: "0rem",
              paddingTop: "1rem",
            }}
          >
            <div>
              <label htmlFor="weekly-path" style={{ fontWeight: "bold" }}>
                周记录文件路径:
              </label>
              <input
                type="file"
                id="weekly-path"
                style={{ ...inputStyle, paddingRight: "0rem", width: "98.5%", paddingBottom: "0.5rem" }}
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
                style={{ ...inputStyle, paddingRight: "0rem", width: "98.5%" }}
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
                style={{ ...inputStyle, paddingRight: "0rem", width: "98.5%" }}
                placeholder="请选择年记录文件"
              />
            </div>

            {/* 配置按钮 */}
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

          {/* 第二列：处理按钮 */}
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

      {/* 终端界面框 */}
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
            flex: 1,
            backgroundColor: "#000",
            color: "#0f0",
            borderRadius: "8px",
            padding: "0.5rem",
            overflowY: "auto",
            fontFamily: "monospace",
          }}
        >
          <p>连接中...</p>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "1rem",
};

export default DataProcessing;
