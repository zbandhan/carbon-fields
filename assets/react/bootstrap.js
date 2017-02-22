/**
 * The external dependencies.
 */
import 'babel-polyfill';
import _ from 'lodash';

/**
 * The internal dependencies.
 */
import {
	registerContainerComponent,
	registerFieldComponent,
	registerSaga,
	getSagas,
	registerFieldValidator
} from 'lib/registry';

import { autoload } from 'lib/helpers';

import configureStore from 'store';
import { normalizePreloadedState } from 'store/helpers';

import containerFactory from 'containers/factory';
import { getContainers } from 'containers/selectors';

/**
 * Put Lodash in `noConflict` mode to avoid conflicts with Underscore lib
 * loaded by WordPress.
 */
_.noConflict();

/**
 * Register the core components.
 */
autoload(require.context('./containers/components', true, /index\.js$/), (path, file) => {
	const { type } = file.default;

	if (!_.isEmpty(type)) {
		registerContainerComponent(type, file.default);
	}
});

autoload(require.context('./fields/components', true, /index\.js$/), (path, file) => {
	const { type } = file.default;

	if (!_.isEmpty(type)) {
		type.forEach(type => registerFieldComponent(type, file.default));
	}
});

autoload(require.context('./fields/validators', true, /\.js$/), (path, file) => {
	registerFieldValidator(file.type, file);
});

autoload(require.context('./', true, /sagas\/.+\.js$/), (path, file) => {
	registerSaga(file.default);
});

/**
 * Abracadabra! Poof! Containers everywhere ...
 *
 * @return {void}
 */
export default function() {
	/**
	 * Setup the store.
	 */
	const state = normalizePreloadedState(window.carbon_json);
	const sagas = getSagas();
	const store = configureStore(state, sagas);

	/**
	 * Every Carbon container will be treated as separate React application because
	 * we don't want to modify the core behaviour/markup of the WordPress's admin area.
	 * Although the store will be shared between the applications.
	 */
	_.forEach(getContainers(store.getState()), ({ id, type }) => containerFactory(store, type, { id }));
}
