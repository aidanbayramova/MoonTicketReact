import { createContext, useContext, useMemo, useState } from "react";
import { profileApi } from "../api/auth";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "moonTicket.basket";
const OCCUPIED_KEY = "moonTicket.occupiedSeats";
const METRICS_KEY = "moonTicket.metrics";

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const BasketContext = createContext(null);

export function BasketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [items, setItems] = useState(() => readJson(STORAGE_KEY, []));
  const [occupiedByShow, setOccupiedByShow] = useState(() => readJson(OCCUPIED_KEY, {}));

  const persistItems = (next) => {
    setItems(next);
    writeJson(STORAGE_KEY, next);
  };

  const persistOccupied = (next) => {
    setOccupiedByShow(next);
    writeJson(OCCUPIED_KEY, next);
  };

  const updateMetrics = ({ orders = 0, tickets = 0, amount = 0 }) => {
    const current = readJson(METRICS_KEY, {
      orders: 0,
      ticketsSold: 0,
      totalRevenue: 0,
      updatedAt: null,
    });

    const next = {
      orders: current.orders + orders,
      ticketsSold: current.ticketsSold + tickets,
      totalRevenue: current.totalRevenue + amount,
      updatedAt: new Date().toISOString(),
    };

    writeJson(METRICS_KEY, next);
  };

  const addToBasket = (item) => {
    const normalized = {
      basketId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      eventType: item.eventType || "event",
      productId: Number(item.productId),
      title: item.title || "Event ticket",
      quantity: Number(item.quantity || 1),
      seats: Array.isArray(item.seats) ? item.seats : [],
      standing: item.standing || {},
      showKey: item.showKey || "",
      eventDate: item.eventDate || "",
      eventTime: item.eventTime || "",
      language: item.language || "",
      location: item.location || "",
      total: Number(item.total || 0),
      createdAt: new Date().toISOString(),
    };

    persistItems([normalized, ...items]);
    return normalized;
  };

  const removeFromBasket = (basketId) => {
    persistItems(items.filter((x) => x.basketId !== basketId));
  };

  const clearBasket = () => {
    persistItems([]);
  };

  const getOccupiedSeats = (showKey) => {
    if (!showKey) return [];
    return occupiedByShow[showKey] || [];
  };

  const occupySeats = (showKey, seats) => {
    if (!showKey || !Array.isArray(seats) || seats.length === 0) return;
    const existing = new Set(getOccupiedSeats(showKey));
    seats.forEach((seat) => existing.add(seat));
    persistOccupied({
      ...occupiedByShow,
      [showKey]: Array.from(existing),
    });
  };

  const buyNow = async (item) => {
    if (!isAuthenticated || !token) {
      throw new Error("Bilet almaq ucun daxil olmalisiniz.");
    }

    const me = await profileApi.me(token);
    if (!me?.emailConfirmed) {
      throw new Error("Bilet almaq ucun emailinizi tesdiq edin.");
    }

    const quantity = Number(item.quantity || item.seats?.length || 1);
    await profileApi.purchase(token, {
      productId: Number(item.productId),
      quantity,
    });

    occupySeats(item.showKey, item.seats || []);
    updateMetrics({ orders: 1, tickets: quantity, amount: Number(item.total || 0) });
  };

  const checkoutBasket = async () => {
    if (!isAuthenticated || !token) {
      throw new Error("Checkout ucun daxil olmalisiniz.");
    }

    const me = await profileApi.me(token);
    if (!me?.emailConfirmed) {
      throw new Error("Checkout ucun emailinizi tesdiq edin.");
    }

    let purchasedTickets = 0;
    let purchasedAmount = 0;
    const currentItems = [...items];

    for (const item of currentItems) {
      const quantity = Number(item.quantity || item.seats?.length || 1);
      await profileApi.purchase(token, {
        productId: Number(item.productId),
        quantity,
      });

      occupySeats(item.showKey, item.seats || []);
      purchasedTickets += quantity;
      purchasedAmount += Number(item.total || 0);
    }

    updateMetrics({ orders: currentItems.length, tickets: purchasedTickets, amount: purchasedAmount });
    clearBasket();

    return {
      items: currentItems.length,
      tickets: purchasedTickets,
      amount: purchasedAmount,
    };
  };

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addToBasket,
      removeFromBasket,
      clearBasket,
      buyNow,
      checkoutBasket,
      getOccupiedSeats,
      occupySeats,
    }),
    [items, occupiedByShow]
  );

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used inside BasketProvider");
  }
  return context;
}
