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
  const [noticesUrl, setNoticesUrl] = useState<string>("/images/notices.json");
  const [noticesTempUrl, setNoticesTempUrl] = useState<string>("/images/notices_temp.json");
  const [slidesLoaded, setSlidesLoaded] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`/images/config.json?t=${Date.now()}`);
        if (!res.ok) return;
        
        const config = await res.json();
        setAllowPermanent(config.allowPermanent ?? true);
        setAllowTemporary(config.allowTemporary ?? true);
        setNoticesUrl(config.noticesUrl ?? "/images/notices.json");
        setNoticesTempUrl(config.noticesTempUrl ?? "/images/notices_temp.json");
      } catch {
        setAllowPermanent(true);
        setAllowTemporary(true);
      }
    };

    loadConfig();
    const configTimer = setInterval(loadConfig, 5000);
    return () => clearInterval(configTimer);
  }, []);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        let tempData: Slide[] = [];
        let permData: Slide[] = [];

        // 임시 공지를 허용하면 temp 파일 시도 로드
        if (allowTemporary) {
          try {
            const tempRes = await fetch(`${noticesTempUrl}?t=${Date.now()}`);
            if (tempRes.ok) {
              const d: Slide[] = await tempRes.json();
              if (Array.isArray(d) && d.length > 0) tempData = d;
            }
          } catch {
            // 무시
          }
        }

        // 상시 공지를 허용하면 permanent 파일 로드
        if (allowPermanent) {
          try {
            const res = await fetch(`${noticesUrl}?t=${Date.now()}`);
            if (res.ok) {
              const d: Slide[] = await res.json();
              if (Array.isArray(d) && d.length > 0) {
                permData = d.filter((slide) => slide.type === "permanent");
                if (permData.length === 0) permData = d;
              }
            }
          } catch {
            // 무시
          }
        }

        // 둘 다 허용되어 있고 둘 다 존재하면 temp 먼저, perm 이어서 함께 표시
        let slidesToShow: Slide[] = [];
        if (tempData.length > 0 && permData.length > 0) {
          slidesToShow = [...tempData, ...permData];
        } else if (tempData.length > 0) {
          slidesToShow = tempData;
        } else if (permData.length > 0) {
          slidesToShow = permData;
        }

        if (slidesToShow.length > 0) {
          console.log('[Notices] Loaded slides:', slidesToShow.length, 'allowPerm:', allowPermanent, 'allowTemp:', allowTemporary);
          // slides 배열이 실제로 변경된 경우에만 setSlides 호출 (타이머 리셋 방지)
          if (JSON.stringify(slides) !== JSON.stringify(slidesToShow)) {
            setSlides(slidesToShow);
            if (!slidesLoaded) {
              setIndex(0);
              setSlidesLoaded(true);
            }
          }
        } else {
          console.log('[Notices] No slides loaded. tempData:', tempData.length, 'permData:', permData.length);
        }
      } catch (err) {
        console.error('[Notices] Load error:', err);
      }
    };

    loadNotices();
    const reloadTimer = setInterval(loadNotices, 5000);

    return () => clearInterval(reloadTimer);
  }, [allowPermanent, allowTemporary, noticesUrl, noticesTempUrl, slides, slidesLoaded]);

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
