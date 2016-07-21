import {ACA_COMPOSER_DIRECTIVES} from './directives';
import {ACA_COMPOSER_PIPES} from './pipes';
import {ACA_COMPOSER_PROVIDERS} from './services';

export * from './directives';
export * from './services';
export * from './pipes';

export default {
  directives: [ACA_COMPOSER_DIRECTIVES],
  pipes: [ACA_COMPOSER_PIPES],
  providers: [ACA_COMPOSER_PROVIDERS]
}
