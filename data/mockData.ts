export type Meter = {
  id: string;
  name: string;
  reference: string;
  kwhRemaining: number;
  kwhTotal: number;
  location: string;
  alertEnabled: boolean;
  alertThreshold: number;
  history: RechargeHistory[];
  weeklyConsumption: number[];
};

export type RechargeHistory = {
  id: string;
  date: string;
  amount: number;
  kwh: number;
  token: string;
};

export const mockMeters: Meter[] = [
  {
    id: "1",
    name: "Maison Lomé",
    reference: "1402-8831-5694",
    kwhRemaining: 24.5,
    kwhTotal: 40,
    location: "Lomé, Tokoin",
    alertEnabled: true,
    alertThreshold: 5,
    history: [
      { id: "h1", date: "2026-05-15", amount: 5000, kwh: 41, token: "4421" },
      { id: "h2", date: "2026-04-30", amount: 10000, kwh: 83, token: "8872" },
      { id: "h3", date: "2026-04-10", amount: 5000, kwh: 41, token: "3319" },
    ],
    weeklyConsumption: [15, 18, 12, 20],
  },
  {
    id: "2",
    name: "Village Kpalimé",
    reference: "1307-4421-8830",
    kwhRemaining: 3.2,
    kwhTotal: 40,
    location: "Kpalimé",
    alertEnabled: true,
    alertThreshold: 5,
    history: [
      { id: "h4", date: "2026-05-01", amount: 5000, kwh: 41, token: "7754" },
    ],
    weeklyConsumption: [10, 8, 14, 9],
  },
];

export const mockUser = {
  name: "Koffi Agbenowu",
  phone: "+228 99 45 67 89",
  initials: "KA",
};
