import { Component, Input,
          ViewContainerRef, ViewChild,
          ReflectiveInjector, ComponentFactoryResolver, ComponentRef, Type } from '@angular/core';

import { ITest } from '../../shared/interfaces/iTest';
import { TestBase } from '../../tests/test-base';

import { BalanceTestComponent } from '../../tests/balance-test/balance-test.component';
import { GenericTestComponent } from '../../tests/generic-test/generic-test.component';

@Component({
  selector: 'cortex-dynamic-component',
  entryComponents: [ BalanceTestComponent, GenericTestComponent ],
  template: `<div #dynamicComponentContainer></div>`
})
export class DynamicComponent {
  currentComponent = null;
  currentTest: ITest;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef}) dynamicComponentContainer: ViewContainerRef;


  @Input()
  set componentData(data: { component: any, inputs: any, test: ITest}) {
    if (!data) {
      return;
    }

    // Inputs need to be in the following format to be resolved properly
    const inputProviders = Object.keys(data.inputs).map((inputName) => {
      return {
        provide: inputName,
        useValue: data.inputs[inputName]
      };
    });
    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

    // We create a factory out of the component we want to create
    const factory = this.resolver.resolveComponentFactory(<Type<TestBase>>data.component);

    // We create the component using the factory and the injector
    const component = factory.create(injector);

    // We insert the component into the dom container
    this.dynamicComponentContainer.insert(component.hostView);

    // We can destroy the old component is we like by calling destroy
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    // set test context
    component.instance.test = data.test;
    this.currentComponent = component;
  }

  constructor (private resolver: ComponentFactoryResolver) {

  }
}