"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: "앤딩스터디카페 상도점",
    subtitle: "조용하고 쾌적한 학습공간",
    desc: "오늘도 집중하기 좋은 하루 되세요.",
  },
  {
    title: "휴게실 이용 안내",
    subtitle: "통화와 대화는 짧고 조용하게 부탁드립니다.",
    desc: "소리가 스터디존으로 유입될 수 있습니다.",
  },
  {
    title: "스터디룸 이용 안내",
    subtitle: "퇴실 전 자리 정리와 소등을 확인해 주세요.",
    desc: "다음 이용자를 위한 배려입니다.",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);

    const clockTimer = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const slide = slides[index];

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #f7f4ee, #e8dfd1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <section
        style={{
          width: "82vw",
          height: "72vh",
          background: "rgba(255,255,255,0.86)",
          borderRadius: "42px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.13)",
          padding: "64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "34px",
            fontWeight: 700,
            color: "#8a7459",
            letterSpacing: "0.08em",
          }}
        >
          ANDING STUDY CAFE
        </div>

        <div>
          <h1
            style={{
              fontSize: "76px",
              margin: "0 0 30px",
              color: "#2f2a24",
              fontWeight: 800,
            }}
          >
            {slide.title}
          </h1>

          <h2
            style={{
              fontSize: "44px",
              margin: "0 0 26px",
              color: "#5a4c3f",
              fontWeight: 700,
            }}
          >
            {slide.subtitle}
          </h2>

          <p
            style={{
              fontSize: "30px",
              margin: 0,
              color: "#7a6b5b",
              lineHeight: 1.5,
            }}
          >
            {slide.desc}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "26px",
            color: "#8a7459",
            fontWeight: 600,
          }}
        >
          <span>앤딩스터디카페 상도점</span>
          <span>{time}</span>
        </div>
      </section>
    </main>
  );
}