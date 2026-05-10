# WayPointer — tūrisma maršrutu plānošanas platforma

WayPointer ir tīmekļa platforma, kas paredzēta tūrisma objektu un iestāžu meklēšanai, vērtēšanai un
saglabāšanai, kā arī personalizētu ceļojumu maršrutu izveidei un publicēšanai.

Projekts izstrādāts mācību programmas **„Programmēšana”** ietvaros  
**Rīgas Valsts tehnikums**, 2025–2026  
Autors: **Maksym Pronkin (DP3-2)**

---

## 📌 Projekta mērķis

Projekta mērķis ir izveidot vienotu tiešsaistes sistēmu, kas apvieno:
- tūrisma objektu meklēšanu un vērtēšanu;
- iestāžu (kafejnīcu, restorānu, viesnīcu) apskati;
- lietotāju veidotu ceļojumu maršrutu plānošanu;
- pieredzes apmaiņu starp lietotājiem.

Esošās platformas (TripAdvisor, Google Maps, Visit A City) piedāvā tikai daļu no šīs funkcionalitātes,
tādēļ WayPointer nodrošina integrētu un personalizētu risinājumu.

---

## 🧭 Galvenā funkcionalitāte

- Lietotāju reģistrācija un pieteikšanās (ar e-pastu)
- Tūrisma objektu katalogs ar aprakstiem un tipiem
- Meklēšana un filtrēšana
- Atsauksmju un vērtējumu pievienošana (1–5)
- Maršrutu izveide, rediģēšana un publicēšana
- Objektu un maršrutu pievienošana izlasei
- Citu lietotāju maršrutu apskate
- Lietotāja profila pārvaldība
- Administrēšana un satura moderēšana

---

## 👥 Lietotāju lomas

### Viesis
- Apskata publiski pieejamus tūrisma objektus
- Lasa atsauksmes
- Reģistrējas pilnas piekļuves iegūšanai

### Reģistrēts lietotājs
- Veido un pārvalda maršrutus
- Pievieno atsauksmes un vērtējumus
- Saglabā objektus un maršrutus izlasei
- Rediģē vai dzēš savu profilu

### Administrators
- Pārvalda lietotājus
- Moderē atsauksmes
- Uzrauga datu un satura korektumu

---

## 🏗️ Sistēmas arhitektūra

Sistēma balstīta uz šādām galvenajām entītijām:

- **User** — sistēmas lietotājs
- **TouristPlace** — tūrisma objekts
- **Institution** — iestāde (restorāns, viesnīca u.c.)
- **Route** — ceļojuma maršruts
- **RoutePoint** — maršruta punkts
- **Review** — lietotāja atsauksme
- **Favorites** — izlases elementi
- **Country / City** — ģeogrāfiskā struktūra

Entītiju attiecības definētas UML un ER diagrammās.

---

## 🗄️ Datu bāzes struktūra

Sistēmā tiek izmantota relāciju datubāze ar normalizētu struktūru.

Galvenās tabulas:
- `User`
- `Tourist_place`
- `Institution`
- `Route`
- `Route_point`
- `Review`
- `Favorites`
- `Country`
- `City`

### Piemērs: tabula User

```sql
CREATE TABLE IF NOT EXISTS `User` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('user', 'admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
);
