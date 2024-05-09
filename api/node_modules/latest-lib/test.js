'use strict';

import test from 'ava';

const m = require('./');

test('success: should return an object with props (name, version, files) of the right type', async t => {
	const f = await m('bootstrap');
	t.is(typeof f, 'object');
	t.is(typeof f.name, 'string');
	t.is(typeof f.version, 'string');
	t.is(typeof f.files, 'object');
	t.is(Array.isArray(f.files), true);
});

test('success: should return the correct name of the library', async t => {
	const f = await m('bootstrap');
	t.is(f.name, 'twitter-bootstrap');
});

test('success: should return the correct major version when specified', async t => {
	const f = await m('bootstrap@3');
	t.is(f.version, '3.3.7');
	// Resource URLs should also include the correct version number
	t.true(f.files[0].indexOf('3.3.7') > -1);
});

test('failure: should return an error object', async t => {
	await m()
	.catch(err => {
		t.is(typeof err, 'object');
	});
});
