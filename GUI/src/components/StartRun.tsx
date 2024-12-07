import React, { useState } from "react";

const RunInterface: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1rem",
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
          onClick={handleStart}
          style={{
            flex: "1 1 auto",
            padding: "1rem",
            fontSize: "1.2rem",
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
          onClick={handleStop}
          style={{
            flex: "1 1 auto",
            padding: "1rem",
            fontSize: "1.2rem",
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
          }}
        >
          {isRunning ? <p>正在运行...</p> : <p>连接中...</p>}
        </div>
      </div>
    </div>
  );
};

export default RunInterface;
