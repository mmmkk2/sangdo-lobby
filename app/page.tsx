"use client";

import { useEffect, useState } from "react";

const slide = {
  title: "카페테리아 이용 안내",
  subtitle: "대화 및 통화는 밖에서 부탁드립니다.",
  items: [
    <>내부로 소리가 유입됩니다.</>,
    <>
      <b>3인 이상 대화</b>는 특히 주의해 주세요.
    </>,
    <>
      안내 후에도 동일한 상황이 반복될 경우
      <br />
      <b className="gold">이용이 제한</b>될 수 있습니다.
    </>,
  ],
};

export default function Home() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const clockTimer = setInterval(updateTime, 1000);

    return () => clearInterval(clockTimer);
  }, []);

  return (
    <main className="screen">
      <section className="card">
        <div className="brand">
          <div className="logoMark" />
          <div>
            <div className="brandMain">AND-ING</div>
            <div className="brandSub">STUDY CAFE</div>
          </div>
        </div>

        <h1>{slide.title}</h1>
        <h2>{slide.subtitle}</h2>

        <div className="divider">
          <span />
        </div>

        <div className="noticeList">
          <Notice icon="🔊">{slide.items[0]}</Notice>
          <Notice icon="👥">{slide.items[1]}</Notice>
          <Notice icon="⚠️">{slide.items[2]}</Notice>
        </div>

        <div className="watermark" />
      </section>

      <footer>
        <span>앤딩스터디카페 상도점</span>
        <span className="slogan">QUIET SPACE, BETTER FOCUS</span>
        <span>{time}</span>
      </footer>

      <style jsx>{`
        .screen {
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at center, #154534 0%, #062b22 72%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
            sans-serif;
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
          box-shadow: inset 0 0 0 3px #123b2f,
            0 24px 60px rgba(0, 0, 0, 0.32);
          padding: 38px 80px 46px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .brand {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          color: #a6782f;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .logoMark {
          width: 38px;
          height: 38px;
          border: 4px solid #a6782f;
          transform: rotate(45deg);
          box-sizing: border-box;
        }

        .brandMain {
          font-size: 32px;
          line-height: 1;
        }

        .brandSub {
          font-size: 21px;
          margin-top: 7px;
        }

        h1 {
          margin: 46px 0 8px;
          text-align: center;
          font-size: 90px;
          line-height: 1.08;
          font-weight: 950;
          color: #063426;
          letter-spacing: -0.055em;
        }

        h2 {
          margin: 0 0 28px;
          text-align: center;
          font-size: 52px;
          line-height: 1.18;
          font-weight: 900;
          color: #063426;
          letter-spacing: -0.055em;
        }

        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          width: 82%;
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
          width: 76%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .row {
          display: grid;
          grid-template-columns: 92px 28px 1fr;
          align-items: center;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.13);
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 1.34;
        }

        .row:last-child {
          border-bottom: none;
        }

        .icon {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: #063426;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
        }

        .bar {
          width: 2px;
          height: 44px;
          background: #b58a43;
        }

        b {
          color: #063426;
          font-size: 1.08em;
          font-weight: 950;
        }

        .gold {
          color: #b17a18;
        }

        .watermark {
          position: absolute;
          right: 82px;
          bottom: 118px;
          width: 180px;
          height: 180px;
          border: 22px solid rgba(166, 125, 57, 0.08);
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
          font-size: 30px;
          font-weight: 800;
        }

        .slogan {
          font-size: 18px;
          letter-spacing: 0.42em;
          font-weight: 700;
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
