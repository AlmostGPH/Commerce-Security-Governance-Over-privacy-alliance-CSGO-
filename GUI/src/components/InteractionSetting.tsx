import React, { useState } from "react";

const InteractionSetting: React.FC = () => {
  // 主持人选择的状态
  const [host, setHost] = useState<string>("");

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
        flex: "3 6 auto",
        display: "flex",
        flexDirection: "column",
        gap: "0rem",
        padding: "1rem",
          }}
        >
          {[1, 2, 3].map((index) => (
        <div key={index} style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: "1 1 auto", marginRight: "1rem" }}>
          <label htmlFor={`name-${index}`} style={{ fontWeight: "bold" }}>
        姓名:
          </label>
          <input
        type="text"
        id={`name-${index}`}
        style={{ ...inputStyle, marginBottom: "0.5rem" }}
        placeholder="请输入姓名"
          />
          </div>
          <div style={{ flex: "1 1 auto", marginRight: "1rem" }}>
          <label htmlFor={`ip-${index}`} style={{ fontWeight: "bold" }}>
        IP:
          </label>
          <input
        type="text"
        id={`ip-${index}`}
        style={{ ...inputStyle, marginBottom: "0.5rem" }}
        placeholder="请输入IP地址"
          />
          </div>
          <div style={{ flex: "1 1 auto" }}>
          <label htmlFor={`port-${index}`} style={{ fontWeight: "bold" }}>
        端口:
          </label>
          <input
        type="number"
        id={`port-${index}`}
        style={{ ...inputStyle, marginBottom: "0.5rem" }}
        defaultValue="9000"
        placeholder="请输入端口"
          />
          </div>
        </div>
          ))}
        </div>

        {/* 第二列：主持人选择 */}
        <div
          style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
          }}
        >
          <h3 style={{ margin: 0 }}>主持人选择</h3>
          <select
        value={host}
        onChange={(e) => setHost(e.target.value)}
        style={{ ...selectStyle, height: "72.5%" }}
          >
        <option value="">请选择主持人</option>
        {[1, 2, 3].map((index) => (
          <option key={index} value={`姓名${index}`}>
            姓名{index}
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
          paddingRight: "2rem",
        }}
      >
        <h2 style={{ margin: 0 }}>文件路径</h2>

        {/* 训练文件路径 */}
        <div style={{ flex: "1 1 auto" }}>
          <label htmlFor="train-path" style={{ fontWeight: "bold" }}>
        训练文件路径:
          </label>
          <input
        type="file"
        id="train-path"
        style={inputStyle}
        placeholder="请选择训练文件"
          />
        </div>

        {/* 预测文件路径 */}
        <div style={{ flex: "1 1 auto" }}>
          <label htmlFor="predict-path" style={{ fontWeight: "bold" }}>
        预测文件路径:
          </label>
          <input
        type="file"
        id="predict-path"
        style={inputStyle}
        placeholder="请选择预测文件"
          />
        </div>
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

        {/* 保存按钮 */}
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
