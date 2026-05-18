<img width="968" height="968" alt="logo" src="https://github.com/user-attachments/assets/906c693d-aa21-4278-a958-c9b53f9825e6" />

MEETR – Mobile Social Event Planner

Moderná mobilná sociálna aplikácia na vytváranie eventov, spájanie ľudí a realtime komunikáciu.

________________________________________

1.	Stručný popis projektu

MEETR je mobilná aplikácia vytvorená pomocou React Native a Expo frameworku, ktorá umožňuje používateľom:

-	vytvárať udalosti,
-	pripájať sa na eventy ostatných používateľov,
-	komunikovať cez realtime chat,
-	pridávať si priateľov,

-	zobrazovať eventy priateľov,
-	budovať jednoduchú sociálnu sieť.
Projekt bol vytvorený so zameraním na:
-	mobilný frontend,
-	realtime databázu,
-	moderný UI/UX dizajn,
-	cloud backend,
-	autentifikáciu používateľov.
________________________________________

2. Hlavné funkcionality

Používateľský systém
-	registrácia používateľov,
-	login/logout,
-	používateľské profily,
-	profilové fotografie,
-	bio používateľa.
________________________________________

Event systém

-	vytváranie eventov,
-	názov, popis, dátum a čas eventu,
-	event fotografia,
-	zobrazenie autora eventu,
-	počet účastníkov,
-	join / leave event.
________________________________________

Sociálne funkcionality

-	friend requests,
-	accept / decline requests,
-	friends list,
-	zobrazenie eventov priateľov,
-	otvorenie eventu cez profil priateľa.
________________________________________

Event Chat

-	realtime chat ku každému eventu,
-	chat len pre účastníkov eventu,
-	profilové fotografie v chate,
-	messenger-style dizajn,
-	automatický scroll správ,
-	odosielanie správ cez klávesnicu.
________________________________________

UI/UX

-	moderný redesign aplikácie,
-	custom branding pomocou MEETR loga,
-	moderné event cards,
-	responzívny layout,
-	modern chat bubbles,
-	custom bottom navigation,
-	keyboard fixes.
________________________________________

3. Použité technológie

Frontend
-	React Native
-	Expo
-	JavaScript
-	React Navigation
-	Expo Image Picker
________________________________________

Backend a databáza

-	Firebase Authentication
-	Firebase Firestore
________________________________________

UI knižnice

-	React Native Gesture Handler
-	React Native Reanimated
-	Expo Vector Icons
________________________________________

Vývojové nástroje

-	Visual Studio Code
-	Git
-	GitHub
-	Expo Go
________________________________________

4. Návod na spustenie projektu

Požiadavky

Pred spustením projektu je potrebné mať nainštalované:

-	Node.js
-	npm
-	Expo CLI
-	Expo Go aplikáciu v mobile
-	Firebase projekt
________________________________________

Inštalácia projektu

Naklonovanie repozitára

git clone <repository-url>

cd event-planner-app
________________________________________

Inštalácia dependencies

npm install

npm install @react-navigation/bottom-tabs

npm install @react-navigation/drawer

React Native dependencies

npm install react-native-screens

npm install react-native-safe-area-context

npm install react-native-gesture-handler

npm install react-native-reanimated

npm install expo-image-picker

npx expo install expo-image-picker

npm install @expo/vector-icons

npm install --save-dev babel-preset-expo

________________________________________

Babel konfigurácia

V koreňovom adresári projektu sa nachádza:

babel.config.js

Obsah:

module.exports = function(api){

  api.cache(true);

  return {
  
    presets: ["babel-preset-expo"],

    plugins: ["react-native-reanimated/plugin"],
    
  };
  
};
________________________________________

Spustenie projektu

Vyčistenie cache:

npx expo start -c

Následne:

-	naskenovať QR kód pomocou Expo Go,
  
-	alebo spustiť Android/iOS emulátor.
________________________________________

5. Firebase konfigurácia

Projekt používa:

