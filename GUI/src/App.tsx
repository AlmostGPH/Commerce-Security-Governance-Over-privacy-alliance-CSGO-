import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import BaseSetting from "./components/BaseSetting";
import DataProcessing from "./components/DataProcessing";
import InteractionSetting from "./components/InteractionSetting";
import StartRun from "./components/StartRun";
import ResultPreview from "./components/ResultPreview";
import { saveWindowState, StateFlags } from '@tauri-apps/plugin-window-state';

saveWindowState(StateFlags.ALL);

const App: React.FC = () => {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          height: "100vh",
          minWidth: "1300px", // 限制窗口最小宽度
          minHeight: "800px", // 限制窗口最小高度
        }}
      >
        {/* 左侧导航栏 */}
        <nav
          style={{
            width: "20%",
            backgroundColor: "#f4f4f4",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start", // 修改为从顶部开始对齐
            alignItems: "center", // 使内容居中
            borderRadius: "10px",
          }}
        >
            {/* 居中的图标 */}
            <div
            style={{
              width: "80%",
              position: "relative",
              paddingTop: "80%", // 确保高度与宽度相同
              marginBottom: "1rem", // 为图标和按钮之间添加间距
            }}
            >
            <a href="https://github.com/bbbbhrrrr/Commerce-Security-Governance-Over-privacy-alliance-CSGO-" target="_blank" rel="noopener noreferrer">
              <img
              src="src/assets/logo_rsq.png" // 替换为你的图标路径
              alt="Logo"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain", // 确保图像按比例缩放
              }}
              />
            </a>
            </div>
          
          {/* 导航项 */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem", // 调整按钮之间的间距
              width: "100%", // 确保按钮占满导航栏宽度
            }}
          >
            <li style={navItemStyle}>
              <NavLink
                to="/base-setting"
                style={({ isActive }) => linkStyle(isActive)}
              >
                基础设置
              </NavLink>
            </li>
            <li style={navItemStyle}>
              <NavLink
                to="/data-processing"
                style={({ isActive }) => linkStyle(isActive)}
              >
                数据处理
              </NavLink>
            </li>
            <li style={navItemStyle}>
              <NavLink
                to="/interaction-setting"
                style={({ isActive }) => linkStyle(isActive)}
              >
                交互设置
              </NavLink>
            </li>
            <li style={navItemStyle}>
              <NavLink
                to="/start-run"
                style={({ isActive }) => linkStyle(isActive)}
              >
                开始运行
              </NavLink>
            </li>
            <li style={navItemStyle}>
              <NavLink
                to="/result-preview"
                style={({ isActive }) => linkStyle(isActive)}
              >
                结果预览
              </NavLink>
            </li>
          </ul>

            {/* 底部图片紧接在按钮下方 */}
            <div style={{ marginTop: "auto", width: "100%", display: "flex", justifyContent: "center", paddingBottom: "1rem", paddingLeft: "2rem" }}>
            <a href="https://secret-flow.antgroup.com/" target="_blank" rel="noopener noreferrer">
              <img
              src="/src/assets/sf.png" // 替换为你的底层框架图片路径
              alt="底层框架"
              style={{
              width: "80%", // 使图片宽度占满导航栏
              height: "auto",
              borderRadius: "8px", // 可选：给图片加圆角
              }}
              />
            </a>
            </div>
        </nav>

        {/* 右侧内容区域 */}
        <main style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route path="/base-setting" element={<BaseSetting />} />
            <Route path="/data-processing" element={<DataProcessing />} />
            <Route path="/interaction-setting" element={<InteractionSetting />} />
            <Route path="/start-run" element={<StartRun />} />
            <Route path="/result-preview" element={<ResultPreview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const navItemStyle = {
  borderRadius: "8px",
  display: "flex",
  alignItems: "center", // 垂直居中
  justifyContent: "center", // 水平居中
  transition: "background-color 0.3s ease",
};

import { CSSProperties } from "react";

const linkStyle = (isActive: boolean): CSSProperties => ({
  textDecoration: "none",
  color: "#fff",
  fontSize: "1.1rem",
  display: "block",
  width: "80%", // 让链接占据整个导航项的宽度
  padding: "0.8rem", // 给链接添加一些内边距
  borderRadius: "10px", // 链接圆角
  backgroundColor: isActive ? "#050C9C" : "#3572EF", // 选中时变色
  textAlign: "center" as CSSProperties["textAlign"], // 确保文字水平居中
  transition: "background-color 0.3s ease",
});

export default App;