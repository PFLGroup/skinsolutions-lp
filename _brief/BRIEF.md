# BRIEF — Landing Page „Skin Solutions"

## Cel
Premium landing page (one-page) dla kliniki kosmetologii i medycyny estetycznej **Skin Solutions** (Mokotów, Warszawa). Cel konwersyjny: **rezerwacja wizyty przez Booksy** + kontakt telefoniczny. Strona ma być **własna, oryginalna, przyciągająca uwagę kobiet** — elegancka, „drogie spa / klinika premium", a nie generyczny szablon. Mamy „być najlepsi".

## Grupa docelowa
Kobiety 25–55, Warszawa/Mokotów, dbające o siebie, szukające zaufanego, profesjonalnego miejsca z ciepłą atmosferą. Ton: ekspercki, ale ciepły i opiekuńczy; luksus dostępny, nie chłodny.

## Identyfikacja wizualna
**Kolory marki (paleta — używaj tych zmiennych w :root):**
- `--green-deep: #3a5d49` — głęboka zieleń (kolor wiodący: nagłówki, tła sekcji akcentowych, przyciski, stopka)
- `--cream: #efedeb` — kremowa biel (tło główne, „oddech")
- `--sage: #b0c9aa` — szałwiowa zieleń (akcenty, hover, delikatne tła, ozdobniki)
- Dozwolone wartości pochodne: przyciemnienia/rozjaśnienia powyższych + neutralny tekst (ciemny grafit ~#23302a na kremie). Złoty/mosiężny akcent (`#b08d57` / `#c9a66b`) DOPUSZCZALNY oszczędnie jako detal premium (cienkie linie, ikony) — ale zieleń+krem to rdzeń.
- Wysoki kontrast i czytelność OBOWIĄZKOWE (WCAG AA): tekst na kremie ciemny; tekst na głębokiej zieleni jasny/kremowy. Sprawdź kontrast każdej kombinacji.

**Typografia:** elegancki, kobiecy duet. Nagłówki: szlachetny serif/display (np. „Cormorant Garamond", „Playfair Display" lub „Fraunces"). Tekst: czysty, lekki sans (np. „Inter", „Manrope", „Jost"). Ładuj z Google Fonts z `display=swap` + preconnect. Duże, oddychające nagłówki; litera-spacing w nadtytułach (eyebrow) wersalikami.

**Mood / vibe:** botaniczny spokój + klinika premium. Dużo whitespace, miękkie cienie, zaokrąglenia, subtelne ozdobniki roślinne (linie/liście jako SVG), zdjęcia skóry/spa/dłoni/natury. Wrażenie: „zadbam o Ciebie".

## „Wow" / elementy przykuwające uwagę (zrób je ze smakiem, nie kiczowato)
- Mocny **hero** pełnoekranowy: duże zdjęcie (kobieta/skóra/spa) + delikatny overlay zieleni, animowany wjazd nagłówka, dwa CTA („Umów wizytę" → Booksy, „Poznaj ofertę" → #oferta), pasek zaufania (1000+ klientek, lata doświadczenia — bez zmyślania liczby lat: użyj „setki zadowolonych klientek" / „1000+ klientek").
- **Scroll-reveal** sekcji (IntersectionObserver, subtelne fade/slide-up).
- Sticky, kondensujący się header z gładkim smooth-scroll do sekcji + wyraźne CTA.
- **Karty oferty** (5 kategorii) z hoverem (uniesienie, akcent szałwii), ikonami liniowymi.
- Sekcja **„Dlaczego Skin Solutions"** (USP) z ikonami + licznikiem 1000+.
- Sekcja **sprzęt/technologie** (Dermapen 4.0, Secret RF 2.0, Venus Legacy, ICOONE, ZYE) jako „dowód premium".
- **Cennik orientacyjny** „od" (wybrane pozycje, czytelne) + CTA do pełnego cennika/rezerwacji.
- **Cytat założycielki** (Karolina Wrąbel) — sekcja z fotografią/portretem (placeholder) i podpisem.
- Sekcja **opinii** (testimoniale — można użyć ogólnych, autentycznych w tonie; oznaczyć jako przykładowe jeśli treść nie jest cytatem) + odznaka Google/Booksy.
- **Mapa** (osadzony Google Maps iframe na adres Cybernetyki 6/U2) + dane kontaktowe + godziny.
- Końcowe **CTA band** w głębokiej zieleni: „Zapisz się już teraz…".
- Mikrointerakcje: hover na przyciskach, podkreślenia linków, parallax/ken-burns na hero (lekko).

## Struktura sekcji (kolejność)
1. Header (sticky) — logo „Skin Solutions" (tekstowe, serif), nav: Oferta · O nas · Technologie · Cennik · Opinie · Kontakt, CTA „Umów wizytę".
2. Hero.
3. Pasek zaufania / intro „Witamy Cię…".
4. Oferta — 5 kategorii (karty).
5. Dlaczego my / Co nas wyróżnia (USP + 1000+ licznik).
6. Autorskie terapie łączone (wyróżnik sygnaturowy) — opcjonalnie złączone z USP.
7. Technologie / sprzęt premium.
8. Cytat założycielki (Karolina Wrąbel) + zespół (Aleksandra Sadza).
9. Cennik orientacyjny „od".
10. Opinie klientek.
11. Instagram / „Obserwuj nas" (link @skinsolutions.clinic).
12. Kontakt + mapa + godziny + formularz (formularz: mailto lub static; jasna info, że rezerwacja przez Booksy/telefon).
13. CTA band końcowe.
14. Footer — NAP, godziny, social, linki prawne, „© 2026 Skin Solutions".

## Ograniczenia techniczne (TWARDE)
- **Statyczny site**: `index.html` (root), `assets/css/styles.css`, `assets/js/main.js`, `assets/img/`. Bez frameworka, bez build-stepu wymaganego do działania.
- **Ścieżki WZGLĘDNE** (`./assets/...`, `assets/...`) — NIE absolutne (`/assets/...`). Hostujemy jako GitHub Pages projektowy pod `https://pflgroup.github.io/skinsolutions-lp/`.
- **Responsywność**: mobile-first, działa 360px → 1440px+. Hamburger menu na mobile.
- **Dostępność (a11y)**: semantyczne `<header><nav><main><section><footer>`, jeden `<h1>`, logiczna hierarchia nagłówków, `alt` na obrazach, `aria-label` na ikonkach/przyciskach, focus-visible, kontrast AA, `prefers-reduced-motion` wyłącza animacje.
- **Wydajność**: patrz osobny etap (perf). Obrazy z `width`/`height` + `loading="lazy"` (poza hero), `font-display: swap`, brak ciężkich bibliotek (animacje na czystym CSS + IntersectionObserver; GSAP NIEpotrzebny).
- **SEO**: patrz osobny etap (SEO).
- **Język:** `lang="pl"`, polski, poprawne polskie znaki (UTF-8). Diakrytyka bezwzględnie poprawna.

## Obrazy (stockowe — przykładowe)
- Używaj **Unsplash** (licencja darmowa) jako placeholdery tematyczne: skincare, twarz kobiety, dłonie/krem, spa, botanika/zieleń, wnętrze gabinetu.
- Hotlink z CDN `https://images.unsplash.com/photo-...?w=1600&q=80&auto=format&fit=crop` (stabilny). Każdy `<img>` ma sensowny `alt` PL.
- Dodaj w stopce/komentarzu HTML adnotację: „Zdjęcia poglądowe (stock) — do zastąpienia realnymi fotografiami kliniki."
- Hero i sekcje tła: preferuj 1 spójny klimat (ciepła zieleń/beż).
- Logo: tekstowe (serif) — nie wymyślaj graficznego logotypu.

## Czego NIE robić
- Nie zmyślać cen, nazwisk, liczby lat działalności, certyfikatów.
- Nie kopiować 1:1 układu estetic-point — inspiracja TAK, kalka NIE.
- Nie używać ścieżek absolutnych.
- Nie wrzucać sekretów, analytics z realnym ID (GA = placeholder lub pominąć).
- Nie obiecywać efektów medycznych w sposób wprowadzający w błąd (YMYL — ton ekspercki, ostrożny: „pomagamy", „dobieramy", nie „gwarantujemy").

## Definicja sukcesu
Strona wygląda jak premium klinika, ładuje się szybko, jest w pełni responsywna i dostępna, ma poprawne SEO + dane strukturalne LocalBusiness, a główne CTA (Booksy) jest wszędzie widoczne. Kobieta z grupy docelowej myśli: „chcę tam pójść".
