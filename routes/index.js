const express = require('express');
const router = express.Router();
const bent = require('bent')
const getJSON = bent('json')
const semver = require('semver')

router.get('/dependencies', function(req, res, next) {
	var package = require('../package.json')
	res.render('dependencies', { dependencies: package.dependencies })
})

router.get('/minimum-secure', async function(req, res, next) {
	let versions = await getJSON('https://nodejs.org/dist/index.json')
	let securedVersions = 
		versions
			.filter(v => v.security)
			.reduce((acc, item) => {
				let majorVer = 'v' + semver.major(item.version)
				if (!acc[majorVer]) {
					acc[majorVer] = item;
				} else if (semver.gt(item.version, acc[majorVer].version)) {
					acc[majorVer] = item;
				}

				return acc;
			}, {})
	res.json(securedVersions)
})

router.get('/latest-releases', async function(req, res, next) {
	let versions = await getJSON('https://nodejs.org/dist/index.json')
	let latestVersions = 
		versions.reduce((acc, item) => {
			let majorVer = 'v' + semver.major(item.version)
			if (!acc[majorVer]) {
				acc[majorVer] = item;
			} else if (new Date(item.date) > new Date(acc[majorVer].date)) {
				acc[majorVer] = item;
			}

			return acc;
		}, {})
	
	res.json(latestVersions)
})

module.exports = router;


