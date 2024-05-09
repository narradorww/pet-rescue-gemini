'use strict';

const urlResolve = require('url').resolve;
const got = require('got');

module.exports = (name, opts) => {
	return new Promise((resolve, reject) => {
		let desiredMajor = null;

		if (!name) {
			return reject(new Error(`Please specify the name of the library`));
		}

		if (name.indexOf('@') > -1) {
			[name, desiredMajor] = name.split('@');
		}

		got(`https://api.cdnjs.com/libraries?search=${name}&fields=version,assets`, {json: true})
		.then(res => {
			if (res.body.results.length > 0) {
				// Return only the first result
				const library = res.body.results[0];
				const versionAssets = library.assets.filter(files => {
					if (desiredMajor) {
						return new RegExp(`^${desiredMajor}`).test(files.version) === true;
					}

					return files.version === library.version;
				});

				if (!versionAssets[0]) {
					return reject(new Error(`Specified release version for ${library.name} does not exist`));
				}

				// Return only the latest version
				let files = versionAssets[0].files.map(item => urlResolve(
					`https://cdnjs.cloudflare.com/ajax/libs/${library.name}/${versionAssets[0].version}/`,
					item)
				);

				if (opts && opts.only) {
					switch (opts.only) {
						case 'css':
							files = files.filter(item => /\.css$/.test(item) === true);
							break;
						case 'js' :
							files = files.filter(item => /\.js$/.test(item) === true);
							break;
						default: break;
					}
				}

				return resolve({
					name: library.name,
					version: versionAssets[0].version,
					files
				});
			}

			return reject(new Error(`Cannot find any library named ${name}`));
		}).catch(err => reject(new Error(err)));
	});
};
