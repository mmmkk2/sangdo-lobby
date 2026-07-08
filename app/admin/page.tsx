"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [violatingStudents, setViolatingStudents] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    fetch(`/api/config?t=${Date.now()}`)
      .then((res) => res.json())
      .then((config) => setViolatingStudents(config.violatingStudents ?? ""))
      .catch(() => {});
  }, []);

  async function saveSettings() {
    setSettingsMessage("저장 중...");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ violatingStudents }),
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

  async function upload(file: File, key: string) {
    setMessage(`Requesting upload URL for ${key}...`);
    const presignRes = await fetch('/api/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key, contentType: file.type }),
    });

    const presign = await presignRes.json();
    if (!presign.url) {
      setMessage(`Presign failed: ${presign.error || 'unknown'}`);
      return false;
    }

    setMessage(`Uploading ${key}...`);
    const putRes = await fetch(presign.url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!putRes.ok) {
      setMessage(`Upload failed: ${putRes.statusText}`);
      return false;
    }

    setMessage(`Uploaded. Public URL: ${presign.publicUrl}`);
    return true;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin: Upload notices</h1>
      <p>Enter admin token (set as `ADMIN_TOKEN` in Vercel env).</p>
      <input value={token} onChange={(e) => setToken(e.target.value)} style={{ width: 400 }} />

      <h2>notices.json (permanent)</h2>
      <input type="file" accept="application/json" onChange={(e) => setFile1(e.target.files?.[0] ?? null)} />

      <h2>notices_temp.json (temporary)</h2>
      <input type="file" accept="application/json" onChange={(e) => setFile2(e.target.files?.[0] ?? null)} />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={async () => {
            setMessage('Starting upload...');
            if (file1) await upload(file1, 'notices.json');
            if (file2) await upload(file2, 'notices_temp.json');
          }}
        >
          Upload Selected Files
        </button>
      </div>

      <div style={{ marginTop: 12, color: 'green' }}>{message}</div>

      <hr style={{ margin: '32px 0' }} />

      <h1>설정 (Settings)</h1>
      <h2>규칙 위반 학생 명단</h2>
      <p>임시 경고 슬라이드 부제목에 표시됩니다.</p>
      <input
        value={violatingStudents}
        onChange={(e) => setViolatingStudents(e.target.value)}
        placeholder="학생1, 학생2, 학생3"
        style={{ width: 400 }}
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={saveSettings}>설정 저장</button>
      </div>

      <div style={{ marginTop: 12, color: 'green' }}>{settingsMessage}</div>
    </div>
  );
}
