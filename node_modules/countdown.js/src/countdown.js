var cli = require('cli')
  , timestring = require('timestring')
  , Timer = require('timer.js');

cli.parse({});

cli.main(function(args, options) {
    var parsed = {}, end;

    cli.setUsage('countdown.js <time> (i.e. `countdown.js 1h12m`)');
    if (args.length !== 1) { cli.fatal(cli.getUsage()); }

    parsed.time = args[0].parseTime();
    end = new Date(Date.now() + parsed.time * 1000);

    new Timer({
            tick: .5,
            onstart: function() { cli.info('Countdown ends at ' + end.toLocaleTimeString()); },
            ontick: function(sec) { cli.progress((parsed.time - sec) / parsed.time); },
            onend: function() { cli.info('Countdown has ended.\u0007'); }
        }).start(parsed.time);
});
