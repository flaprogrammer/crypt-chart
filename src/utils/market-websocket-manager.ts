import type { Market } from "./markets";
import { Ticker24hUpdate } from "../utils/types";

type EventHandlers = {
  onTicker?: (message: Ticker24hUpdate[]) => void;
  onSubscribe?: (message: string[]) => void;
  onUnsubscribe?: () => void;
};

type Message =
  | {
      event: "ticker24h";
      data: Ticker24hUpdate[];
    }
  | {
      event: "subscribed";
      subscriptions: {
        ticker24h: string[];
      };
    }
  | {
      event: "unsubscribed";
      data: unknown;
    };

export class MarketWebSocketManager {
  wsConnection: WebSocket | undefined;
  markets: Market[];
  eventHandlers: EventHandlers;
  subscribed: boolean;

  constructor(eventHandlers: EventHandlers) {
    this.wsConnection = undefined;
    this.markets = [];
    this.subscribed = false;
    this.eventHandlers = eventHandlers;
  }

  connect() {
    this.wsConnection = new WebSocket("wss://ws.bitvavo.com/v2/");
    this.wsConnection.onmessage = this.onMessage.bind(this);
    return new Promise((resolve) => {
      this.wsConnection!.onopen = () => {
        resolve(void 0);
      };
    });
  }

  close() {
    this.wsConnection?.close();
  }

  subscribe(markets: Market[]) {
    this.wsConnection?.send(
      JSON.stringify({
        action: "subscribe",
        channels: [{ name: "ticker24h", markets }],
      })
    );
    this.markets = markets;
  }

  onMessage(event: MessageEvent) {
    try {
      const message: Message = JSON.parse(event.data);
      if (message.event === "ticker24h") {
        this.eventHandlers.onTicker?.(message.data);
      }
      if (message.event === "subscribed") {
        this.eventHandlers.onSubscribe?.(message.subscriptions.ticker24h);
      }
      if (message.event === "unsubscribed") {
        this.eventHandlers.onUnsubscribe?.();
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
    this.subscribed = true;
  }

  unsubscribe() {
    this.wsConnection?.send(
      JSON.stringify({
        action: "unsubscribe",
        channels: [{ name: "ticker24h", markets: this.markets }],
      })
    );
    this.subscribed = false;
  }
}
