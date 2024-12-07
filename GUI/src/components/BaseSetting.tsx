import React, { useState } from "react";

const BaseSetting: React.FC = () => {
  const [envPath, setEnvPath] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [rayIp, setRayIp] = useState("");
  const [rayPort, setRayPort] = useState("20000");
  const [spuIp, setSpuIp] = useState("");
  const [spuPort, setSpuPort] = useState("9000");
  const [isActive, setIsActive] = useState(false);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setEnvPath(event.target.files[0].path);
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
      }}
    >
      {/* 头栏 */}
      <header
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#f4f4f4",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        基础设置
      </header>
      {/* 项目标题和版本号 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "1rem",
          flex: "1 0 auto",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#f4f4f4",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src="src/assets/logo_rsq.png"
          alt="Logo"
          style={{ width: "200px", height: "200px", marginBottom: "1rem" }}
        />
        <div
          style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "0.5rem",
          }}
        >
          <span style={{ color: "3572EF" }}>C</span>ommerce <span style={{ color: "3572EF" }}>S</span>ecurity <span style={{ color: "3572EF" }}>G</span>overnance <span style={{ color: "3572EF" }}>O</span>ver privacy alliance
        </div>
        <div style={{ fontSize: "1rem" }}>版本号: 0.1.1</div>
      </div>

      {/* 环境检查 */}
      <div
        style={{
          flex: "0 0 auto",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#f4f4f4",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>环境检查</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* 检查按钮 */}
          <button
            style={{
              flex: "0 0 25%",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #ddd",
              backgroundColor: isActive ? "#0056b3" : "#3572EF",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            检查
          </button>
          {/* 环境路径文件选择 */}
          <input
            type="file"
            webkitdirectory=""
            value={envPath}
            onChange={handleFileInput}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
            placeholder="环境路径"
          />
        </div>
      </div>

      {/* 基础设置 */}
      <div
        style={{
          flex: "0 0 auto",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#f4f4f4",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>基础设置</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* 第一列 */}
          <div style={{ flex: "6 1 auto" }}>
            {/* 项目文件保存路径 */}
            <div style={{ marginBottom: "1rem", paddingRight: "1rem" }}>
              <input
                type="file"
                webkitdirectory="true"
                directory=""
                value={projectPath}
                onChange={(e) => setProjectPath(e.target.files?.[0]?.path || "")}
                placeholder="项目文件保存路径"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            {/* Ray 集群 IP 和端口 */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <input
                type="text"
                value={rayIp}
                onChange={(e) => setRayIp(e.target.value)}
                placeholder="自己的 Ray 节点 IP"
                style={{
                  flex: "1 1 auto",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="number"
                value={rayPort}
                onChange={(e) => setRayPort(e.target.value)}
                placeholder="端口"
                style={{
                  flex: "1 1 auto",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            {/* SPU IP 和端口 */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "0rem" }}>
              {/* 姓名 */}
              <input
                type="text"
                placeholder="姓名"
                style={{
                  flex: "1 1 auto",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              {/* SPU IP */}
              <input
                type="text"
                value={spuIp}
                onChange={(e) => setSpuIp(e.target.value)}
                placeholder="自己的 SPU 设备 IP"
                style={{
                  flex: "1 1 auto",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              {/* 端口 */}
              <input
                type="number"
                value={spuPort}
                onChange={(e) => setSpuPort(e.target.value)}
                placeholder="端口"
                style={{
                  flex: "1 1 auto",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </div>

          {/* 第二列 */}
          <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button
              style={{
                flex: "2 0 auto",
                padding: "0rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: isActive ? "#0056b3" : "#3572EF",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              加载上一次设置
            </button>
            <button
              style={{
                flex: "1 0 auto",
                padding: "0rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: isActive ? "#0056b3" : "#3572EF",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseSetting;
