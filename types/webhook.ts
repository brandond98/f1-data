export interface Session {
  circuit_short_name: string;
  date_start: string;
  location: string;
  session_name: string;
  session_type: string;
}

export interface WebsocketResponse {
  drivers: Driver[];
  session: Session;
}

export interface Driver {
  driver_number: number;
  full_name: string;
  name_acronym: string;
  team_colour: string;
  team_name: string;
}
