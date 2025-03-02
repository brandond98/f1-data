"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Driver {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
}

export default function Home() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const onMessage = useCallback((event: MessageEvent) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData === "pong") {
      console.log("Pong recieved");
    }
    setDrivers(parsedData);
  }, []);

  const initialiseWebsocket = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState > 1) {
      const ws = new WebSocket("ws://localhost:8000/ws");
      ws.onopen = () => {
        setConnected(true);

        ws.send("Hello, websocket!");
      };

      ws.onclose = () => {
        setConnected(false);
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onmessage = onMessage;

      wsRef.current = ws;
    } else {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send("ping");
      }
    }
  }, []);

  useEffect(() => {
    initialiseWebsocket();

    const pingInterval = setInterval(initialiseWebsocket, 10000);

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(pingInterval);
    };
  }, []);

  return (
    <div className="container mx-auto py-8">
      <main className="space-y-6">
        <Alert variant={connected ? "default" : "destructive"}>
          {connected ? (
            <CheckCircle2 className="h-4 w-4 animate-pulse fill-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 fill-red-500" />
          )}
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>
            {connected ? "Connected to live data" : "Disconnected from server"}
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {drivers.map((driver) => (
            <Card key={driver.driver_number} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div
                    className="w-2 self-stretch mr-4"
                    style={{ backgroundColor: `#${driver.team_colour}` }}
                  />
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar
                      className="h-12 w-12 rounded-md flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: `#${driver.team_colour}` }}
                    >
                      {driver.name_acronym}
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{driver.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {driver.team_name}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {driver.driver_number}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
