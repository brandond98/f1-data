import { useState, useRef, useCallback, useEffect } from "react";

interface Session {
  circuit_short_name: string;
  date_start: string;
  location: string;
  session_name: string;
  session_type: string;
}

interface Response {
  drivers: Driver[];
  session: Session;
}

interface Driver {
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_colour: string;
  team_name: string;
}

export const useWebhook = () => {
  const [data, setData] = useState<Response | null>(null);
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
