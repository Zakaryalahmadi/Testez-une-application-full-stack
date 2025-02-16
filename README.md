# 🧘 Yoga Studio - API et Frontend

Plateforme de gestion des sessions de yoga, avec authentification et inscription aux cours.

---

## 📌 Prérequis

Avant de commencer, assurez-vous d’avoir installé :

### Backend :
- Java 17+
- Maven
- MySQL (en production, H2 pour les tests)

### Frontend :
- Node.js
- Angular CLI


---

## 🚀 Installation et Configuration

Le projet est configuré pour utiliser **H2** en mémoire pour les tests **end-to-end**. Pour la production, **MySQL** est utilisé. Voici les configurations selon l'environnement :

#### Pour la production (MySQL)

```
CREATE DATABASE test;
```
# Installation du Backend et du Frontend

## 🛠 Installation du Backend

### Cloner le projet :
Démarrer le backend en mode développement :

`./mvnw spring-boot:run
`
`
### Démarrer le backend en mode test :
Pour utiliser l'environnement de test H2 (utilisé pour les tests E2E), lancez le backend avec le profil test :

`
./mvnw clean spring-boot:run -Dspring-boot.run.profiles=test
`


# 🎨 Installation du Frontend

## Accéder au dossier frontend :
Tout d'abord, accédez au répertoire du frontend dans votre terminal :

```
cd frontend
```

### Installer les dépendances :

`npm start`
Accéder au site :

`http://localhost:4200`

# 🧪 Tests et Couverture

## ✅ Tests Backend
Exécuter les tests unitaires et d’intégration :

`./mvnw test`



### Générer le rapport de couverture avec JaCoCo :
`mvn jacoco:report`


# ✅ Tests Frontend

## Exécuter les tests unitaires :
`npm run test`

## Lancer les tests en mode surveillance :
`npm run test:watch`

## Analyser la qualité du code :
`npm run lint`

# ✅ Tests End-to-End
## Lancer les tests E2E avec Cypress (avec H2 en mémoire) :
`npm run cypress:open`


## Exécuter les tests E2E en mode CI :
`npm run e2e:ci`

## Générer un rapport de couverture des tests E2E :

`npm run e2e:coverage`

