/**
 * @Author: Alex Sorafumo
 * @Date:   09/12/2016 9:39 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 06/02/2017 11:28 AM
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

// import { COMPONENTS, ENTRY_COMPONENTS } from './components';
// import { DIRECTIVES } from './directives';
// import { PIPES } from './pipes';
// import { SERVICES } from './services';
import { WIDGETS } from './settings';

import 'hammerjs';

    // Components
import { ButtonComponent } from './components/buttons/btn/btn.component';
import { ButtonGroupComponent } from './components/buttons/btn-group/btn-group.component';
import { ButtonToggleComponent } from './components/buttons/btn-toggle/btn-toggle.component';
import { CalendarComponent } from './components/form-controls/calendar/calendar.component';
import { CheckboxComponent } from './components/form-controls/checkbox/checkbox.component';
import { CustomDropdownComponent } from './components/form-controls/custom-dropdown/dropdown.component';
import { DataInputComponent } from './components/form-controls/data-input/data-input.component';
import { DropdownComponent } from './components/form-controls/dropdown/dropdown.component';
import { RadioButtonComponent } from './components/form-controls/radioset/radio-button/radio-button.component';
import { RadiosetComponent } from './components/form-controls/radioset/radioset.component';
import { SliderComponent } from './components/form-controls/slider/slider.component';
import { TimePickerComponent } from './components/form-controls/time-picker/time-picker.component';
import { ToggleComponent } from './components/form-controls/toggle/toggle.component';
import { ImageCropComponent } from './components/img-crop/img-crop.component';
import { InteractiveMapComponent } from './components/interactive-map/map.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { StepperComponent } from './components/page-controls/stepper/stepper.component';
import { StepperStepComponent } from './components/page-controls/stepper/step.component';
import { TabGroupComponent } from './components/page-controls/tab-group/tabs.component';
import { TabHeadComponent } from './components/page-controls/tab-group/tab-head.component';
import { ProgressCircleComponent } from './components/progress-circle/progress-circle.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component';
    // Entry Components
import { CustomDropdownListComponent } from './components/form-controls/custom-dropdown/custom-dropdown-list/dropdown-list.component';
import { DropdownListComponent } from './components/form-controls/dropdown/dropdown-list/dropdown-list.component';
import { MapOverlayComponent } from './components/interactive-map/map-overlay/map-overlay.component';
import { MapOverlayContainerComponent } from './components/interactive-map/map-overlay-container/map-overlay-container.component';
import { MapPinComponent } from './components/interactive-map/overlay-components/map-pin/map-pin.component';
import { MapRangeComponent } from './components/interactive-map/overlay-components/map-range/map-range.component';
import { MapTooltipComponent } from './components/interactive-map/overlay-components/map-tooltip/map-tooltip.component';
import { DynamicBaseComponent } from './components/overlays/dynamic-base.component';
import { OverlayContentComponent } from './components/overlays/contents/overlay-content.component';
import { ModalComponent } from './components/overlays/modal/modal.component';
import { NotificationComponent } from './components/overlays/notification/notification.component';
import { OverlayContainerComponent } from './components/overlays/overlay-container/overlay-container.component';
import { TooltipComponent } from './components/overlays/tooltip/tooltip.component';
    // Directives
import { DropTargetDirective } from './directives/drop-target.directive';
import { FileStreamDirective } from './directives/file-stream.directive';
import { MapInputDirective } from './directives/map-input.directive';
import { TooltipDirective } from './directives/overlays/tooltip.directive';
import { ModalDirective } from './directives/overlays/modal.directive';
import { NotifyDirective } from './directives/overlays/notify.directive';
    // Pipes
import { KeysPipe } from './pipes/keys.pipe';
import { SafeStylePipe } from './pipes/safe-style.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SafePipe } from './pipes/safe.pipe';
    // Services
import { Animate } from './services/animate.service';
import { MapService } from './services/map.service';
import { OverlayService } from './services/overlay.service';
import { DropService } from './services/drop-service/drop-service.service';

// export * from './components';
// export * from './directives';
// export * from './pipes';
// export * from './services';

export class WidgetsHammerConfig extends HammerGestureConfig {
    overrides = {
        'pan':   { direction: 30 },
        'pinch': { enable: true },
    } as any;
}

@NgModule({
    declarations: [
            // Declare Components
        // ...COMPONENTS,
        ButtonComponent,
        ButtonGroupComponent,
        ButtonToggleComponent,
        CalendarComponent,
        CheckboxComponent,
        CustomDropdownComponent,
        DataInputComponent,
        DropdownComponent,
        RadioButtonComponent,
        RadiosetComponent,
        SliderComponent,
        TimePickerComponent,
        ToggleComponent,
        ImageCropComponent,
        InteractiveMapComponent,
        MediaPlayerComponent,
        StepperComponent,
        StepperStepComponent,
        TabGroupComponent,
        TabHeadComponent,
        ProgressCircleComponent,
        SpinnerComponent,
        VirtualKeyboardComponent,
            // Declare Directives
        // ...DIRECTIVES,
        DropTargetDirective,
        FileStreamDirective,
        MapInputDirective,
        TooltipDirective,
        ModalDirective,
        NotifyDirective,
            // Declare Pipes
        // ...PIPES,
        KeysPipe,
        SafePipe,
        SafeStylePipe,
        SafeUrlPipe,
            // Declare Entry Components
        // ...ENTRY_COMPONENTS
        CustomDropdownListComponent,
        DropdownListComponent,
        MapOverlayComponent,
        MapOverlayContainerComponent,
        MapPinComponent,
        MapRangeComponent,
        MapTooltipComponent,
        DynamicBaseComponent,
        OverlayContainerComponent,
        OverlayContentComponent,
        ModalComponent,
        TooltipComponent,
        NotificationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [
            // Export Components
        // ...COMPONENTS,
        ButtonComponent,
        ButtonGroupComponent,
        ButtonToggleComponent,
        CalendarComponent,
        CheckboxComponent,
        CustomDropdownComponent,
        DataInputComponent,
        DropdownComponent,
        RadioButtonComponent,
        RadiosetComponent,
        SliderComponent,
        TimePickerComponent,
        ToggleComponent,
        ImageCropComponent,
        InteractiveMapComponent,
        MediaPlayerComponent,
        StepperComponent,
        StepperStepComponent,
        TabGroupComponent,
        TabHeadComponent,
        ProgressCircleComponent,
        SpinnerComponent,
        VirtualKeyboardComponent,
            // Export Directives
        // ...DIRECTIVES,
        DropTargetDirective,
        FileStreamDirective,
        MapInputDirective,
        TooltipDirective,
        ModalDirective,
        NotifyDirective,
            // Export Pipes
        // ...PIPES,
        KeysPipe,
        SafePipe,
        SafeStylePipe,
        SafeUrlPipe,
            // Export Entry Components
        // ...ENTRY_COMPONENTS
        CustomDropdownListComponent,
        DropdownListComponent,
        MapOverlayComponent,
        MapOverlayContainerComponent,
        MapPinComponent,
        MapRangeComponent,
        MapTooltipComponent,
        DynamicBaseComponent,
        OverlayContainerComponent,
        OverlayContentComponent,
        ModalComponent,
        TooltipComponent,
        NotificationComponent
    ],
    entryComponents: [
            // Declare Entry Components
        // ...ENTRY_COMPONENTS
        CustomDropdownListComponent,
        DropdownListComponent,
        MapOverlayComponent,
        MapOverlayContainerComponent,
        MapPinComponent,
        MapRangeComponent,
        MapTooltipComponent,
        DynamicBaseComponent,
        OverlayContainerComponent,
        OverlayContentComponent,
        ModalComponent,
        TooltipComponent,
        NotificationComponent
    ]
})
export class WidgetsModule {
    private static init = false;
    private version = '0.14.9';
    private build = '2018-01-19.v1';

    constructor() {
        if (!WidgetsModule.init) {
            WidgetsModule.init = true;
            WIDGETS.version(this.version, this.build);
        }
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: WidgetsModule,
            providers: [
                // ...SERVICES
                Animate,
                MapService,
                OverlayService,
                DropService,
                {
                    provide: HAMMER_GESTURE_CONFIG,
                    useClass: WidgetsHammerConfig
                }
            ]
        };
    }
}

export const ACA_WIDGETS_MODULE = WidgetsModule;
