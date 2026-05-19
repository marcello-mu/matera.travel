# Sito provvisorio con effetto Ken Burns - Matera

Questo pacchetto contiene una pagina statica HTML/CSS/JS con fotografie di Matera caricate da Pexels in sequenza, effetto Ken Burns, testo in sovrimpressione e credits cliccabili.

## File principali

- `index.html`: contiene le slide e i credits delle fotografie.
- `privacy.html`: contiene l'informativa privacy e cookie.
- `style.css`: gestisce layout, overlay, tipografia, effetto Ken Burns e credits.
- `script.js`: alterna le fotografie e aggiorna il credit in basso.
- `images/`: contiene ancora i placeholder SVG del pacchetto iniziale; non sono usati dall'index aggiornato.

## Come modificare titolo e testo

Apri `index.html` e modifica questa sezione:

```html
<p class="eyebrow">Matera</p>
<h1>Il tuo titolo qui</h1>
<p class="subtitle">Una frase breve in sovrimpressione sulle fotografie.</p>
```

## Come modificare durata delle slide

Apri `script.js` e cambia questo valore:

```js
const slideDurationMs = 6000;
```

6000 equivale a 6 secondi.

## Cookie, privacy e Google Analytics

Il sito carica Google Analytics 4 con ID `G-7WE1NRHQP3` solo dopo consenso ai cookie analitici. La preferenza viene salvata in `localStorage` con chiave `materaTravelCookieConsent`; questo storage serve solo a ricordare la scelta dell'utente e scade dopo 180 giorni.

Prima della pubblicazione definitiva:

- sostituisci in `privacy.html` i placeholder del titolare, dell'indirizzo e dell'email privacy;
- verifica le impostazioni di Google Analytics: Google Signals e personalizzazione annunci disattivati, conservazione dati impostata a 2 mesi o al minimo necessario, contratto sul trattamento dati accettato;
- mantieni nell'informativa l'avviso sulle immagini Pexels, che sono caricate come risorsa di terza parte.

## Licenza foto

Le fotografie sono caricate da Pexels. La licenza Pexels consente uso gratuito e modifiche; l'attribuzione non e obbligatoria, ma in questo template e stata mantenuta nei credits.

Verifica sempre la licenza sulle pagine Pexels prima della pubblicazione definitiva.
