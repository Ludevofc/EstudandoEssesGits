# FlOBA

![image](http://ludumdare.com/compo/wp-content/compo2//511439/7339-shot0-1450060404.png-eq-900-500.jpg)

A multiplayer Javascript game where you draft abilities against another player to attempt to hinder their growth, while boosting yours. First to the goal wins.

The websockets server uses node.js, like my previous two multiplayer entries. One notable change from my last multiplayer game is that this uses a synchronised command stream model, unlike Snoverchill which ran asynchronously.

The game is incomplete, though it's technical design is still of some interest. It's quite weird setting up things that are meant to follow "interfaces" in ES5, so there's an interesting approach to the structure of the project.

Ludum Dare page:
http://ludumdare.com/compo/ludum-dare-34/?action=preview&uid=7339