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
import { useWebSocket } from "@/hooks/useWebSocket";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { data, connected } = useWebSocket();

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
                  {data?.session?.circuit_short_name || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Location</p>
                <p className="text-sm text-muted-foreground">
                  {data?.session?.location || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Session Type</p>
                <p className="text-sm text-muted-foreground">
                  {data?.session?.session_type || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Session Name</p>
                <p className="text-sm text-muted-foreground">
                  {data?.session?.session_name || "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Date</p>
                <p className="text-sm text-muted-foreground">
                  {data?.session?.date_start
                    ? new Date(data?.session.date_start).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {data?.drivers?.map((driver) => (
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
