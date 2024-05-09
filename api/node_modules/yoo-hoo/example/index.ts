import { yo } from '../lib/index';
import * as fontFamily from '../lib/fonts/big';
import * as fontFamily2 from '../lib/fonts/ansi-shadow';

yo(process.argv[2] || 'yoo-hoo', {
    color: 'green',
    spacing: 1,
    paddingStart: 5,
});

yo(process.argv[2] || 'ascii * art', {
    fontFamily,
    color: 'rainbow',
});

yo(process.argv[2] || 'alienzhou', {
    fontFamily: fontFamily2,
});