-	Firebase Authentication,
-	Firebase Firestore Database.

Je potrebné:

1.	vytvoriť Firebase projekt,
   
2.	povoliť Authentication (Email/Password),
   
3.	vytvoriť Firestore Database,
   
4.	vložiť Firebase config do:
   
firebaseConfig.js

Príklad:

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",
  
  authDomain: "YOUR_DOMAIN",
  
  projectId: "YOUR_PROJECT_ID",
  
  storageBucket: "YOUR_BUCKET",
  
  messagingSenderId: "YOUR_SENDER_ID",
  
  appId: "YOUR_APP_ID",
  
};

________________________________________

6. Reflexia využitia LLM nástrojov

Pri vývoji projektu boli využitý ChatGPT v platenej verzii.

________________________________________

Oblasti využitia LLM

Vývoj frontend funkcionalít
LLM nástroje boli použité pri:
-	návrhu architektúry aplikácie,
-	implementácii React Native komponentov,
-	návrhu navigácie,
-	implementácii realtime chatu,
-	implementácii Firebase logiky,
-	refaktoringu UI komponentov.
  
________________________________________

UI/UX návrh

Pomocou LLM boli navrhnuté:
-	moderné event cards,
-	messenger-style chat,
-	layout profilov,
-	bottom tab navigation,
-	farebná schéma aplikácie.
________________________________________

Debugging a riešenie problémov

LLM boli použité pri:
-	riešení navigation problémov,
-	opravách React Native chýb,
-	Firebase debuggingu,
-	keyboard handling problémoch,
-	state management problémoch.
________________________________________

Dokumentácia

LLM pomohli aj pri:
-	tvorbe README dokumentácie,
-	štruktúrovaní technickej dokumentácie
________________________________________

Prínosy využitia LLM

Zvýšenie produktivity
LLM výrazne zrýchlili vývoj aplikácie a umožnili rýchlejšie implementovať nové funkcionality.
________________________________________

Učenie nových technológií

Pri práci s LLM sme sa naučili:
-	React Navigation,
-	Firebase realtime funkcionalitu,
-	keyboard handling v React Native,
-	moderné UI patterns,
-	prácu s Expo Image Picker.
________________________________________

Lepší debugging

LLM pomáhali identifikovať chyby a navrhovať možné riešenia.
________________________________________

Limity a nevýhody

Občasné nesprávne návrhy
Niektoré návrhy bolo potrebné manuálne upravovať alebo refaktorovať.
________________________________________

Nutnosť kontroly výstupu

Generovaný kód bolo potrebné:
-	testovať,
-	upravovať,
-	prispôsobovať architektúre projektu.
________________________________________

Kompatibilita knižníc

Pri React Native sa niektoré AI návrhy líšili podľa verzií knižníc a Expo SDK.
________________________________________

Vlastné zhodnotenie

Práca s LLM nástrojmi bola veľmi prínosná. Počas projektu sme si osvojili nové postupy pri vývoji mobilných aplikácií a naučili sa efektívnejšie pracovať s modernými AI asistovanými nástrojmi.
Najväčším prínosom bola možnosť:
-	rýchlejšie experimentovať,
-	jednoduchšie debugovať chyby,
-	navrhovať modernejší UI dizajn,
-	efektívnejšie implementovať funkcionality.
Zároveň sme si uvedomili, že AI nenahrádza programátora, ale funguje ako podporný nástroj, ktorý vyžaduje kontrolu, testovanie a pochopenie generovaného kódu.
________________________________________

7. Budúce rozšírenia projektu

Možné budúce funkcionality:
-	push notifications,
-	dark mode,
-	Google Maps integrácia,
-	event categories,
-	QR invites,
-	online status používateľov,
-	typing indicators,
-	Firebase Storage pre cloud upload fotografií,
-	animácie a transitions.
________________________________________

8. Autori projektu

Semester projekt vytvorený v rámci predmetu mobilné systémy a sociálne siete.

Autori:

Tomáš Klukay

Adrian Kopányi
