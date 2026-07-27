import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactPlayer from 'react-player';

const html = renderToString(React.createElement(ReactPlayer, { src: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', playing: true }));
console.log(html);
