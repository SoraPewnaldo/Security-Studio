# ASN Lookup

## Overview

Query Autonomous System Numbers (ASN) using the Registration Data Access Protocol (RDAP). ASNs uniquely identify networks on the Internet that have a single, clearly defined routing policy (e.g., ISPs, large tech companies).

## Features

- Resolves ASNs (e.g., `15169` or `AS15169`) to their registered network name and country.
- Identifies the Regional Internet Registry (RIR) responsible for the ASN (ARIN, RIPE, APNIC, LACNIC, AFRINIC).
- Retrieves registration and modification dates.
- Access to raw JSON data for deep analysis.

## How it Works

The tool sends a GET request to the global RDAP bootstrap server at `https://rdap.org/autnum/<asn>`. This service automatically redirects the request to the correct Regional Internet Registry that issued the ASN. The tool then parses the standard RDAP JSON response to extract the core details.

## Examples

- **AS15169**: Google's primary ASN.
- **AS13335**: Cloudflare's primary ASN.
- **AS714**: Apple's ASN.

## Limitations

- Data formatting can occasionally vary slightly between different RIRs (e.g., ARIN vs RIPE), though RDAP is designed to standardize this.
- If an ASN is not allocated or is private, the lookup will fail.

## References

- [Autonomous System (Internet) on Wikipedia](https://en.wikipedia.org/wiki/Autonomous_system_(Internet))
- [RDAP Protocol (ICANN)](https://www.icann.org/rdap)
