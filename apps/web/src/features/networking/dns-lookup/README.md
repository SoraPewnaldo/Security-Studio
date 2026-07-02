# DNS Lookup

## Overview

Perform Domain Name System (DNS) queries directly from your browser. Easily fetch A, AAAA, MX, TXT, NS, and CNAME records to verify domain configurations, troubleshoot email delivery (SPF/DKIM), or investigate subdomains.

## Features

- Supports all major DNS record types.
- Uses Google's DNS-over-HTTPS (DoH) API, bypassing local DNS caches or restrictive corporate firewalls.
- Displays Answers and Authority records with their respective Time-To-Live (TTL) values.
- Clean and intuitive interface for quick lookups.

## How it Works

The tool sends a standard REST API request to `https://dns.google/resolve` carrying the domain name and requested record type. This is known as DNS-over-HTTPS (DoH). Because the request is made over HTTPS to a public resolver that supports CORS, the browser can execute the query without needing a backend server proxy or raw UDP sockets.

## Examples

- **Verify Email Setup**: Query `MX` for `example.com` to see their mail servers. Query `TXT` to view their SPF policies.
- **Find IP Address**: Query `A` to get the IPv4 address, or `AAAA` to get the IPv6 address.
- **Find Hosting Provider**: Query `NS` to see which nameservers are authoritative for the domain.

## Limitations

- Queries are resolved against Google's public DNS servers (8.8.8.8). If you have recently changed records, you may see cached results until the TTL expires.
- Does not support querying arbitrary/custom nameservers.
- Cannot resolve internal or `.local` network domains.

## References

- [DNS over HTTPS (Wikipedia)](https://en.wikipedia.org/wiki/DNS_over_HTTPS)
- [Google Public DNS API](https://developers.google.com/speed/public-dns/docs/doh/json)
- [List of DNS record types (Wikipedia)](https://en.wikipedia.org/wiki/List_of_DNS_record_types)
