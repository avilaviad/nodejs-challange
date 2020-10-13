const tape = require('tape')
const bent = require('bent')
const getPort = require('get-port')

const server = require('../')
const nock = require('nock')

const getJSON = bent('json')
const getBuffer = bent('buffer')


// Use `nock` to prevent live calls to remote services
nock('https://nodejs.org')
	.persist()
	.get('/dist/index.json')
	.reply(200, require('./data.json'))

const context = {}


tape('setup', async function (t) {
	const port = await getPort()
	context.server = server.listen(port)
	context.origin = `http://localhost:${port}`

	t.end()
})

tape('should get dependencies', async function (t) {
	const html = (await getBuffer(`${context.origin}/dependencies`)).toString()

	t.match(html, /bent/g, 'should contain bent')
	t.match(html, /express/g, 'should contain express')
	t.match(html, /hbs/g, 'should contain hbs')
})

tape('should get minimum secure versions', async function (t) {
	const versions = await getJSON(`${context.origin}/minimum-secure`)

	t.equal(versions['v0'].version, 'v0.12.17', 'v0 should match')
	t.equal(versions['v4'].version, 'v4.9.0', 'v4 should match')
})

tape('should get latest-releases', async function (t) {
	const versions = await getJSON(`${context.origin}/latest-releases`)

	t.equal(versions['v14'].version, 'v14.13.1', 'v14 should match')
	t.equal(versions['v13'].version, 'v13.14.0', 'v13 should match')
})

tape('teardown', function (t) {
	context.server.close()
	t.end()
})
