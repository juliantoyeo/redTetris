import React from 'react';
import enableHooks from 'jest-react-hooks-shallow';

import { useGameStatus } from '../useGameStatus';

enableHooks(jest);

const callback = jest.fn();

const delay = 1000;

describe('test useGameStatus', () => {
	const setState = jest.fn();

	beforeEach(() => {
		jest.spyOn(React, 'useEffect').mockImplementation(f => f());

		React.useState = jest.fn()
			.mockReturnValueOnce([{
				score: 0,
				rows: 0,
				level: 0
			}, setState])

	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('test useGameStatus with no rowCleared', () => {
		useGameStatus(1);
	});
	test('test useGameStatus with rowCleared', () => {
		useGameStatus(0);
	});
});