Nodebin
=======

A simple development server to test ideas, like jsbin but with node powers.

It features an ecstatic server that publish the `/public` dir.

Browserify is watching the `/application.js` creating a `bundle.js` so you can
use node modules in the frontend.

Everything have live reload so you can try different ideas faster.

To ease the export, the public folder is not served directly, instead it is
first copied to the `build` directory.

How to use?
-----------

Check the sample folder to get an idea, but all you need is:

```
build/          ---> created automaticaly
public/         ---> your files copied as is
application.js  ---> entry point for browserify
server.js       ---> server code
```

The server code is really short:

```javascript
var server = require('nodebin')

server.listen()
```

License
-------

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
