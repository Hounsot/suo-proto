export type MenuId =
  | "deposits"
  | "loans"
  | "cards"
  | "cash"
  | "services"
  | "business-rko"
  | "business-loans";

export type MenuOption = {
  id: string;
  title: string;
  ticketLabel?: string;
  tags?: string[];
  plainArrow?: boolean;
  fullWidth?: boolean;
  row?: number;
};

export type KioskMenu = {
  title: string;
  nodeId: string;
  business?: boolean;
  options: MenuOption[];
};

// Labels, order and slots follow the supplied Figma frames, including the empty rows.
export const kioskMenus: Record<MenuId, KioskMenu> = {
  deposits: {
    title: "Вклады",
    nodeId: "2261:2766",
    options: [
      { id: "open-deposit", title: "Открыть вклад" },
      { id: "renew-deposit", title: "Пополнить / продлить вклад" },
      { id: "deposit-consultation", title: "Консультация по вкладам" },
      {
        id: "investment-insurance",
        title: "Инвестиции и страхование",
      },
    ],
  },
  loans: {
    title: "Кредиты",
    nodeId: "2261:4547",
    options: [
      { id: "loan-payment", title: "Внести платёж по кредиту" },
      { id: "get-loan", title: "Получить кредит\nили кредитную карту" },
      { id: "early-repayment", title: "Погасить досрочно" },
      { id: "restructuring", title: "Реструктуризация" },
      { id: "loan-consultation", title: "Консультация по кредиту" },
      { id: "restricted-payment", title: "Арест: внести платеж\nпо кредиту" },
    ],
  },
  cards: {
    title: "Карты",
    nodeId: "2261:3630",
    options: [
      { id: "get-card", title: "Открыть / получить карту" },
      { id: "reissue-card", title: "Перевыпустить карту" },
      { id: "card-operations", title: "Другие операции по картам" },
      { id: "payroll-card", title: "Получить зарплатную карту" },
    ],
  },
  cash: {
    title: "Касса",
    nodeId: "2261:3760",
    options: [
      {
        id: "currency-exchange",
        title: "Обмен валюты",
        tags: ["< 10 000 $", "Currency exchange"],
        ticketLabel: "Обмен валюты · < 10 000 $",
      },
      {
        id: "premium-currency-exchange",
        title: "Обмен валюты со скидкой",
        tags: ["> 10 000 $", "Премиум"],
        ticketLabel: "Обмен валюты со скидкой · > 10 000 $ · Premium",
      },
      { id: "payments", title: "Платежи" },
    ],
  },
  services: {
    title: "Другие услуги",
    nodeId: "2261:3917",
    options: [
      { id: "feedback", title: "Обращения и предложения" },
      {
        id: "transfer",
        title: "Перевод денежных средств со счёта",
      },
      { id: "statements", title: "Справки и выписки" },
      { id: "sim", title: "SIM-карта МТС" },
      { id: "mobile-app", title: "Установить приложение" },
      { id: "biometrics", title: "Биометрия" },
      { id: "other-question", title: "Другой вопрос", fullWidth: true, row: 5 },
    ],
  },
  "business-rko": {
    title: "Счета и РКО",
    nodeId: "2261:4669",
    business: true,
    options: [
      { id: "business-account", title: "Открытие счёта" },
      { id: "account-deposit", title: "Взнос на счёт\nденежных средств" },
      {
        id: "cheque-book",
        title: "Выдача на счёт денежных средств по чековой книжке",
      },
      { id: "payment-order", title: "Подготовка платежного поручения" },
      { id: "business-documents", title: "Оформление справок" },
      { id: "rko-consultation", title: "Консультация и прочие вопросы по РКО" },
    ],
  },
  "business-loans": {
    title: "Кредиты",
    nodeId: "2261:4687",
    business: true,
    options: [
      {
        id: "business-loan-agreement",
        title: "Действующий кредитный договор / банковския гарантия",
      },
      { id: "business-loan-documents", title: "Оформление справок" },
      {
        id: "business-loan-consultation",
        title: "Консультация и прочие вопросы по кредиту для бизнеса",
      },
    ],
  },
};
