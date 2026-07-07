"use client";

import { useEffect, useState } from "react";

type NoticeItem = {
  icon: string;
  text: string;
  highlight?: string;
};

type Slide = {
  title: string;
  subtitle: string;
  items: NoticeItem[];
};

const defaultSlides: Slide[] = [
  {
    title: "카페테리아 이용 안내",
    subtitle: "대화 및 통화는 밖에서 부탁드립니다.",
    items: [
      { icon: "🔊", text: "내부로 소리가 유입됩니다." },
      {
        icon: "👥",
        text: "3인 이상 대화는 특히 주의해 주세요.",
        highlight: "3인 이상 대화",
      },
      {
        icon: "⚠️",
        text: "안내 후에도 동일한 상황이 반복될 경우 이용이 제한될 수 있습니다.",
        highlight: "이용이 제한",
      },
    ],
  },
];

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const res = await fetch(`/images/notices.json?t=${Date.now()}`);
        if (!res.ok) return;

        const data: Slide[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          setIndex(0);
        }
      } catch {
        // notices.json이 없어도 기본 화면 유지
      }
    };

    loadNotices();
    const reloadTimer = setInterval(loadNotices, 60000);
    return () => clearInterval(reloadTimer);
  }, []);

  useEffect(() => {
    const clock = () => {
      setTime(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    clock();
    const clockTimer = setInterval(clock, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const slideTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(slideTimer);
  }, [slides.length]);

  const slide = slides[index] ?? defaultSlides[0];

  return (
    <main className="screen">
      <section className="card">
        <div className="brand">
          <div className="brandIcon" />
          <div className="brandText">
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
          {slide.items.map((item, i) => (
            <Notice key={i} item={item} />
          ))}
        </div>

        <div className="watermark" />
      </section>

      <footer>
        <span>앤딩스터디카페 상도점</span>
        <span className="slogan">QUIET SPACE, BETTER FOCUS</span>
        <span>{time}</span>
      </footer>
    </main>
  );
}

function Notice({ item }: { item: NoticeItem }) {
  const text = item.text;

  if (!item.highlight || !text.includes(item.highlight)) {
    return (
      <div className="row">
        <div className="icon">{item.icon}</div>
        <div className="bar" />
        <div>{text}</div>
      </div>
    );
  }

  const parts = text.split(item.highlight);

  return (
    <div className="row">
      <div className="icon">{item.icon}</div>
      <div className="bar" />
      <div>
        {parts[0]}
        <b className={item.highlight.includes("제한") ? "gold" : ""}>
          {item.highlight}
        </b>
        {parts[1]}
      </div>
    </div>
  );
}
