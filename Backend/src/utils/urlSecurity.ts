import dns from "node:dns/promises";
import net from "node:net";
import ipaddr from "ipaddr.js";

const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);

export type ValidatedMonitorTarget = {
  url: URL;
  addresses: Array<{
    address: string;
    family: number;
  }>;
};

export async function resolveMonitorUrl(
  input: string,
): Promise<ValidatedMonitorTarget> {
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

  const hostname = url.hostname
    .replace(/^\[|\]$/g, "")
    .toLowerCase()
    .replace(/\.$/, "");

  if (
    !hostname ||
    BLOCKED_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("This hostname is not allowed for public monitoring");
  }

  let addresses: Array<{ address: string; family: number }>;

  if (net.isIP(hostname)) {
    addresses = [{ address: hostname, family: net.isIP(hostname) }];
  } else {
    try {
      addresses = await dns.lookup(hostname, {
        all: true,
        verbatim: true,
      });
    } catch {
      throw new Error("Unable to resolve monitor hostname");
    }
  }

  if (
    addresses.length === 0 ||
    addresses.some(({ address, family }) => {
      if (!net.isIP(address) || !ipaddr.isValid(address)) {
        return true;
      }

      if (net.isIP(address) !== family) {
        return true;
      }

      return ipaddr.process(address).range() !== "unicast";
    })
  ) {
    throw new Error("Hostname resolves to a non-public IP address");
  }

  return { url, addresses };
}

export async function validateMonitorUrl(input: string): Promise<URL> {
  const target = await resolveMonitorUrl(input);
  return target.url;
}
