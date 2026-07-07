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

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const loadNotices = async () => {
      const res = await fetch(`/notices.json?t=${Date.now()}`);
      const data = await res.json();
      setSlides(data);
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

  const slide = slides[index];

  if (!slide) return null;

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
  if (!item.highlight) {
    return (
      <div className="row">
        <div className="icon">{item.icon}</div>
        <div className="bar" />
        <div>{item.text}</div>
      </div>
    );
  }

  const parts = item.text.split(item.highlight);

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
