/**
* @Author: Alex Sorafumo
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: type.builder.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:38 AM
*/

import {Component, NgModule, Input, Injectable, ViewChild, ElementRef } from '@angular/core';

export interface IHaveDynamicData {
    entity: any;
    id: string;
}

@Injectable()
export class DynamicTypeBuilder {

      // this object is singleton - so we can use this as a cache
      private _cacheOfTypes  : { [templateKey: string]: any } = {};
      private _cacheOfModules: { [templateKey: string]: any } = {};

      public createComponentAndModule(template: string, styles: string[] = []): {type: any, module: any} {
              // Create root container element for template
        template = '<div #root>' + template + '</div>';

        let module: any;
        let type = this._cacheOfTypes[template];

        if (type) {
               module = this._cacheOfModules[template];
               console.log("Module and Type are returned from cache")
               return { type: type, module: module };
        }
        // unknown template ... let's create a Type for it
        type   = this.createNewComponent(template, styles);
        module = this.createComponentModule(type);

        // cache that type and module - because the only difference would be "template"
        this._cacheOfTypes[template]   = type;
        this._cacheOfModules[template] = module;

        return { type: type, module: module };
      }

      protected createNewComponent (tmpl:string, stys:string[]): any {
          @Component({
              selector: 'dynamic-component',
              template: tmpl,
              styles: stys
          })
          class CustomDynamicComponent  implements IHaveDynamicData {
              @Input() public entity: any;
              @ViewChild('root') public el: ElementRef;
              public id: string = '';
              constructor() {
                  this.id = Math.floor(Math.random() * 89999999 + 10000000).toString();
              }
          };
          // a component for this particular template
          return CustomDynamicComponent;
      }

      protected createComponentModule (componentType: any): any {
          @NgModule({
            imports: [],
            declarations: [
                  componentType
            ],
          })
          class RuntimeComponentModule { }
          // a module for just this Type
          return RuntimeComponentModule;
      }
}
