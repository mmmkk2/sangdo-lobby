"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    title: <>대화 및 통화는<br />밖에서 부탁드립니다.</>,
    items: [
      "내부로 소리가 유입됩니다.",
      <> <b>3인 이상</b> 대화는 특히 주의해 주세요. 바보 </>,
      <>안내 후에도 동일한 상황이 반복될 경우<br /><b className="gold">이용이 제한</b>될 수 있습니다.</>,
    ],
  },
];

export default function Home() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(clockTimer);
  }, []);

  const slide = slides[0];

  return (
    <main className="screen">
      <section className="card">
        <div className="brand">
          <div className="logo">▯</div>
          <div>
            <div className="brandMain">AND-ING</div>
            <div className="brandSub">STUDY CAFE</div>
          </div>
        </div>

        <h1>{slide.title}</h1>

        <div className="divider">
          <span />
        </div>

        <div className="noticeList">
          <Notice icon="🔊">{slide.items[0]}</Notice>
          <Notice icon="👥">{slide.items[1]}</Notice>
          <Notice icon="⚠️">{slide.items[2]}</Notice>
        </div>

        <div className="watermark">▯</div>
      </section>

      <footer>
        <span>앤딩스터디카페 상도점</span>
        <span className="slogan">QUIET SPACE,  BETTER FOCUS</span>
        <span>{time}</span>
      </footer>

      <style jsx>{`
        .screen {
          width: 100vw;
          height: 100vh;
          background:
            radial-gradient(circle at center, #154534 0%, #062b22 70%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          overflow: hidden;
          color: #111;
        }

        .card {
          position: relative;
          width: 92vw;
          height: 82vh;
          background: #fffaf0;
          border-radius: 34px;
          border: 4px solid #b38a42;
          box-shadow: inset 0 0 0 3px #123b2f, 0 24px 60px rgba(0,0,0,0.32);
          padding: 38px 80px 54px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .brand {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          color: #a6782f;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .logo {
          font-size: 54px;
          transform: rotate(45deg);
          line-height: 1;
        }

        .brandMain {
          font-size: 31px;
          line-height: 1;
        }

        .brandSub {
          font-size: 20px;
          margin-top: 6px;
        }

        h1 {
          margin: 32px 0 20px;
          text-align: center;
          font-size: 78px;
          line-height: 1.28;
          font-weight: 950;
          color: #063426;
          letter-spacing: -0.04em;
        }

        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px auto 28px;
          width: 84%;
          height: 1px;
          background: #b58a43;
        }

        .divider span {
          width: 15px;
          height: 15px;
          background: #b58a43;
          border-radius: 50%;
          box-shadow: 0 0 0 14px #fffaf0;
        }

        .noticeList {
          width: 82%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .row {
          display: grid;
          grid-template-columns: 88px 28px 1fr;
          align-items: center;
          gap: 24px;
          padding: 22px 0;
          border-bottom: 1px solid rgba(0,0,0,0.13);
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.35;
        }

        .row:last-child {
          border-bottom: none;
        }

        .icon {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #063426;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
        }

        .bar {
          width: 2px;
          height: 42px;
          background: #b58a43;
        }

        b {
          color: #063426;
          font-size: 1.08em;
        }

        .gold {
          color: #b17a18;
        }

        .watermark {
          position: absolute;
          right: 80px;
          bottom: 90px;
          font-size: 260px;
          color: rgba(166, 125, 57, 0.08);
          transform: rotate(45deg);
          pointer-events: none;
        }

        footer {
          width: 92vw;
          margin-top: 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #d6a85a;
          font-size: 28px;
          font-weight: 700;
        }

        .slogan {
          font-size: 18px;
          letter-spacing: 0.45em;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}

function Notice({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="row">
      <div className="icon">{icon}</div>
      <div className="bar" />
      <div>{children}</div>
    </div>
  );
}
