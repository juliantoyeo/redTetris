import React from 'react';
import enableHooks from 'jest-react-hooks-shallow';

import { useInterval } from '../useInterval';

enableHooks(jest);

const callback = jest.fn();

const delay = 1000;

describe('test useInterval', () => {

	beforeEach(() => {
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());
		jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });

	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('test useInterval with delay', () => {
		useInterval(callback, delay);
	});
	test('test useInterval with delay null', () => {
		useInterval(callback, null);
	});
});