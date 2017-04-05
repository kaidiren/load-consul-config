# usage



```javascript
const config = require('config');
const path = 'app/default';

const loadConsulConfig = require('load-consul-config');
loadConsulConfig({ config: config, path: path, warning: false});

console.log(config);
```

# waring
1. only support json format
2. if current config has no consul config ingnored
3. no path or config ignored
4. get from consul server error or no data or the data is not a  json format ignored
5. other questions just have a look at the code. 😀
