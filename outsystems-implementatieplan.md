# OutSystems Implementatieplan — Rooster & Beschikbaarheid

## Inhoudsopgave
1. [Overzicht & architectuur](#1-overzicht)
2. [Datamodel (Entities)](#2-datamodel)
3. [Business logic (Server Actions)](#3-business-logic)
4. [UI — schermen & flows](#4-ui)
5. [Rollen & beveiliging](#5-rollen)
6. [Stap-voor-stap bouwinstructies](#6-stappen)
7. [Testplan](#7-testplan)

---

## 1. Overzicht & architectuur

**Applicatienaam:** `RoosterBeschikbaarheid`
**Type:** Reactive Web Application
**OutSystems versie:** O11 of ODC (beide geschikt)

### Lagen
```
UI Layer       → Reactive Web Screens (OutSystems UI framework)
Logic Layer    → Server Actions, Client Actions, Timers
Data Layer     → Entities in een eigen module (service module)
Integration    → (fase 2) koppeling HR-systeem voor contracturen
```

### Module-opzet (aanbevolen)
| Module | Type | Doel |
|--------|------|------|
| `RoosterBeschikbaarheid_Core` | Service Module | Entities + Server Actions |
| `RoosterBeschikbaarheid_Web` | Reactive Web | Schermen, UI-logica |
| `RoosterBeschikbaarheid_Th` | Theme Module | OutSystems UI aanpassingen |

---

## 2. Datamodel (Entities)

### 2.1 Team
```
Entity: Team
─────────────────────────────────
Id          : Long Integer (AutoNumber) [PK]
Naam        : Text(100)          [Mandatory]
ManagerId   : User Identifier    [FK → User]
IsActief    : Boolean            [Default: True]
```

### 2.2 Medewerker
```
Entity: Medewerker
─────────────────────────────────
Id          : Long Integer (AutoNumber) [PK]
UserId      : User Identifier    [FK → User, Unique]
TeamId      : Team Identifier    [FK → Team]
Voornaam    : Text(100)
Achternaam  : Text(100)
IsActief    : Boolean            [Default: True]
```

### 2.3 Werkrooster (contract + dagverdeling)
```
Entity: Werkrooster
─────────────────────────────────
Id              : Long Integer (AutoNumber) [PK]
MedewerkerId    : Medewerker Identifier [FK → Medewerker]
ContractUrenPerWeek : Decimal(5,2)   [Mandatory]  ← bruto uren
UrenMaandag     : Decimal(4,2)       [Default: 0]
UrenDinsdag     : Decimal(4,2)       [Default: 0]
UrenWoensdag    : Decimal(4,2)       [Default: 0]
UrenDonderdag   : Decimal(4,2)       [Default: 0]
UrenVrijdag     : Decimal(4,2)       [Default: 0]
UrenZaterdag    : Decimal(4,2)       [Default: 0]
UrenZondag      : Decimal(4,2)       [Default: 0]
Ingangsdatum    : Date               [Mandatory]
Einddatum       : Date               [Nullable]   ← null = huidig
```
> **Patroon:** meerdere rijen mogelijk per medewerker voor historische roosters.
> Gebruik altijd het rooster met de hoogste `Ingangsdatum ≤ peildatum`.

### 2.4 UrenType (Static Entity)
```
Static Entity: UrenType
─────────────────────────────────
Id    Label         Kleurcode
1     Verlof         #F5A623
2     Ziekte         #E5214E
3     Projectinzet   #7B5EA7
4     Uitleen        #1565D8
```

### 2.5 UrenRegistratie (kern-entiteit)
```
Entity: UrenRegistratie
─────────────────────────────────
Id              : Long Integer (AutoNumber) [PK]
MedewerkerId    : Medewerker Identifier [FK → Medewerker, Mandatory]
UrenTypeId      : UrenType Identifier   [FK → UrenType, Mandatory]
Weeknummer      : Integer               [Mandatory]   ← ISO weeknr
Jaar            : Integer               [Mandatory]
UrenMaandag     : Decimal(4,2)          [Default: 0]
UrenDinsdag     : Decimal(4,2)          [Default: 0]
UrenWoensdag    : Decimal(4,2)          [Default: 0]
UrenDonderdag   : Decimal(4,2)          [Default: 0]
UrenVrijdag     : Decimal(4,2)          [Default: 0]
UrenZaterdag    : Decimal(4,2)          [Default: 0]
UrenZondag      : Decimal(4,2)          [Default: 0]
UitleenNaarTeamId : Team Identifier     [FK → Team, Nullable]  ← alleen bij Uitleen
Omschrijving    : Text(500)
GeregistreerdDoor : User Identifier
GeregistreerdOp   : DateTime
```
> **Constraint:** `UitleenNaarTeamId` is verplicht wanneer `UrenTypeId = 4 (Uitleen)`.
> **Derived:** Inleen in team Beta = alle registraties met `UrenTypeId=4` en `UitleenNaarTeamId = Beta.Id`.

### 2.6 Index-suggesties
```sql
IX_UrenReg_Medewerker_Week   : (MedewerkerId, Jaar, Weeknummer)
IX_UrenReg_Team_Week         : (UitleenNaarTeamId, Jaar, Weeknummer)
IX_Werkrooster_Medewerker    : (MedewerkerId, Ingangsdatum)
```

---

## 3. Business Logic (Server Actions)

### 3.1 Uren berekenen

```
Server Action: GetBeschikbaarheidsoverzicht
Input:  TeamId, Jaar, Weeknummer
Output: List of BeschikbaarheidRecord {
          MedewerkerId, Naam,
          BrutoUren,
          UrenVerlof, UrenZiekte, UrenProject, UrenUitleen, UrenInleen,
          NettoUren, PctBeschikbaar
        }

Logica:
1. Fetch Werkrooster voor elke medewerker (actief op peildatum)
2. Fetch alle UrenRegistratie voor (TeamId, Jaar, Week)
3. Per medewerker:
   BrutoUren  = Werkrooster.ContractUrenPerWeek
   NettoUren  = BrutoUren
             - SUM(registraties Verlof + Ziekte + Project + Uitleen)
             + SUM(uitleen-registraties waar UitleenNaarTeamId = TeamId)  ← inleen
   PctBeschikbaar = NettoUren / BrutoUren * 100
```

```
Server Action: SlaUrenRegistratieOp
Input:  UrenRegistratieRecord (zie entity), Valideer: Boolean
Output: UrenRegistratieId, ValidationMessages

Validaties:
- UrenPerDag ≤ BrutoUrenDag (uit werkrooster)
- TotaalRegistraties + nieuw ≤ BrutoUrenWeek
- Bij Uitleen: UitleenNaarTeamId ≠ eigen team
- Weeknummer 1-53, Jaar ≥ huidig jaar - 1
```

```
Server Action: GetTeamCapaciteitMatrix
Input:  TeamId, VanWeek, TotWeek, Jaar
Output: WeekMatrix met per week { BrutoUren, Beschikbaar, PerType[] }
→ gebruikt voor trendgrafieken en planningshorizon
```

### 3.2 Uitleen/Inleen aggregatie

```
Server Action: GetUitleenOverzicht
Input:  Jaar, Weeknummer
Output: List of UitleenRecord {
          MedewerkerId, MedewerkerNaam,
          VanTeamId, VanTeamNaam,
          NaarTeamId, NaarTeamNaam,
          TotaalUren, Omschrijving
        }
```

---

## 4. UI — Schermen & Flows

### 4.1 Schermoverzicht

| Scherm | URL | Rol |
|--------|-----|-----|
| `Dashboard` | `/Dashboard` | Manager, Medewerker |
| `TeamOverzicht` | `/Teams` | Manager |
| `TeamDetail` | `/Teams/{TeamId}` | Manager |
| `MedewerkerDetail` | `/Medewerkers/{MedewerkerId}` | Manager, Medewerker (eigen) |
| `BeschikbaarheidRegistratie` | `/Beschikbaarheid/Nieuw` | Manager, Medewerker |
| `WerkroosterBeheer` | `/Roosters` | Manager |
| `UitleenOverzicht` | `/Uitleen` | Manager |

### 4.2 Dashboard (MainFlow > Dashboard)

**Widgets nodig:**
- KPI Cards → gebruik `Card` widget + `Expression` voor berekende waarden
- Teamoverzicht tabel → `Table` widget gevuld via Aggregate op `GetBeschikbaarheidsoverzicht`
- Bar chart urenverdeling → `OutSystems Charts` widget (Column/Bar chart)
- Uitleen-tabel → aparte Aggregate op `UrenRegistratie` gefilterd op `UrenTypeId=4`

**Data Actions:**
```
OnInitialize:
  GetTeamoverzicht (Server Action)
  GetActieveUitleningen (Server Action)
  SetCurrentWeek (Client Action → bereken ISO weeknr)
```

### 4.3 Beschikbaarheid Registratie (formulier)

**Form structuur:**
```
Form: RegistratieForm
  Dropdown: Medewerker        (source: Medewerkers van eigen team)
  Dropdown: Type              (source: Static Entity UrenType)
  Conditional block [if Type = Uitleen]:
    Dropdown: UitleenNaarTeam
    Input:    Omschrijving (verplicht bij uitleen)
  Input: Week (type="week" of twee velden Jaar + Week)
  5× Input number: Ma/Di/Wo/Do/Vr uren
  Input: Omschrijving (optioneel)
  Button: Opslaan → OnClick: SlaUrenRegistratieOp
```

**Validatielogica (Client Action + Server validatie):**
```
OnChange daguren:
  TotaalIngevoerd = Ma + Di + Wo + Do + Vr
  If TotaalIngevoerd > BrutoUrenWeek Then
    ShowWarning("Meer uren dan contracturen")
  If Type = Uitleen AND UitleenNaarTeam = NullIdentifier Then
    ShowError("Kies een team")
```

### 4.4 Medewerker weekoverzicht

**Weekkalender widget:**
- Gebruik een `Table` met 6 rijen (types) × 5 kolommen (dagen)
- Vul via Aggregate: `UrenRegistratie` WHERE `MedewerkerId = param AND Jaar = X AND Week = Y`
- Bereken `NettoUren` per dag als: `BrutoUren - SUM(alle niet-beschikbare uren)`
- Kleurcodering via `If()` expressie in `Style` property van `TableCell`

### 4.5 OutSystems UI componenten (gebruik standaard)

```
Navigation  → Sidebar menu (OutSystems UI > Navigation > Sidebar)
KPI Cards   → Card + Heading widget
Tabellen    → Table widget (sortable)
Formulieren → Form widget + Input + Dropdown
Modals      → Popup widget (OutSystems UI)
Notificaties→ Feedback_Message (OutSystems system action)
Charts      → OutSystems Charts component (Forge)
```

---

## 5. Rollen & beveiliging

### Gebruikersrollen (Roles in OutSystems)
```
Role: Manager
  - Kan alle medewerkers van eigen team beheren
  - Kan bruto uren & werkroosters instellen
  - Kan uren namens medewerkers registreren
  - Ziet alle teams in dashboard

Role: Medewerker
  - Kan alleen eigen beschikbaarheid registreren
  - Ziet alleen eigen weekoverzicht
  - Ziet team-totalen (niet individuele collega's)
```

### Beveiliging per scherm
```
Dashboard              → Check Roles: Manager OR Medewerker
TeamDetail             → Check Roles: Manager
WerkroosterBeheer      → Check Roles: Manager
BeschikbaarheidNieuw   → Check Roles: Manager OR Medewerker
MedewerkerDetail       → Check: Manager OR (Medewerker AND MedewerkerId = GetCurrentMedewerker())
```

### Server Action beveiliging
```
SlaUrenRegistratieOp:
  If NOT CheckRole(Manager) AND input.MedewerkerId ≠ GetCurrentMedewerker() Then
    RaiseException("Geen toegang")
```

---

## 6. Stap-voor-stap bouwinstructies

### Fase 1 — Fundament (sprint 1, ca. 5 dagen)

**Stap 1: Module aanmaken**
1. Open Service Studio > New Application > Reactive Web App
2. Naam: `RoosterBeschikbaarheid`, Icon kiezen
3. Maak de drie modules aan (Core, Web, Theme)
4. Installeer **OutSystems UI** via Forge (als nog niet aanwezig)
5. Installeer **OutSystems Charts** via Forge

**Stap 2: Datamodel bouwen (Core module)**
1. Ga naar de `Data` tab in de Core module
2. Maak de Entities aan in deze volgorde:
   - `Team` → voeg attributes toe zoals beschreven in §2.1
   - `Medewerker` → voeg FK naar Team en User toe
   - `Werkrooster` → let op Ingangsdatum/Einddatum patroon
   - Static Entity `UrenType` met 4 waarden (label + kleurcode)
   - `UrenRegistratie` → voeg alle velden en indexes toe
3. Sla op en doe Publish

**Stap 3: Test data aanmaken**
1. Gebruik `BootstrapData` Timer of Bootstrap Server Action
2. Maak 2 teams, 4 medewerkers, standaardwerkroosters aan
3. Voeg enkele UrenRegistraties toe voor de huidige week

**Stap 4: Server Actions (Core module)**
1. Maak `GetBeschikbaarheidsoverzicht` aan (zie §3.1)
2. Maak `SlaUrenRegistratieOp` aan met validaties
3. Maak `GetUitleenOverzicht` aan
4. Expose alle Server Actions via Public = Yes

---

### Fase 2 — Dashboard & Teamoverzicht (sprint 2, ca. 4 dagen)

**Stap 5: Web module instellen**
1. Voeg referentie toe naar Core module (alle public actions + entities)
2. Stel het Theme in (OutSystems UI Base Theme of eigen aanpassing)
3. Configureer de Sidebar navigatie in `MainFlow > Layout`

**Stap 6: Dashboard scherm**
1. Maak scherm `Dashboard` in MainFlow
2. Voeg Data Action toe: `GetDashboardData`
   - Roep `GetBeschikbaarheidsoverzicht` aan voor alle teams
   - Roep `GetUitleenOverzicht` aan
3. Bouw KPI Cards: gebruik `Card` widget, bind waarden via Expression
4. Bouw de teamtabel: `Table` widget, klik-navigatie naar `TeamDetail`
5. Voeg Bar Chart toe (OutSystems Charts) voor urenverdeling
6. Voeg weeknavigatie toe: Client Action `VorigeWeek` / `VolgendeWeek`
   die een lokale variabele `HuidigWeek` aanpast en Data Action refresht

**Stap 7: TeamDetail scherm**
1. Input parameter: `TeamId` (Long Integer)
2. Data Action: haal team + medewerkers + uren op
3. Bouw medewerker-tabel met per-type kolommen
4. Voeg knop "Medewerker toevoegen" toe → Popup of nieuw scherm

---

### Fase 3 — Registratie & Medewerkerdetail (sprint 3, ca. 5 dagen)

**Stap 8: Beschikbaarheid registratieformulier**
1. Maak scherm `BeschikbaarheidNieuw`
2. Bouw Form widget met de velden uit §4.3
3. Implementeer conditional rendering voor Uitleen-velden:
   - Gebruik `If` widget gekoppeld aan lokale variabele `SelectedType`
4. Valideer aan clientzijde (Client Action `ValideerFormulier`)
5. OnClick Opslaan → Server Action `SlaUrenRegistratieOp`
6. Na succes: `Feedback_Message("Uren opgeslagen")` + navigeer terug

**Stap 9: MedewerkerDetail scherm**
1. Input parameter: `MedewerkerId`
2. Bouw het profiel-blok (naam, team, contracturen)
3. Bouw de weekkalender-tabel:
   - Aggregate: haal alle registraties voor (medewerker, week) op
   - Maak een Record List structuur per dag/type
   - Gebruik kleurbadges via `If()` in `Style` property
4. Bouw registratiehistorie tabel onderaan

---

### Fase 4 — Uitleen/Inleen & Rollen (sprint 4, ca. 4 dagen)

**Stap 10: Uitleen overzicht**
1. Maak scherm `UitleenOverzicht`
2. Tabel "Actieve uitleningen": Aggregate op `UrenRegistratie` WHERE `UrenTypeId=4`
3. Tabel "Inleen per team": GROUP BY `UitleenNaarTeamId`, SUM uren
4. Voeg filter toe op week en team

**Stap 11: Rollen instellen**
1. Ga naar `Logic` tab > Roles
2. Maak rollen `Manager` en `Medewerker` aan
3. Ken rollen toe in `Users` (of via HR-koppeling later)
4. Beveilig schermen: rechtermuisklik op scherm > `Accessible by`
5. Voeg role checks toe in Server Actions

**Stap 12: Werkrooster beheer (Manager)**
1. Maak scherm `WerkroosterBeheer`
2. Lijst alle medewerkers met huidig rooster
3. Maak Popup voor bewerken: `Werkrooster` entity edit
4. Valideer: som daguren = contracturen

---

### Fase 5 — Polish & deploy (sprint 5, ca. 3 dagen)

**Stap 13: UI verfijning**
- Zorg dat alle kleurcodes overeenkomen met `UrenType.Kleurcode`
- Voeg lege-toestand berichten toe ("Geen registraties voor deze week")
- Maak alle tabellen sorteerbaar

**Stap 14: Performance**
- Controleer alle Aggregates: voeg WHERE-clausules toe om te filteren vóór ophalen
- Gebruik `Preparation` / `Data Actions` correct: geen logica in UI expressies
- Voeg Database Indexes toe (zie §2.6)

**Stap 15: Testen & uitrollen**
- Voer testscenario's uit (zie §7)
- Deploy naar Development omgeving via 1-Click Publish
- Testen in DEV → promotie naar QA → acceptatie → PRD

---

## 7. Testplan

### Functionele tests

| # | Scenario | Verwacht resultaat |
|---|----------|--------------------|
| T1 | Manager registreert 8u verlof voor medewerker (Ma) | Netto beschikbaar Ma = 0u |
| T2 | Medewerker probeert meer uren te registreren dan contracturen | Validatiefout getoond |
| T3 | Manager registreert uitleen Jan → team Beta voor 2 dagen | Alpha –16u, Beta +16u inleen |
| T4 | Dashboard toont teamtotalen correct | Kolom Beschikbaar = Bruto – alle niet-beschikbaar + inleen |
| T5 | Medewerker ziet alleen eigen data, niet van collega's | Andere medewerker-pagina geeft fout / redirect |
| T6 | Werkrooster aanpassen (36u → 40u) per volgende week | Nieuwe week gebruikt 40u als bruto |
| T7 | Uitleen registreren zonder team te kiezen | Validatiefout "Kies een ontvangend team" |
| T8 | Twee uitleen-registraties voor zelfde medewerker, zelfde week | Beide zichtbaar, totaal correct |
| T9 | Weeknavigatie wisselt data correct | Data wordt herladen voor geselecteerde week |
| T10 | Uitleen-overzicht toont inleen correct bij ontvangend team | Inleentabel toont Beta: 24u van Alpha |

### Technische controles
- [ ] Alle Server Actions hebben Exception Handler
- [ ] Gevoelige schermen geblokkeerd bij foutieve rol
- [ ] Aggregate performance < 500ms bij 100 medewerkers
- [ ] Formulieren tonen serverfout bij netwerkfout
- [ ] Bootstrap data verwijderd of disabled in productie

---

## Appendix A — Aanbevolen Forge componenten

| Component | Gebruik |
|-----------|---------|
| OutSystems UI | Basis UI-framework (sidebar, cards, modals) |
| OutSystems Charts | Bar/column charts voor urenverdeling |
| Input_Masks | Week-invoer formatting |
| Silk UI (legacy) | Indien O10 gebruikt wordt |

## Appendix B — Toekomstige uitbreidingen (fase 2)

- **HR-koppeling:** Importeer contracturen automatisch uit HR-systeem via REST API
- **Notificaties:** E-mail bij uitleen-goedkeuring (Email template in OutSystems)
- **Export:** Excel-export van weekoverzicht via ExcelUtils Forge component
- **Mobiel:** Progressive Web App (PWA) voor medewerker-selfservice
- **Goedkeuringsflow:** Manager moet uitleen goedkeuren vóór het effect zichtbaar is
