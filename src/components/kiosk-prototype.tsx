import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { kioskMenus, type MenuId, type MenuOption } from "./kiosk-prototype-data";
import "./kiosk-prototype.css";

export type KioskDestination = MenuId | "premium" | "business" | "home" | "client-bank" | "acquiring" | "business-deposits" | "payroll";

type HomeService = {
  id: KioskDestination;
  title: string;
  description: string;
};

const services: HomeService[] = [
  { id: "deposits", title: "Вклады", description: "Открыть, пополнить или продлить" },
  { id: "loans", title: "Кредиты", description: "Платёж, досрочное погашение, заявка" },
  { id: "cards", title: "Карты", description: "Получить, перевыпустить или\u00a0решить вопрос" },
  { id: "cash", title: "Касса", description: "Обмен валюты и\u00a0платежи" },
  { id: "premium", title: "Премиальное обслуживание", description: "Привилегии и персональное обслуживание" },
  { id: "services", title: "Другие услуги", description: "Вопросы, переводы, справки и\u00a0сервисы" },
];

const assets = `${import.meta.env.BASE_URL}kiosk-assets`;

const businessServices: HomeService[] = [
  { id: "business-rko", title: "Счета и РКО", description: "Счёт, кассовые операции,\nплатёжные поручения и справки" },
  { id: "client-bank", title: "Клиент-банк", description: "Подключение, доступ\nи работа в системе" },
  { id: "acquiring", title: "Эквайринг", description: "Подключение и вопросы\nпо приёму платежей" },
  { id: "payroll", title: "Зарплатный проект", description: "Подключение и обслуживание\nвыплат сотрудникам" },
  { id: "business-deposits", title: "Депозиты", description: "Открытие и обслуживание\nдепозита для бизнеса" },
  { id: "business-loans", title: "Кредиты", description: "Заявка, действующий кредит\nи консультации" },
];

