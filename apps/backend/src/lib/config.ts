function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

export const config = {
  gamesTable: required("GAMES_TABLE"),
  connectionsTable: required("CONNECTIONS_TABLE"),
};
