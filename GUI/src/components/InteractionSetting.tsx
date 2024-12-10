import React, { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeFile } from "@tauri-apps/plugin-fs";

const InteractionSetting: React.FC = () => {
  // const [filePath1, setFilePath1] = useState("");
  // const [filePath2, setFilePath2] = useState("");
  const [fileSavePath, setFileSavePath] = useState("");
  const [spuIp_1, setSpuIp1] = useState("");
  const [spuPort_1, setSpuPort1] = useState("9000");
  const [spuName_1, setSpuName1] = useState("");
  const [spuIp_2, setSpuIp2] = useState("");
  const [spuPort_2, setSpuPort2] = useState("9000");
  const [spuName_2, setSpuName2] = useState("");
  const [spuIp_3, setSpuIp3] = useState("");
  const [spuPort_3, setSpuPort3] = useState("9000");
  const [spuName_3, setSpuName3] = useState("");
  const [host, setHost] = useState<string>("");
  const [train_path, setTrainPath] = useState<string>("");
  const [predict_path, setPredictPath] = useState<string>("");
  // 加载配置文件
  const loadConfig = async () => {
    try {
      const config = await readTextFile("runtime.conf.json");
      const configData = JSON.parse(config);

      // setFilePath1(configData.python_env_path || "");
      // setFilePath2(configData.python_env_path || "");
      setFileSavePath(configData.file_save_path || "");
      // setRayIp(configData.ray_cluster?.ip || "");
      // setRayPort(configData.ray_cluster?.port?.toString() || "20000");
      setSpuIp1(configData.participants?.[0]?.ip || "");
      setSpuPort1(configData.participants?.[0]?.port?.toString() || "9000");
      setSpuName1(configData.participants?.[0]?.name || "");
      setSpuIp2(configData.participants?.[1]?.ip || "");
      setSpuPort2(configData.participants?.[1]?.port?.toString() || "9000");
      setSpuName2(configData.participants?.[1]?.name || "");
      setSpuIp3(configData.participants?.[2]?.ip || "");
      setSpuPort3(configData.participants?.[2]?.port?.toString() || "9000");
      setSpuName3(configData.participants?.[2]?.name || "");
      setHost(configData.host_name || "");
      setTrainPath(configData.training_data_path || "");
      setPredictPath(configData.prediction_data_path || "");
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  // 保存配置文件
  const saveConfig = async () => {
    const config = await readTextFile("runtime.conf.json");
    const configData = JSON.parse(config);

    configData.participants = [
      {
        name: spuName_1,
        ip: spuIp_1,
        port: parseInt(spuPort_1),
      },
      {
        name: spuName_2,
        ip: spuIp_2,
        port: parseInt(spuPort_2),
      },
      {
        name: spuName_3,
        ip: spuIp_3,
        port: parseInt(spuPort_3),
      }
    ];
    configData.host_name = host;
    configData.training_data_path = train_path;
    configData.prediction_data_path = predict_path;
    configData.results = {
      "psi_results": `${fileSavePath}results/psi_results.csv`,
      "leveled_results": `${fileSavePath}results/leveled_results.csv`,
      "limited_results": `${fileSavePath}results/limited_results.csv`,
      "currency_results": `${fileSavePath}results/currency_results.html`
    };

    try {
      let data = JSON.stringify(configData, null, 2);
      let uint8Data = new TextEncoder().encode(data);
      await writeFile(
        "runtime.conf.json", uint8Data
    );
      // alert("配置保存成功！");
    } catch (error) {
      console.error("Failed to save config:", error);
      alert("配置保存失败！");
    }
  };

  // 文件选择对话框
  const handleTFileSelect = async () => {
    const selectedPath = await open({
      multiple: false,
      directory: false,
    });
    if (typeof selectedPath === "string") {
      setTrainPath(selectedPath);
    }
  };

  const handlePFileSelect = async () => {
    const selectedPath = await open({
      multiple: false,
      directory: false,
    });
    if (typeof selectedPath === "string") {
      setPredictPath(selectedPath);
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
        交互设置
      </div>

      {/* 参与方设置框 */}
      <div
        style={{
          flex: "0 1 auto",
          display: "flex",
          gap: "1rem",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 第一列：参与方设置 */}
        <div
          style={{
          flex: "1 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "0rem",
          padding: "0rem",
          paddingRight: "1rem",
        }}
          >
          <div style={{fontSize: "1.5rem", fontWeight: "bold", paddingBottom: "1rem" ,backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
            节点信息
          </div>  
        {[1, 2, 3].map((index) => (
          <div key={index} style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: "1 1 auto", marginRight: "1rem"}}>
        <label htmlFor={`name-${index}`} style={{ fontWeight: "bold" }}>
          姓名:
        </label>
        <input
          type="text"
          id={`name-${index}`}
          style={{ ...inputStyle, marginBottom: "0.5rem", borderRadius: "8px"  }}
          placeholder="请输入姓名"
          value={index === 1 ? spuName_1 : index === 2 ? spuName_2 : spuName_3}
          onChange={(e) => {
        if (index === 1) setSpuName1(e.target.value);
        else if (index === 2) setSpuName2(e.target.value);
        else setSpuName3(e.target.value);
          }}
        />
        </div>
        <div style={{ flex: "1 1 auto", marginRight: "1rem" }}>
        <label htmlFor={`ip-${index}`} style={{ fontWeight: "bold" }}>
          IP:
        </label>
        <input
          type="text"
          id={`ip-${index}`}
          style={{ ...inputStyle, marginBottom: "0.5rem", borderRadius: "8px"  }}
          placeholder="请输入IP地址"
          value={index === 1 ? spuIp_1 : index === 2 ? spuIp_2 : spuIp_3}
          onChange={(e) => {
        if (index === 1) setSpuIp1(e.target.value);
        else if (index === 2) setSpuIp2(e.target.value);
        else setSpuIp3(e.target.value);
          }}
        />
        </div>
        <div style={{ flex: "1 1 auto" }}>
        <label htmlFor={`port-${index}`} style={{ fontWeight: "bold" }}>
          端口:
        </label>
        <input
          type="number"
          id={`port-${index}`}
          style={{ ...inputStyle, marginBottom: "0.5rem", borderRadius: "8px"  }}
          defaultValue="9000"
          placeholder="请输入端口"
          value={index === 1 ? spuPort_1 : index === 2 ? spuPort_2 : spuPort_3}
          onChange={(e) => {
        if (index === 1) setSpuPort1(e.target.value);
        else if (index === 2) setSpuPort2(e.target.value);
        else setSpuPort3(e.target.value);
          }}
        />
        </div>
          </div>
          ))}
        </div>

        {/* 第二列：主持人选择 */}
        <div
          style={{
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        height: "100%",
        paddingBottom: "3rem",
          }}
        >
          <h3 style={{ margin: 0 }}>主持人选择</h3>
            <select
          value={host}
          onChange={(e) => setHost(e.target.value)}
          style={{ ...selectStyle, height: "72.5%", borderRadius: "8px", border: "1px solid #ddd", padding: "0.5rem", flex: "1 1 auto", boxSizing: "border-box",fontWeight: "bold" }}
            >
          <option value="">请选择主持人</option>
          {[spuName_1, spuName_2, spuName_3].map((name, index) => (
            <option key={index} value={name}>
            {name}
            </option>
          ))}
            </select>
        </div>
      </div>

      {/* 文件路径框 */}
      <div
        style={{
          flex: "0 1 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          paddingRight: "1rem",
        }}
      >
        <h2 style={{ margin: 0 }}>文件路径</h2>

        {/* 训练文件路径 */}
        <div style={{ flex: "1 1 auto", paddingRight:"1rem" }}>
          <label htmlFor="train-path" style={{ fontWeight: "bold" }}>
        训练文件路径:
          </label>
          <input
        type="text"
        value={train_path}
        style={{ ...inputStyle, borderRadius: "8px" }}
        placeholder="请选择训练文件"
          />
        </div>
        <button 
        onClick={handleTFileSelect}
        onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#2A5DB0")}
        onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#3572EF")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3572EF")}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#3572EF", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        训练文件选择
          </button>
        {/* 预测文件路径 */}
        <div style={{ flex: "1 1 auto", paddingRight: "1rem" }}>
          <label htmlFor="predict-path" style={{ fontWeight: "bold" }}>
        预测文件路径:
          </label>
          <input
        type="text"
        value={predict_path}
        style={{ ...inputStyle, borderRadius: "8px" }}
        placeholder="请选择预测文件"
          />
        </div>
        <button 
        onClick={handlePFileSelect} 
        onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#2A5DB0")}
        onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#3572EF")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3572EF")}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#3572EF", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        预测文件选择
          </button>
      </div>

      {/* 选项框 */}
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          gap: "2rem",
          justifyContent: "space-between",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 加载上一次配置按钮 */}
        <button
          onClick={loadConfig} 
          onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#2A5DB0")}
          onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#3572EF")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3572EF")}
          style={{
            flex: "1 1 auto",
            padding: "1rem",
            fontSize: "1.5rem",
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

        {/* 保存按钮 */}
        <button
          onClick={saveConfig}
          onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#040A7A")}
          onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#050C9C")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#050C9C")}
          style={{
            flex: "1 1 auto",
            padding: "1rem",
            fontSize: "1.5rem", // Increased font size
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
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "1rem",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "1rem",
};

export default InteractionSetting;
