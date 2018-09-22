const source = `
h4 Требования
ul
  li Опыт разработки на JavaScript, знание Node.js;
  li Опыт разработки серверных приложений в среде Unix на каком-либо языке (Node.js, Python, Ruby, PhP);
  li Понимание принципов построения масштабируемых систем, основные проблемы, пути решения.

h4 Условия
ul
  li Бонусы и премии за результат;
  li Ресурсы на реализацию идей, идущих на пользу сервису;
  li  Работа по гибкому графику недалеко от метро;
  li Цветной бульвар;
  li ДМС.

h4 Вознаграждение
p
  | 100 000 — 250 000 рублей.
  br
  | Готовы рассмотреть специалистов от junior до senior.

h4 Требования
ul
  li Опыт разработки на JavaScript, знание Node.js;
  li Опыт разработки серверных приложений в среде Unix на каком-либо языке (Node.js, Python, Ruby, PhP);
  li Понимание принципов построения масштабируемых систем, основные проблемы, пути решения.

h4 Условия
ul
  li Бонусы и премии за результат;
  li Ресурсы на реализацию идей, идущих на пользу сервису;
  li  Работа по гибкому графику недалеко от метро;
  li Цветной бульвар;
  li ДМС.

h4 Вознаграждение
p
  | 100 000 — 250 000 рублей.
  br
  | Готовы рассмотреть специалистов от junior до senior.
  `;


const jade = require('jade');

const fn = jade.compile(source);

console.log(fn());

console.log(source);
