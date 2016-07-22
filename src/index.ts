import {ACA_WIDGET_COMPONENTS} from './components';
import {ACA_WIDGET_DIRECTIVES} from './directives';
import {ACA_WIDGET_PIPES} from './pipes';
import {ACA_WIDGET_PROVIDERS} from './services';

export * from './components';
export * from './directives';
export * from './services';
export * from './pipes';

export default {
  directives: [ACA_WIDGET_DIRECTIVES],
  pipes: [ACA_WIDGET_PIPES],
  providers: [ACA_WIDGET_PROVIDERS]
}
