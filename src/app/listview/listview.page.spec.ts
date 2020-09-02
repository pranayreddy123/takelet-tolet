import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListviewPage } from './listview.page';

describe('ListviewPage', () => {
  let component: ListviewPage;
  let fixture: ComponentFixture<ListviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
