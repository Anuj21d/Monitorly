
import dns from "node:dns/promises";
import ipaddr from "ipaddr.js";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
]);

export async function validateMonitorUrl(
  input: string
): Promise<URL> {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid monitor URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported");
  }

  if (url.username || url.password) {
    throw new Error("URLs must not contain embedded credentials");
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

  if (
    !hostname ||
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("This hostname is not allowed for monitoring");
  }

  // If the hostname is an IP literal, classify it directly.
  if (ipaddr.isValid(hostname)) {
    const address = ipaddr.process(hostname);

    if (address.range() !== "unicast") {
      throw new Error("This IP address is not allowed for monitoring");
    }

    return url;
  }

  // Resolve DNS and reject destinations that include non-public addresses.
  let addresses: Awaited<ReturnType<typeof dns.lookup>>[];

  try {
    addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new Error("Unable to resolve monitor hostname");
  }

  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => {
      if (!ipaddr.isValid(address)) return true;
      return ipaddr.process(address).range() !== "unicast";
    })
  ) {
    throw new Error("Hostname resolves to a non-public IP address");
  }

  return url;
}

