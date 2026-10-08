---
title: "Sipora wave energy thesis (ITB)"
status: "Verified"
statusNote: "accepted ITB undergraduate thesis, 2024; results not validated against measurements"
summary: "Wave energy resource and cost of energy for a floating wave energy converter farm off Sipora Island, Mentawai."
updated: 2026-10-08
order: 4
sourcePublic: false
languages: []
verification:
  - "Defended and accepted as an undergraduate thesis, Ocean Engineering, Institut Teknologi Bandung, 2024; catalogued in the ITB digital library."
  - "Wave power at the site from hourly ERA5 data for 2022: mean 10.32 kW/m, maximum 30.3 kW/m."
  - "Annual energy production by the power matrix x scatter table method: Pelamis 62,925 kWh, Wave Dragon 3,382,126 kWh, OE Buoy 220,051 kWh."
  - "Minimum levelised cost of energy for Wave Dragon: Rp9,311.95/kWh."
openItems:
  - "Wave data not validated against measurements."
  - "Power matrices taken from published figures, not manufacturer data."
  - "Costs referenced from floating wind, not wave energy projects."
  - "Revenue uses 3,382,182 kWh/yr, 56 kWh more than the stated AEP; cause not traced."
---

## Problem

How much wave energy is available off Sipora Island (Mentawai Islands, West Sumatra), how much of it would
three device designs capture, and at what cost per kWh? The thesis title, translated: *Evaluation study of
a floating ocean wave energy power plant in the waters of Sipora Island, Mentawai Islands, West
Sumatera*.[^title]

## Method

- **Site:** west of North Sipora district, 16.5 km offshore, about 2°3′S 99°24′E.[^concl]
- **Waves:** ECMWF reanalysis (ERA5), hourly, for 2022.[^abstract]
- **Energy:** annual energy production of three devices (Pelamis, Wave Dragon, OE Buoy) by the power
  matrix × scatter table method, with power matrices taken from published figures.[^abstract] [^toc]
- **Cost:** levelised cost of energy and net present value, with cost estimates referenced from floating
  wind projects, and the regional electricity supply cost of PLN for the Mentawai Islands,
  Rp2,319.00/kWh (Kepmen ESDM 169.K/HK.02/MEM.M/2021).[^abstract] [^npv]

<details open>
<summary><h2>Verification</h2></summary>

| Check | Against | Result | Source |
|---|---|---|---|
| Thesis review | Ocean Engineering programme, ITB | Defended and accepted, 2024 | my statement, 2026-10-08 |
| Library record | ITB digital library | Catalogued as an undergraduate thesis (Tugas Akhir), Ocean Engineering, 2024 | [^digilib] |
| Wave data | Measurements | Not done; the thesis itself recommends it | [^saran] |

</details>

## Results

| Quantity | Value | Source |
|---|---|---|
| Incoming wave direction | 191.25°–213.75° | [^concl] |
| Hs, range | 0.61–2.33 m | [^concl] |
| Tp, range | 6.11–20.95 s | [^concl] |
| Wave power, mean | 10.32 kW/m | [^concl] |
| Wave power, maximum | 30.3 kW/m | [^concl] |
| AEP, Pelamis | 62,925 kWh | [^concl] |
| AEP, Wave Dragon (selected) | 3,382,126 kWh | [^concl] |
| AEP, OE Buoy | 220,051 kWh | [^concl] |
| NPV at the PLN supply cost (Rp2,319.00/kWh) | −Rp259.1 billion: not feasible | [^npv] |
| Minimum levelised cost of energy, Wave Dragon | Rp9,311.95/kWh | [^concl] |

Wave Dragon was selected for the largest captured energy and a relatively lower price.[^concl]

<details open>
<summary><h2>Limitations and open items</h2></summary>

- The wave data were not validated against measurements; the thesis lists this as its first
  recommendation.[^saran]
- One year of data (2022), so interannual variability is not sampled.
- Power matrices come from published figures, not manufacturer data; costs are referenced from floating
  wind.
- The revenue calculation uses 3,382,182 kWh per year over 25 years, 56 kWh more than the stated AEP of
  3,382,126 kWh. The cause is not traced.[^npv]
- The thesis's own further recommendations: consider newer devices, and use current interest, inflation and
  device-price data.[^saran]

</details>

## Where to find it

Not software. The thesis (in Indonesian) is catalogued in the [ITB digital library](https://digilib.itb.ac.id/gdl/view_data/studi-evaluasi-pembangkit-listrik-tenaga-gelombang-laut-di-perairan-pulau-sipura-kepulauan-mentawai-sumatera-barat/faris-winawan); access to
the file there is restricted.[^digilib]

[^title]: Thesis title page and English abstract, Institut Teknologi Bandung, 16 March 2024.
[^abstract]: Thesis abstract.
[^toc]: Thesis §2.10 (device options and their power matrices).
[^npv]: Thesis chapter 5 (revenue and net present value).
[^concl]: Thesis §6.1, conclusions.
[^saran]: Thesis §6.2, recommendations.
[^digilib]: [ITB digital library record](https://digilib.itb.ac.id/gdl/view_data/studi-evaluasi-pembangkit-listrik-tenaga-gelombang-laut-di-perairan-pulau-sipura-kepulauan-mentawai-sumatera-barat/faris-winawan), entered 18 March 2024. The record's title reads "Pulau Sipura" and omits "Terapung".
