import React, { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import { data } from "react-router-dom";

const BaseSetting: React.FC = () => {
  const [envPath, setEnvPath] = useState("");
  const [fileSavePath, setFileSavePath] = useState("");
  const [rayIp, setRayIp] = useState("");
  const [rayPort, setRayPort] = useState("20000");
  const [spuIp, setSpuIp] = useState("");
  const [spuPort, setSpuPort] = useState("9000");
  const [spuName, setSpuName] = useState("");

  // 加载配置文件
  const loadConfig = async () => {
    try {
      const config = await readTextFile("runtime.conf.json");
      const configData = JSON.parse(config);

      setEnvPath(configData.python_env_path || "");
      setFileSavePath(configData.file_save_path || "");
      setRayIp(configData.ray_cluster?.ip || "");
      setRayPort(configData.ray_cluster?.port?.toString() || "20000");
      setSpuIp(configData.participants?.[0]?.ip || "");
      setSpuPort(configData.participants?.[0]?.port?.toString() || "9000");
      setSpuName(configData.participants?.[0]?.name || "");
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  // 保存配置文件
  const saveConfig = async () => {
    const configData = {
      python_env_path: envPath,
      file_save_path: fileSavePath,
      ray_cluster: {
        ip: rayIp,
        port: parseInt(rayPort),
      },
      participants: [
        {
          name: spuName,
          ip: spuIp,
          port: parseInt(spuPort),
        },
        {
          "name": "Bob",
          "ip": "192.168.1.2",
          "port": 9000
        },
        {
          "name": "Carol",
          "ip": "192.168.1.3",
          "port": 9000
        }
      ],
      "host_name": "Carol",
      "training_data_path": "/path/to/training/data",
      "prediction_data_path": "/path/to/prediction/data",
      "results": {
        "psi_results": "results/psi_results.csv",
        "leveled_results": "results/leveled_results.csv",
        "limited_results": "results/limited_results.csv",
        "currency_results": "results/currency_results.html"
      }
    };

    try {
      let data = JSON.stringify(configData, null, 2);
      let uint8Data = new TextEncoder().encode(data);
      await writeFile(
        "runtime.conf.json", uint8Data
    );
      alert("配置保存成功！");
    } catch (error) {
      console.error("Failed to save config:", error);
      alert("配置保存失败！");
    }
  };

  // 文件选择对话框
  const handleFileSelect = async () => {
    const selectedPath = await open({
      multiple: false,
      directory: false,
    });
    if (typeof selectedPath === "string") {
      setEnvPath(selectedPath);
    }
  };

  // 文件夹选择对话框
  const handleFolderSelect = async () => {
    const selectedPath = await open({
      multiple: false,
      directory: true,
    });
    if (typeof selectedPath === "string") {
      setFileSavePath(selectedPath);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

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
          <span style={{ color: "#3572EF" }}>C</span>ommerce <span style={{ color: "#3572EF" }}>S</span>ecurity <span style={{ color: "#3572EF" }}>G</span>overnance <span style={{ color: "#3572EF" }}>O</span>ver privacy alliance
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
        <h3>环境检查</h3>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* 检查按钮 */}
          <button
            style={{
              flex: "0 0 20%",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              backgroundColor: "#3572EF",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            检查
          </button>
          
          <input
            type="text"
            value={envPath}
            readOnly
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
          <button onClick={handleFileSelect} style={{ padding: "0.5rem 1rem", backgroundColor: "#3572EF", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            隐语环境选择
          </button>
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
        <h3>基础设置</h3>
        <div style={{ display: "flex", gap: "1rem" }}>
          {/* 第一列 */}
          <div style={{ flex: "6 1 auto" }}>
            {/* 文件保存路径 */}
            <div style={{ display: "flex", gap: "1rem", }}>
              <input
                type="text"
                value={fileSavePath}
                readOnly
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  width: "70%"
                }}
              />
              <button
                onClick={handleFolderSelect}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#3572EF", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                输出文件保存路径
              </button>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <input
                type="text"
                placeholder="Ray 集群 IP"
                value={rayIp}
                onChange={(e) => setRayIp(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="number"
                placeholder="Ray 集群端口"
                value={rayPort}
                onChange={(e) => setRayPort(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              {/* 姓名 */}
              <input
                    type="text"
                    placeholder="姓名"
                    value={spuName}
                    onChange={(e) => setSpuName(e.target.value)}
                    style={{
                      flex: "1",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
              <input
                type="text"
                placeholder="自己的 SPU 设备 IP"
                value={spuIp}
                onChange={(e) => setSpuIp(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="number"
                placeholder="SPU 端口"
                value={spuPort}
                onChange={(e) => setSpuPort(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </div>
          {/* 第二列 */}
          <div style={{ flex: "1 1 auto ", display: "flex", flexDirection: "column", gap: "1rem", padding: "0rem" }}>
            {/* 按钮操作 */}
            <button
              onClick={loadConfig}
              style={{
                flex: "2 0 auto",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#3572EF",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              加载上一次设置
            </button>
            <button
              onClick={saveConfig}
              style={{
                flex: "1 0 auto",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#050C9C",
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
