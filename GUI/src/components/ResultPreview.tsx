import React, { useState } from 'react';
import Papa from 'papaparse';

const ResultPreview = () => {
  const [htmlContent, setHtmlContent] = useState<string | ArrayBuffer | null>(null);
  const [csvContent, setCsvContent] = useState<string[][] | null>(null);

  const handleHtmlFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result !== undefined) {
          setHtmlContent(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result !== undefined) {
          const csvData = Papa.parse<string[]>(e.target.result as string, {
            header: false,
          }).data;
          setCsvContent(csvData);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderHtmlContent = (content: string | ArrayBuffer | null) => {
    if (!content) {
      return <div>没有设置准确率图形HTML文件</div>;
    }

    return <div dangerouslySetInnerHTML={{ __html: content as string }} />;
  };
  const renderCsvContent = (content: string[][] | null) => {
    if (!content) {
      return <div>没有选择预测结果CSV文件</div>;
    }

    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {content[0].map((header, index) => (
              <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
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
    <div>
      {/* HTML 文件选择器 */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "0.5rem",
          marginBottom: "1rem",
          display: "flex",                    
          width: "calc(100vw - 420px)", // 固定宽度
        }}
      >
        {/* <label htmlFor="htmlFile">选择 HTML 文件:</label> */}
        <input id="htmlFile" type="file" accept=".html" onChange={handleHtmlFileChange} />
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
          marginTop: "1rem",
          height: "calc(100vh - 650px)", // 固定高度
          width: "calc(100vw - 440px)", // 固定宽度
          overflow: "auto", // 超出内容滚动
          paddingBottom: "1rem",
        }}
      >
        <h2 style={{ margin: 0, paddingBottom: "0.5rem" }}>准确率图像</h2>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
            overflow: "auto", // 超出内容滚动
            padding: "1rem",
          }}
        >
          {renderHtmlContent(htmlContent)}
        </div>
      </div>
      {/* CSV 文件选择器 */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "0.5rem",
          marginBottom: "1rem",
          marginTop: "1rem",
          display: "flex",                    
          width: "calc(100vw - 420px)", // 固定宽度
        }}
      >
        {/* <label htmlFor="htmlFile">选择 HTML 文件:</label> */}
        <input id="htmlFile" type="file" accept=".html" onChange={handleCsvFileChange} />
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
          marginTop: "1rem",
          height: "calc(100vh - 650px)", // 固定高度
          width: "calc(100vw - 440px)", // 固定宽度
          overflow: "auto", // 超出内容滚动
        }}
      >
        <h2 style={{ margin: 0, paddingBottom: "0.5rem" }}>预测结果</h2>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
            overflow: "auto", // 超出内容滚动
            whiteSpace: "pre-wrap", // 保留换行符
            padding: "1rem",
          }}
        >
          {renderCsvContent(csvContent)}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ResultPreview;