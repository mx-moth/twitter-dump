var optimist = require('optimist');
var http = require('http');
var qs = require('querystring');

var argv = optimist
	.usage('Usage: $0 user-name')
	.demand(1)
	.argv;

var user = argv._[0];

var allTweets = [];

var getTweets = function(options, callback) {

	var sortedOptions = Object.keys(options).sort().reduce(function(obj, key) {
		obj[key] = options[key];
	});

	var path = '/1/statuses/user_timeline.json?' + qs.stringify(sortedOptions)

	var options = {
		host: 'api.twitter.com',
		port: 80,
		path: ,
	};

	var req = http.get(options, function(res) {
		var chunks = [];
		res.setEncoding('utf8');
		res.on('data', chunks.push.bind(chunks));
		res.on('end', function() {
			var body = chunks.join('');
			if (res.statusCode != 200) return callback(new Error('Error from twitter: ' + res.statusCode + "\n" + body, res));

			try {
				var data = JSON.parse(body);
				callback(null, data);
			} catch(err) {
				callback(err);
			}
		});


	}).on('error', callback);
}

var gotTweets = function(err, tweets) {
	if (err) throw err;
	allTweets = allTweets.concat(tweets);

	if (tweets.length == 0) {
		finished(tweets);
	} else {
		getTweets({
			user_name: user,
			max_id: tweets[tweets.length - 1].id,
		}, gotTweets)
	}
}
var finished = function(tweets) {
	console.log(JSON.stringify(tweets, null, true));
};

getTweets({user_name: user}, gotTweets);
