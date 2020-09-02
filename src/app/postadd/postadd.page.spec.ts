import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostaddPage } from './postadd.page';

describe('PostaddPage', () => {
  let component: PostaddPage;
  let fixture: ComponentFixture<PostaddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostaddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostaddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
