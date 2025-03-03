import { useState, useRef, useCallback, useEffect } from "react";
import { WebsocketResponse } from "@/types/webhook";

export const useWebSocket = () => {
  const [data, setData] = useState<WebsocketResponse | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const onMessage = useCallback((event: MessageEvent) => {
    const parsedData = JSON.parse(event.data);

    if (parsedData) {
      setData(parsedData);
    }
  }, []);

  const initialiseWebsocket = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState > 1) {
      const ws = new WebSocket("ws://localhost:8000/ws");
      ws.onopen = () => {
        setConnected(true);
      };

      ws.onclose = () => {
        setConnected(false);
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onmessage = onMessage;

      wsRef.current = ws;
    }
  }, []);

  useEffect(() => {
    initialiseWebsocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return { data, connected };
};
