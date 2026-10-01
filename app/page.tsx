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
  subtitleHighlight?: string;
  duration?: number;
  items: NoticeItem[];
};

function renderWithHighlight(text: string, highlight?: string) {
  if (!highlight || !text.includes(highlight)) return text;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <b className="gold">{highlight}</b>
      {after}
    </>
  );
}

const defaultSlides: Slide[] = [];

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [allowPermanent, setAllowPermanent] = useState<boolean>(true);
  const [allowTemporary, setAllowTemporary] = useState<boolean>(true);
  const [noticesUrl, setNoticesUrl] = useState<string>("/images/notices.json");
  const [noticesTempUrl, setNoticesTempUrl] = useState<string>("/images/notices_temp.json");
  const [slidesLoaded, setSlidesLoaded] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`/api/config?t=${Date.now()}`);
        if (!res.ok) return;

        const config = await res.json();
        setAllowPermanent(config.allowPermanent ?? true);
        setAllowTemporary(config.allowTemporary ?? true);
        setNoticesUrl(config.noticesUrl ?? "/images/notices.json");
        setNoticesTempUrl(config.noticesTempUrl ?? "/images/notices_temp.json");
      } catch {
        setAllowPermanent(true);
        setAllowTemporary(true);
      } finally {
        setConfigLoaded(true);
      }
    };

    loadConfig();
    const configTimer = setInterval(loadConfig, 5000);
    return () => clearInterval(configTimer);
  }, []);

  useEffect(() => {
    if (!configLoaded) return;

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
  }, [configLoaded, allowPermanent, allowTemporary, noticesUrl, noticesTempUrl, slides, slidesLoaded]);

  useEffect(() => {
    const clock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "long",
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

  const slide = slides[index] ?? { title: "", subtitle: "", items: [] };
  const isLoading = slides.length === 0;

  return (
    <main className="screen">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <section className={`card${isLoading ? " isLoading" : ""}`}>
        <header className="cardHeader">
          <div className="brandMark" aria-hidden="true">A</div>
          <div className="brandGroup">
            <div className="brand">ANDING STUDY CAFE</div>
            <div className="branch">SANGDO · 24 HOURS</div>
          </div>
          {!isLoading && (
            <div className="slideCount" aria-label={`${index + 1}번째 공지, 전체 ${slides.length}개`}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>/</span>
              <span>{String(slides.length).padStart(2, "0")}</span>
            </div>
          )}
        </header>

        {!isLoading && (
          <>
            <div className="titleBlock" key={`title-${index}`}>
              <div className="eyebrow">PLEASE NOTE</div>
              <h1>{slide.title}</h1>
              <h2>{renderWithHighlight(slide.subtitle, slide.subtitleHighlight)}</h2>
            </div>

            <div className="divider" />

            <div className="noticeList" key={`items-${index}`}>
              {slide.items.map((item, i) => (
                <Notice key={i} item={item} index={i} />
              ))}
            </div>

            <div className="progressTrack" aria-hidden="true">
              <span
                key={`${index}-${slide.duration}`}
                style={{ animationDuration: `${slide.duration ?? 10000}ms` }}
              />
            </div>
          </>
        )}

        <div className="watermark" aria-hidden="true">A</div>
      </section>

      <footer>
        <div className="footerLocation">
          <span className="statusDot" />
          <span>앤딩스터디카페 상도점</span>
        </div>
        <div className="footerClock">
          <span>{date}</span>
          <strong>{time}</strong>
        </div>
      </footer>
    </main>
  );
}

function Notice({ item, index }: { item: NoticeItem; index: number }) {
  return (
    <div className="row" style={{ animationDelay: `${index * 90}ms` }}>
      <div className="icon">{item.icon}</div>
      <div className="noticeText">{renderWithHighlight(item.text, item.highlight)}</div>
    </div>
  );
}
