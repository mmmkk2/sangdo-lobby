"use client";

import { useEffect, useState } from "react";

type NoticeItem = {
  icon: string;
  text: string;
  highlight?: string;
};

type Slide = {
  type?: "permanent" | "temporary";
  title: string;
  subtitle: string;
  duration?: number;
  items: NoticeItem[];
};

const defaultSlides: Slide[] = [
  {
    type: "permanent",
    title: "카페테리아 이용 안내",
    subtitle: "대화 및 통화는 밖에서 부탁드립니다.",
    duration: 10000,
    items: [
      { icon: "🔊", text: "내부로 소리가 유입됩니다." },
      {
        icon: "👥",
        text: "3인 이상 대화는 특히 주의해 주세요.",
        highlight: "3인 이상 대화",
      },
      {
        icon: "⚠️",
        text: "안내 후에도 동일한 상황이 반복될 경우\n이용이 제한될 수 있습니다.",
        highlight: "이용이 제한",
      },
    ],
  },
];

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState("");
  const [allowPermanent, setAllowPermanent] = useState<boolean>(true);
  const [allowTemporary, setAllowTemporary] = useState<boolean>(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`/images/config.json?t=${Date.now()}`);
        if (!res.ok) return;
        
        const config = await res.json();
        setAllowPermanent(config.allowPermanent ?? true);
        setAllowTemporary(config.allowTemporary ?? true);
      } catch {
        setAllowPermanent(true);
        setAllowTemporary(true);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        let slidesToShow: Slide[] = [];

        // allowTemporary가 true이면 notices_temp.json 먼저 로드
        if (allowTemporary) {
          try {
            const tempRes = await fetch(`/images/notices_temp.json?t=${Date.now()}`);
            if (tempRes.ok) {
              const tempData: Slide[] = await tempRes.json();
              if (Array.isArray(tempData) && tempData.length > 0) {
                slidesToShow = tempData;
              }
            }
          } catch {
            // temp 파일이 없으면 무시
          }
        }

        // temp 공지가 없거나 allowTemporary가 false일 때 permanent 공지 로드
        if (slidesToShow.length === 0 && allowPermanent) {
          const res = await fetch(`/images/notices.json?t=${Date.now()}`);
          if (!res.ok) return;

          const data: Slide[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            slidesToShow = data.filter((slide) => slide.type === "permanent");
            if (slidesToShow.length === 0) {
              slidesToShow = data;
            }
          }
        }

        if (slidesToShow.length > 0) {
          setSlides(slidesToShow);
          setIndex(0);
        }
      } catch {
        // JSON 못 읽어도 기본 화면 유지
      }
    };

    loadNotices();
    const reloadTimer = setInterval(loadNotices, 60000);

    return () => clearInterval(reloadTimer);
  }, [allowPermanent, allowTemporary]);

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

    const duration = slides[index]?.duration ?? 10000;

    const slideTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearTimeout(slideTimer);
  }, [index, slides]);

  const slide = slides[index] ?? defaultSlides[0];

  return (
    <main className="screen">
      <section className="card">
        <div className="brand">ANDING STUDY CAFE</div>

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
  if (!item.highlight || !item.text.includes(item.highlight)) {
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