function KioskBackground({ business }: { business: boolean }) {
  const reducedMotion = useReducedMotion();
  return <div className="kiosk-background-stack" aria-hidden="true">
    <div className="kiosk-background-layer" data-background-theme="retail">
      <div className="kiosk-home__background">
        <div className="kiosk-home__gradient">
          <img src={`${assets}/background.png`} alt="" draggable={false} />
          <div className="kiosk-home__gradient-overlay" />
        </div>
      </div>
    </div>
    <motion.div className="kiosk-background-layer kiosk-background-layer--business" data-background-theme="business"
      initial={false} animate={{ opacity: business ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}>
      <div className="kiosk-home__background">
        <div className="kiosk-home__gradient">
          <img src={`${assets}/business-background.png`} alt="" draggable={false} />
          <div className="kiosk-home__gradient-overlay" />
        </div>
      </div>
    </motion.div>
  </div>;
}

function KioskHeader({ action, onAction, onHome }: { action: string; onAction: () => void; onHome: () => void }) {
  const reducedMotion = useReducedMotion();
  return <header className="kiosk-home__header">
    <button type="button" className="kiosk-home__logo-link" aria-label="МТС Банк — на главную" onClick={onHome}>
      <img className="kiosk-home__logo" src={`${assets}/mts-bank.svg`} width={175.883} height={28} alt="МТС Банк" draggable={false} />
    </button>
    <motion.button type="button" className="kiosk-home__business" whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={{ duration: 0.12 }} onClick={onAction}>
      {action}
    </motion.button>
  </header>;
}

export function KioskHomeScreen({ onSelect, business = false }: { onSelect?: (destination: KioskDestination) => void; business?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<KioskDestination | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  const select = (destination: KioskDestination) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setSelected(destination);
    feedbackTimer.current = setTimeout(() => setSelected(null), 300);
    onSelect?.(destination);
  };

  return (
      <div className={`kiosk-home__grid ${business ? "kiosk-home--business" : ""}`} aria-label={business ? "Услуги для бизнеса и ИП" : "Услуги для частных лиц"}>
        {(business ? businessServices : services).map(service => (
          <motion.button
            key={service.id}
            type="button"
            className={`kiosk-home__card kiosk-home__card--${service.id}`}
            data-service={service.id}
            data-selected={selected === service.id || undefined}
            whileTap={reducedMotion ? undefined : { scale: 0.986 }}
            transition={{ duration: 0.12 }}
            onClick={() => select(service.id)}
          >
            <div className="kiosk-home__copy">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <div className="kiosk-home__art-slot" aria-hidden="true">
              <div className="kiosk-home__art">
                {service.id === "premium" ? (
                  <div className="kiosk-home__premium-rotation">
                    <img src={`${assets}/${service.id}.png`} alt="" draggable={false} />
                  </div>
                ) : service.id === "acquiring" || service.id === "business-loans" ? (
                  <div className="kiosk-home__business-rotation">
                    <img src={`${assets}/${service.id}.png`} alt="" draggable={false} />
                  </div>
                ) : <img src={`${assets}/${service.id}.png`} alt="" draggable={false} />}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
  );
}

function MenuScreen({ id, onBack, onChoose }: { id: MenuId; onBack: () => void; onChoose: (option: MenuOption) => void }) {
  const menu = kioskMenus[id];
  const reducedMotion = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  return <>
    <div className="kiosk-menu__heading">
      <motion.button type="button" className="kiosk-menu__back" aria-label="Назад" onClick={onBack} whileTap={reducedMotion ? undefined : { scale: 0.95 }}>
        <span className="kiosk-menu__icon-viewport"><img src={`${assets}/back.svg`} width={44} height={44} alt="" /></span>
      </motion.button>
      <h1 className="kiosk-menu__title" ref={heading} tabIndex={-1}>{menu.title}</h1>
    </div>
    <div className="kiosk-menu__grid" aria-label={`Услуги: ${menu.title}`}>
      {menu.options.map(option => <motion.button
        key={option.id} type="button" data-option={option.id}
        className="kiosk-menu__option"
        style={{ gridColumn: option.fullWidth ? "1 / -1" : undefined, gridRow: option.row }}
        whileTap={reducedMotion ? undefined : { scale: 0.985 }} transition={{ duration: 0.12 }}
        onClick={() => onChoose(option)}
      >
        <span className="kiosk-menu__option-copy">
          <span className="kiosk-menu__option-title">{option.title}</span>
          {option.tags && <span className="kiosk-menu__tags">{option.tags.map(tag => <span key={tag}>{tag}</span>)}</span>}
        </span>
        <span className={`kiosk-menu__arrow ${option.plainArrow ? "kiosk-menu__arrow--plain" : ""}`} aria-hidden="true">
          <span className="kiosk-menu__icon-viewport"><img src={`${assets}/${option.plainArrow ? "arrow-plain" : "arrow"}.svg`} width={44} height={44} alt="" /></span>
        </span>
      </motion.button>)}
    </div>
  </>;
}

type Receipt = { service: string; number: string; createdAt: string; audience?: "retail" | "business" };
type View = "home" | "business" | "ticket" | MenuId;
type Route = { view: View; receipt: Receipt | null };

function TicketScreen({ receipt }: { receipt: Receipt }) {
  const reducedMotion = useReducedMotion();
  const created = new Date(receipt.createdAt);
  const date = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", day: "2-digit", month: "2-digit", year: "numeric" }).format(created);
  const time = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Moscow", hour: "2-digit", minute: "2-digit" }).format(created);

  return <>
    <div className="kiosk-ticket__heading" role="status">
      <h1>Ваш талон готов</h1>
      <p>Не берите больше одного талона</p>
    </div>
    <div className="kiosk-ticket__content">
      <div className="kiosk-printer">
        <div className="kiosk-printer__slot"><img src={`${assets}/printer-slot.png`} width={560} height={20} alt="" /></div>
        <div className="kiosk-printer__paper-window">
          <motion.div className="kiosk-receipt" initial={reducedMotion ? false : { y: -648 }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}>
            <div className="kiosk-receipt__body">
              <div className="kiosk-receipt__header"><span>МТС Банк</span><time dateTime={receipt.createdAt}>{date}<br />{time}</time></div>
              <div className="kiosk-receipt__separator" />
              <div className="kiosk-receipt__number"><span className="kiosk-receipt__label">Ваш номер в очереди</span><strong>{receipt.number}</strong></div>
              <div className="kiosk-receipt__separator" />
              <div className="kiosk-receipt__service"><span className="kiosk-receipt__label">Услуга</span><span data-ticket-service>{receipt.service}</span></div>
              <div className="kiosk-receipt__separator" />
              <div className="kiosk-receipt__instructions"><span>Когда на табло появится ваш номер,<br />пройдите к указанному окну.</span><span>Спасибо, что выбрали МТС Банк</span></div>
            </div>
            <img className="kiosk-receipt__edge" src={`${assets}/paper-edge.svg`} width={526} height={20} alt="" />
          </motion.div>
          <div className="kiosk-printer__paper-shadow" aria-hidden="true" />
        </div>
      </div>
    </div>
  </>;
}

function readRoute(): Route {
  const hash = window.location.hash.slice(1);
  const savedReceipt = window.history.state?.kioskPrototype?.receipt ?? null;
  const known = hash === "home" || hash === "business" || Object.prototype.hasOwnProperty.call(kioskMenus, hash) || (hash === "ticket" && savedReceipt);
  return { view: known ? hash as View : "home", receipt: savedReceipt };
}

export function KioskPrototype() {
  const [route, setRoute] = useState<Route>(readRoute);
  const [direction, setDirection] = useState(1);
  const sequence = useRef(39);
  const navigationLockedUntil = useRef(0);
  const reducedMotion = useReducedMotion();

  const navigate = useCallback((view: View, receipt: Receipt | null = null, backwards = false) => {
    if (Date.now() < navigationLockedUntil.current) return false;
    navigationLockedUntil.current = Date.now() + 220;
    setDirection(backwards ? -1 : 1);
    const next = { view, receipt };
    window.history.pushState({ ...window.history.state, kioskPrototype: next }, "", `#${view}`);
    setRoute(next);
    return true;
  }, []);

  const issueTicket = (service: string) => {
    const business = route.view === "business" || (route.view in kioskMenus && kioskMenus[route.view as MenuId].business);
    const receipt: Receipt = { service: service.replace(/\s+/g, " ").trim(), number: `K${String(sequence.current).padStart(4, "0")}`, createdAt: new Date().toISOString(), audience: business ? "business" : "retail" };
    if (navigate("ticket", receipt)) sequence.current += 1;
  };

  const selectDestination = (destination: KioskDestination) => {
    if (destination === "premium") issueTicket("Премиальное обслуживание");
    else if (destination === "home" || destination === "business" || destination in kioskMenus) navigate(destination as View);
    else issueTicket(businessServices.find(service => service.id === destination)?.title ?? destination);
  };

  const goBack = useCallback(() => {
    const businessMenu = route.view in kioskMenus && kioskMenus[route.view as MenuId].business;
    navigate(businessMenu ? "business" : "home", null, true);
  }, [route.view, navigate]);

  useEffect(() => {
    document.title = "МТС Банк · Прототип СУО";
    document.documentElement.lang = "ru";
    for (const service of businessServices) {
      const image = new Image();
      image.src = `${assets}/${service.id}.png`;
    }
    const restore = () => { setDirection(-1); setRoute(readRoute()); };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") goBack(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goBack]);

  useEffect(() => {
    if (route.view !== "ticket" || !route.receipt) return;
    const timeout = window.setTimeout(() => navigate("home", null, true), 10_000);
    return () => window.clearTimeout(timeout);
  }, [route.view, route.receipt, navigate]);

  const business = route.view === "business" || (route.view in kioskMenus && kioskMenus[route.view as MenuId].business) || (route.view === "ticket" && route.receipt?.audience === "business");
  const heading = route.view === "home" ? "Выбор услуги" : route.view === "business" ? "Для бизнеса и ИП" : route.view === "ticket" ? "Ваш талон готов" : kioskMenus[route.view as MenuId].title;

  return <div className="kiosk-prototype-stage">
    <main className="kiosk-home kiosk-prototype-shell" data-kiosk-frame data-audience={business ? "business" : "retail"} aria-label="МТС Банк — терминал электронной очереди">
      <KioskBackground business={!!business} />
      <KioskHeader action={route.view === "ticket" ? "На главную" : business ? "Физическим лицам" : "Для бизнеса и ИП"}
        onHome={() => navigate("home", null, true)} onAction={() => navigate(route.view === "ticket" || business ? "home" : "business", null, route.view === "ticket")} />
      <div className="kiosk-prototype-viewport">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
      <motion.div className="kiosk-prototype-content" data-screen={route.view} aria-label={heading} role="region" key={route.view} custom={direction}
        initial="enter" animate="visible" exit="exit"
        variants={{ enter: (d: number) => ({ opacity: 0, x: reducedMotion ? 0 : d * 24 }), visible: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: reducedMotion ? 0 : d * -16 }) }}
        transition={{ duration: reducedMotion ? 0 : 0.16, ease: "easeOut" }}
      >
        {route.view === "home" || route.view === "business" ? <KioskHomeScreen business={route.view === "business"} onSelect={selectDestination} />
          : route.view === "ticket" && route.receipt ? <TicketScreen receipt={route.receipt} />
            : <MenuScreen id={route.view as MenuId} onBack={goBack} onChoose={option => issueTicket(option.ticketLabel ?? option.title)} />}
      </motion.div>
      </AnimatePresence>
      </div>
    </main>
  </div>;
}
