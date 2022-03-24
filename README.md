# Formation Développeur Web - OpenClassrooms
**Projet 7 : "Créez un réseau social d’entreprise"**

**Compétences évaluées**
- Authentifier un utilisateur et maintenir sa session
- Personnaliser le contenu envoyé à un client web
- Gérer un stockage de données à l'aide de SQL
- Implémenter un stockage de données sécurisé en utilisant SQL

## Démarrage du projet :

### 1. Entrez dans la ligne de commandes et cloner le projet avec la commande : 

`$ git clone https://github.com/belkacem-yacine/Groupomania.git`

### 2. Entrez dans le fichier config.js (backend > config > db.config.js) et configurez les entrées suivantes de l'objet "module.exports" selon les paramètres de votre base de données :

- "USER"
- "PASSWORD"
- "DB"

### 3. Démarrez le backend :

- Ouvrez le terminal de votre éditeur de code et placez-vous dans le dossier backend : 

`cd backend`

- Installez les dépendances du projet :

`npm install`

- Lancez le backend :

`nodemon server`

### 4. Démarrez le frontend :

- Ouvrez un nouveau terminal de votre éditeur de code et placez-vous dans le dossier frontend : 

`cd frontend`

- Installez les dépendances du projet :

`npm install`

- Lancez le frontend :

`npm run serve`

- Allez à l'adresse : 

`http://localhost:8080/`

## Utilisation : 

### 1. Création du compte :

L'adresse e-mail doit être valide et vous ne pouvez pas l'utiliser pour 2 comptes différentes.

Il y a 2 types de compte : employé et administrateur. Ce deuxième possède les droits d'administrateur et peut supprimer les publications et commentaires des autres utilisateurs. Afin de créer un compte en tant qu'administrateur, indiquez que vous êtes administrateur et renseignez le mot de passe suivant dans l'entrée 'Mot de passe administrateur' : 

`MdpAdmin`

### 2. Connexion :

Votre compte sera bloqué pour 1 minutes après 5 tentatives de connexion. 

### 3. Fonctionnalités : 

Vous pouvez modifier votre profil ou le désactiver depuis l'onglet 'profil'. Pour aller à cet onglet cliquez sur votre nom et prenom ou sur votre photo de profil dans le Navlink.

Vous pouvez publier, modifier et supprimer les publications contenant des images ou sans images. Chaque publication peut être commentée. 

Vous pouvez vous déconnecter depuis le menu.

## Spécifications de l’API

Base URL : `http://localhost:3000/api/`

Aucune entrée de la base de donnés ne peut pas être nulle.

### USER `/auth`

{ id : integer, lastName : string, firstName : string, email : string, password : string, image_url : string, admin : boolean, enabled : boolean, createdAt : datetime, updatedAt : datetime }

![USER_API](https://user-images.githubusercontent.com/82067897/159576445-ed310872-1181-4f70-a4fb-2d98eb3ef0ec.png)

### PUBLICATION `/post`

{ id : integer, post : string, image_url : string, userId : integer, createdAt : datetime, updatedAt : datetime }

![POST_API](https://user-images.githubusercontent.com/82067897/159576478-975ab478-80d5-483e-8c7a-dcf3340bb72c.png)

### COMMENT `/comment`

{ id : integer, comment : string, enabled : boolean, postId : integer, userId : integer, createdAt : datetime, updatedAt : datetime }

![COMMENT_API](https://user-images.githubusercontent.com/82067897/159576493-65fae6e9-258b-49c9-98d6-cee2ea9c1973.png)
