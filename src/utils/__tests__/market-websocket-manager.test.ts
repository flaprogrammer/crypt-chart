import { MarketWebSocketManager } from "../market-websocket-manager";
import WS from "jest-websocket-mock";

let server: any;
let marketWebSocketManager: any;

describe("MarketWebSocketManager", () => {
  beforeEach(() => {
    server = new WS("wss://ws.bitvavo.com/v2/");
    marketWebSocketManager = new MarketWebSocketManager({
      onTicker: jest.fn(),
      onSubscribe: jest.fn(),
      onUnsubscribe: jest.fn(),
    });
  });

  afterEach(() => {
    WS.clean();
  });

  test("connect method opens a WebSocket connection", async () => {
    expect(marketWebSocketManager.wsConnection).toBeUndefined();
    await marketWebSocketManager.connect();
    expect(marketWebSocketManager.wsConnection).toBeDefined();
    expect(marketWebSocketManager.wsConnection.readyState).toBe(WebSocket.OPEN);
  });

  test("onMessage method calls correct event handlers", async () => {
    await marketWebSocketManager.connect();
    server.send(
      JSON.stringify({
        event: "ticker24h",
        data: [{}],
      })
    );
    server.send(
      JSON.stringify({
        event: "subscribed",
        subscriptions: {
          ticker24h: ["BTC", "ETH"],
        },
      })
    );
    server.send(
      JSON.stringify({
        event: "unsubscribed",
        data: {},
      })
    );
    expect(marketWebSocketManager.eventHandlers.onTicker).toHaveBeenCalled();
    expect(
      marketWebSocketManager.eventHandlers.onSubscribe
    ).toHaveBeenCalledWith(["BTC", "ETH"]);
    expect(
      marketWebSocketManager.eventHandlers.onUnsubscribe
    ).toHaveBeenCalled();
  });

  test("close method closes the WebSocket connection", async () => {
    await marketWebSocketManager.connect();
    marketWebSocketManager.close();
    expect(marketWebSocketManager.wsConnection.readyState).toBe(
      WebSocket.CLOSING
    );
  });
});
