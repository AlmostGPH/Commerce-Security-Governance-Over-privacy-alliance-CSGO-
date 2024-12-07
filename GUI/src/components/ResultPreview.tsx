import React, { useState } from "react";

const ResultPreview: React.FC = () => {
  // 状态：HTML 和 CSV 文件路径
  const [htmlPath, setHtmlPath] = useState<string | null>(null);
  const [csvPath, setCsvPath] = useState<string | null>(null);

  // 渲染 HTML 内容
  const renderHtmlContent = () => {
    if (!htmlPath) {
      return <p>无结果文件</p>;
    }
    return (
      <iframe
        src={htmlPath}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "8px",
        }}
        title="Accuracy Graph"
      />
    );
  };

  // 渲染 CSV 内容
  const renderCsvContent = () => {
    if (!csvPath) {
      return <p>无结果文件</p>;
    }
    return (
      <div
        style={{
          overflowX: "auto",
          maxHeight: "100%",
          padding: "0.5rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <p>此处应显示 CSV 文件内容...</p>
        {/* 可扩展为解析和渲染 CSV 文件数据 */}
      </div>
    );
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
        结果预览
      </div>

      {/* 准确率图像框 */}
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
        <h2 style={{ margin: 0, paddingBottom: "0.5rem" }}>准确率图像</h2>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {renderHtmlContent()}
        </div>
      </div>

      {/* 预测结果框 */}
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
        <h2 style={{ margin: 0, paddingBottom: "0.5rem" }}>预测结果</h2>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {renderCsvContent()}
        </div>
      </div>
    </div>
  );
};

export default ResultPreview;
