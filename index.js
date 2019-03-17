/* eslint-disable no-console */
const Discord = require('discord.js')
const axios = require('axios')
const moment = require('moment')

// Read .env config and write it to process.env
require('dotenv').config()

// Login to Discord
const client = new Discord.Client()
client.login(process.env.TOKEN)

client.on('ready', () => {
	const bumpChannel = client.guilds.find(g => g.id === process.env.GUILD_ID).channels.find(ch => ch.id === process.env.BUMP_CHANNEL_ID)
	work(bumpChannel)
})

function work(bumpChannel) {
	const randomTime = Math.floor(Math.random() * (120 - 15 + 1))

	axios({
		method: 'get',
		url: `https://discord-server.com/${process.env.GUILD_ID}/bump-form`,
		responceType: 'json',
		headers: {
			cookie: process.env.COOKIE,
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.99 YaBrowser/19.1.0.2644 Yowser/2.5 Safari/537.36'
		}
	}).then(res => {
		if(!res.data.ok) {
			const date = moment(res.data.message.substring(38), 'HH:mm:ss')
			const hours = date.hours()
			const minutes = date.minutes()
			const seconds = date.seconds()
            
			const totalTime = (((minutes + (hours * 60)) * 60) + seconds) * 1000

			console.log('Bump will be sent in ' + moment().add(totalTime + (randomTime * 1000), 'milliseconds').toString())
			setTimeout(() => {
				bumpChannel.send('!bump')
				sleep(randomTime * 1000)
				work(bumpChannel)
			}, totalTime)
		} else {
			bumpChannel.send('!bump')
			sleep(randomTime * 1000)
			work(bumpChannel)
		}
	})
}

function sleep(ms) {
	ms += new Date().getTime()
	while (new Date() < ms){ 
		// nothing
	}
}