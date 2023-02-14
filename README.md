# ord-dns

This will be a basic nextjs template project for running an ordinal-based DNS service.

The goal is to have a one-click install web service that:

- Verifies ownership of an individual satoshi.
- Allows owners to publish / update a DNS record which:
  * Manages lookups to the {ordinal_value}.ord domain.
  * Contains the proof of ownership for the satoshi.
  * Contains DNS forwarding rules (that are signed by the owner).
- Optional: Invoices the cost of maintaining the record and forwarding traffic (using bolt11)

This project is in heavy development.

Stay tuned!


