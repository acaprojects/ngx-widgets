/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   24/11/2016 3:43 PM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:31 AM
 */

export * from './stepper.component';

import { StepperStep } from './step.component';
import { Stepper } from './stepper.component';

export let STEPPER_COMPONENTS = [
    Stepper, StepperStep,
];
