import type { Monitor } from "../types/types";

export const mockMonitors: Monitor[] = [
  {
    id: "1",
    name: "Payment API",
    url: "https://api.example.com/payment",
    method: "GET",
    status: "healthy",
    responseTime: 142,
    uptime: 99.99,
    frequency: 30,
    lastChecked: "38 sec ago",
  },
  {
    id: "2",
    name: "Auth API",
    url: "https://api.example.com/auth",
    method: "GET",
    status: "healthy",
    responseTime: 98,
    uptime: 100,
    frequency: 30,
    lastChecked: "41 sec ago",
  },
];

// mockMonitors.push(
//   {
//     id:"3",
//     url:
//   }
// )
