import React from 'react';
import { mount, shallow } from 'enzyme';
import App from '../app';
import { createMemoryHistory } from 'history'
import * as server from '../../actions/server';
import MockedSocket from 'socket.io-mock';


let socket = new MockedSocket();
socket.emit = jest.fn();

// eslint-disable-next-line no-import-assign
server.initiateSocket = jest.fn();
// import { MemoryRouter, HashRouter } from 'react-router';


const reactRouter = require('react-router-dom');
const { MemoryRouter } = reactRouter;
const history = createMemoryHistory({ initialEntries: [{ pathname: '/', key: 'testKey' }] })
const MockBrowserRouter = ({ children }) => (
	<MemoryRouter history={history} initialEntries={[{ pathname: '/', key: 'testKey' }]}>
		{children}
	</MemoryRouter>
);
reactRouter.HashRouter = MockBrowserRouter;

// const rrd = require('react-router-dom');
// Just render plain div with its children
// eslint-disable-next-line react/display-name
// rrd.HashRouter = ({children}) => <div>{children}</div>
// rrd.HashRouter.props = {initialEntries: [ { pathname: '/', key: 'testKey' } ]}

// const renderWithRouter = (component) => {
// 	return shallow(
// 		<MemoryRouter initialEntries={[{ pathname: '/', key: 'testKey' }]}>
// 			{component}
// 		</MemoryRouter>
// 	)
// }

describe('Test App component', () => {
	beforeEach(() => {

		jest.spyOn(React, 'useEffect').mockImplementation(f => f());

		React.useState = jest.fn()
			.mockReturnValueOnce([socket, () => {}])

	});
	it('Should render properly', () => {
		// const wrapper = shallow(<App/>)
		// const wrapper = shallow(
		// 	<MemoryRouter initialEntries={[ { pathname: '/', key: 'testKey' } ]}>
		// 		<App />
		// 	</MemoryRouter>
		// );
		const wrapper = shallow(<App />);
		// const router = wrapper.find(MockBrowserRouter);
		// router.props = { history: 'test'};
		// router.prop('history') = 'test';

		// const component = wrapper.find(HashRouter);
		// console.log(component);
		// expect(toJson(wrapped)).toMatchSnapshot();
		// const wrapper = shallow(<App />, {
		// 	wrappingComponent: MemoryRouter,
		// 	wrappingComponentProps: { initialEntries: [{ pathname: '/', key: 'testKey' }] }
		// });
		// const wrapper = renderWithRouter(<App/>);
		// wrapper.options.wrappingComponent = <MemoryRouter initialEntries={[ { pathname: '/', key: 'testKey' } ]}></MemoryRouter>;
		// const provider = wrapper.getWrappingComponent();
		// provider.setProps({ initialEntries: [ { pathname: '/', key: 'testKey' } ] });
		// expect(wrapper).toMatchSnapshot();
		expect(wrapper.exists()).toBe(true);
	});
	it('Should render run setSocket', () => {
		React.useState = jest.fn()
			.mockReturnValueOnce([null, () => {}])

		shallow(<App />);
	});

});