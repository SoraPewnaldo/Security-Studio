# WHOIS / RDAP Lookup

## Overview

A modern alternative to classic WHOIS, leveraging the **Registration Data Access Protocol (RDAP)** to query domain registration records. It returns structured JSON data containing the registrar, nameservers, domain statuses, and important registration dates.

## Features

- Uses the official `rdap.org` bootstrap service to dynamically route queries to the correct authoritative Top-Level Domain (TLD) registry.
- Cleanly parses out the most relevant data (Registrar, Dates, Nameservers).
- Provides access to the raw, full RDAP JSON response for advanced analysis.
- Runs entirely client-side via standard `fetch` because modern RDAP registries enforce permissive CORS policies.

## How it Works

The tool sends a GET request to `https://rdap.org/domain/<domain-name>`. The RDAP organization maintains an up-to-date bootstrap file mapping TLDs to their respective registry's RDAP endpoints, automatically redirecting the request. Once the authoritative response is received in `application/rdap+json` format, the tool parses the `events` and `entities` arrays to extract human-readable info.

## Examples

- **Identify Expiring Domains**: Check the `expiration` event to see when a domain might drop.
- **Identify Registrars**: Quickly see which company holds the domain (e.g. GoDaddy, Namecheap, MarkMonitor).
- **Check EPP Status**: View flags like `clientTransferProhibited` or `serverHold` which indicate domain locks or suspensions.

## Limitations

- **Rate Limiting**: Because queries originate directly from your IP address, excessive queries may trigger temporary rate limits or CAPTCHA requirements from the registry.
- Not all Country Code TLDs (ccTLDs) fully support RDAP yet; for those domains, the lookup might fail or return sparse data.

## References

- [RDAP Protocol (ICANN)](https://www.icann.org/rdap)
- [RFC 7482 - Registration Data Access Protocol (RDAP) Query Format](https://datatracker.ietf.org/doc/html/rfc7482)
