"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Session {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
}

interface Response {
  carData: Driver[];
  sessionData: Session;
}

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
  const [data, setData] = useState<Response>({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const onMessage = useCallback((event: MessageEvent) => {
    const parsedData = JSON.parse(event.data);

    if (parsedData === "pong") {
      return;
    }
    setData(parsedData);
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
    } else {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send("ping");
      }
    }
  }, []);

  useEffect(() => {
    initialiseWebsocket();

    const pingInterval = setInterval(initialiseWebsocket, 5000);

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
            {connected
              ? "Connected to live data"
              : "Disconnected: Attempting to reconnect..."}
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>Current session information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Track</p>
                <p className="text-sm text-muted-foreground">
                  {data.sessionData?.circuit_short_name || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Location</p>
                <p className="text-sm text-muted-foreground">
                  {data.sessionData?.location || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Session Type</p>
                <p className="text-sm text-muted-foreground">
                  {data.sessionData?.session_type || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Session Name</p>
                <p className="text-sm text-muted-foreground">
                  {data.sessionData?.session_name || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Date</p>
                <p className="text-sm text-muted-foreground">
                  {data.sessionData?.date_start
                    ? new Date(data.sessionData.date_start).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {data.carData?.map((driver) => (
            <Card key={driver.driver_number} className="overflow-hidden py-1">
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
