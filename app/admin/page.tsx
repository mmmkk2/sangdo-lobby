"use client";

import { useEffect, useState } from "react";

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: 420,
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: 15,
  boxSizing: "border-box",
  marginTop: 6,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
};

const hintStyle: React.CSSProperties = {
  color: "#666",
  fontSize: 13,
  margin: "4px 0 0",
};

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  marginTop: 8,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  border: "none",
  borderRadius: 8,
  background: "#063426",
  color: "white",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [violatingStudents, setViolatingStudents] = useState("");
  const [allowPermanent, setAllowPermanent] = useState(true);
  const [allowTemporary, setAllowTemporary] = useState(true);
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    fetch(`/api/config?t=${Date.now()}`)
      .then((res) => res.json())
      .then((config) => {
        setViolatingStudents(config.violatingStudents ?? "");
        setAllowPermanent(config.allowPermanent ?? true);
        setAllowTemporary(config.allowTemporary ?? true);
      })
      .catch(() => {});
  }, []);

  async function saveSettings() {
    setSettingsMessage("저장 중...");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ violatingStudents, allowPermanent, allowTemporary }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsMessage(`저장 실패: ${data.error || "unknown"}`);
        return;
      }
      setSettingsMessage("저장 완료.");
    } catch (err: any) {
      setSettingsMessage(`저장 실패: ${err.message || String(err)}`);
    }
  }

  const isError = settingsMessage.startsWith("저장 실패");

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "32px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>설정</h1>
      <p style={{ ...hintStyle, marginBottom: 24 }}>
        관리자 토큰을 입력한 뒤 값을 수정하고 저장하세요.
      </p>

      <div>
        <label style={labelStyle}>관리자 토큰</label>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
          placeholder="ADMIN_TOKEN"
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle}>규칙 위반 학생 명단</label>
        <p style={hintStyle}>임시 경고 슬라이드 부제목에 표시됩니다.</p>
        <input
          value={violatingStudents}
          onChange={(e) => setViolatingStudents(e.target.value)}
          placeholder="학생1, 학생2, 학생3"
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle}>공지 표시 여부</label>
        <label style={checkboxRowStyle}>
          <input
            type="checkbox"
            checked={allowPermanent}
            onChange={(e) => setAllowPermanent(e.target.checked)}
          />
          상시 공지 (permanent) 표시
        </label>
        <label style={checkboxRowStyle}>
          <input
            type="checkbox"
            checked={allowTemporary}
            onChange={(e) => setAllowTemporary(e.target.checked)}
          />
          임시 공지 (temporary) 표시
        </label>
      </div>

      <button onClick={saveSettings} style={{ ...buttonStyle, marginTop: 24 }}>
        설정 저장
      </button>

      {settingsMessage && (
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            color: isError ? "#b00020" : "#0a7d3b",
          }}
        >
          {settingsMessage}
        </div>
      )}
    </div>
  );
}
