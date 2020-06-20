countdown.js
============

`countdown.js` is a dead-simple command line egg-timer.

Install it with

```bash
npm install -g countdown.js
```

Use it with

```bash
countdown.js 15m
```

Output:

```
$ countdown.js 4s
INFO: Countdown ends at 09:24:51
[##########################################################################] 100%
INFO: Countdown has ended.
```

**Available time strings to count down:** `args[0]` is parsed by [timestring](https://www.npmjs.org/package/timestring), so anything like `1h 15m`, `2 days 4 hours 3 minutes`, `22s` will work (see timestring package for detailed information).

Contributing
------------

**Reports:** Feel free to open an [Issue](https://github.com/dominikschreiber/countdown.js/issues) for any bug you encounter or any feature you'd like. I can't assert that I'll be on it asap, but I'll definitively have a look at it and do my best.

**Pull Requests:** Just fork the repo, implement your awesome stuff, and send me a pull request. I'll love to merge it.

License
-------
Published under a MIT license. See [LICENSE](./LICENSE).
