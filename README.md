# pass-culture-shared

Tous les objets javascript partagés entre l'application découverte et l'application pro.
Cependant, ce repo est voué à disparaître car les différentes fonctionnalités sont en train d'être
exportées dans des librairies npm indépendantes hostés sur betagouv, voir:

- [la-sass-vy](https://github.com/betagouv/la-sass-vy)
- [normalized-data-state](https://github.com/betagouv/normalized-data-state)
- [react-final-form-utils](https://github.com/betagouv/react-final-form-utils)
- [react-loading-infinite-scroller](https://github.com/betagouv/react-loading-infinite-scroller)
- [redux-react-modals](https://github.com/betagouv/redux-react-modals)
- [redux-thunk-data](https://github.com/betagouv/redux-thunk-data)
- [with-login](https://github.com/betagouv/with-login)
- [with-query-router](https://github.com/betagouv/with-query-router)

NB1: la librairie de Form, Field à l'intérieur de shared est vouée aussi à disparaître, car on utilise react-final-form désormais.

NB2: tout ce qui est style et layout components (comme Icon, Spinner...) de shared sont aussi voués à disparaître car recodés directement dans les apps ou internalisés dans les librairies mentionnées au dessus.
