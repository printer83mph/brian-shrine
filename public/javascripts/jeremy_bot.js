const {NlpManager, ConversationContext, SentimentManager} = require('node-nlp');
const model = require('../data/jeremy.json');

class JeremyBot {

	static goodbye() {
		window.location.replace('https://www.wikifeet.com/Michelle_Obama');
	}

	constructor(name) {
		this.manager = new NlpManager({languages: ['en']});
		this.sentiment = new SentimentManager();
		this.context = new ConversationContext({language: 'en'});

		this.manager.import(model);

		this.moodNum = 0.5;
		this.name = name;
		this.display = document.getElementById('jeremyPhoto');
		this.moods = ['nightmare', 'miffed', 'confused', 'base', 'cheery', 'kawaii'];
		
		// Put name in context
		this.send(`My name is ${name}`);

		// Dev?
		this.dev = false;
	}

	send(msg) {
		// Algorithm to get response and update mood
		// not yet built
		if (this.dev) console.log(typeof msg);

		this.manager.process('en', msg, this.context)
			.then(result => {
				if (this.dev) console.log(result);
				let message = result.answer;

				this.sentiment
					.process('en', msg)
					.then(result => this.updateMood(result))
					.catch(error => console.log(error));
				this.onchatmessage(message);

				if (result.intent === 'greetings.bye') {
					JeremyBot.goodbye();
				}
			})
			.catch(error => console.log(error));
	}

	updateMood(sentiment) {
		this.moodNum += (sentiment.score * (1 - this.moodNum));
		// Cap moodNum in case calculation fails
		this.moodNum = (this.moodNum > 1) ? 1 : this.moodNum;
		this.moodNum = (this.moodNum < 0) ? 0 : this.moodNum;

		if (this.dev) console.log(sentiment);
		if (this.dev) console.log(this.moodNum);
		let mood = this.moods[Math.round(this.moodNum * (this.moods.length - 1))];

		this.display.src = `/images/jeremy/${mood}.png`
	}
}

module.exports = JeremyBot;