# osaka

**osaka** is a React Native app offering simplified home accessibility solution- and product-focused price building workflows within organizations. Users follow deliberately-designed workflows, with an emphasis on customer interaction, to generate pricing and work agreements (i.e., quotes and estimates).

## Hardware Targets

## Minimum

- iPad Air 64GB Wi-Fi + Cellular (3rd Generation)
- Apple Pencil (1st Generation)

## Recommended

- iPad Pro 256GB Wi-Fi + Cellular (12.9", 3rd Generation)
- Apple Pencil (2nd Generation)

## Database Layout

Patterned around multi-tenancy within a single database. The app database follows the backend database structurally, but selectively syncs data associated with only a single tenant. It's comprised of the following tables:

| Name                | Description                                                                                   | Links to                                        |
| ------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| organizations       | Company or organization details, including organizational preferences                         |                                                 |
| users               | Individual user data, including credentials, associated with a single organization            | organizations                                   |
| contacts            | Individual customer data, with contact information (email, phone, addresses, etc.)            | addresses, organizations, users                 |
| addresses           | Mailing address data                                                                          |                                                 |
| agreements          | Quotes (or other documents) for an individual contact, maintaining status of acceptance       | addresses, agreement_templates, contacts, users |
| agreement_events    | Events related to an agreement, like printed, emailed, viewed, etc.                           | agreements                                      |
| agreement_templates | Defines the layout and content of an agreement                                                |                                                 |
| line_items          | The catalog items that comprise an agreement                                                  | agreements, catalog_items                       |
| catalog_items       | Products and services available, with SKUs, cost/pricing                                      | vendors                                         |
| vendors             | Vendors from which catalog items are available                                                |                                                 |
| catalog_offerings   | Describes a many-to-many relationship between organizations and their available catalog items | catalog_items, organizations                    |
