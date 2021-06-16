import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DummyService } from 'src/app/dummy.service';

@Component({
  selector: 'app-sub',
  templateUrl: './sub.component.html',
  styleUrls: ['./sub.component.scss']
})
export class SubComponent implements OnInit {

  rand = Math.random();
  rand2 = 0;
  objtest = { label: 'a' };
  subject = new BehaviorSubject(42);

  sub = new Subscription();

  arr:number[] = [];

  form = new FormGroup({
    control1: new FormControl()
  });

  /** Emits when the component is destroyed */
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dummyService: DummyService) {
    for (let i = 0; i <  100000; ++i) { //mockmemory in subcomponent
      this.arr.push(Math.random());
    }
    // no leak - component is cleaned up
    // this.subject.subscribe();
    // no leak - component is cleaned up
    // this.subject.subscribe(() => {const blub = 34;});
    // no leak - component is cleaned up
    // this.subject.subscribe(() => (this.rand2 = 33));
    // small leak - empty anonymous function remains in heap
    // this.dummyService.behavior$.subscribe(val => {
    //   this;
    // });
    // FIXED
    // this.dummyService.behavior$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(val => {
    //     this;
    //   });
    // small leak - small anonymous function remains in heap
    // this.dummyService.behavior$.subscribe(() => {const blub = 34;});
    // FIXED
    // this.dummyService.behavior$.pipe(takeUntil(this.destroy$)).subscribe(() => {});
    // (!) large leak - anonymous function references the component, thus the component stays in memory
    // this.dummyService.behavior$.subscribe(() => (this.rand2 = 33));
    // FIXED
    // this.dummyService.behavior$.pipe(takeUntil(this.destroy$)).subscribe(() => this.rand2 = 33);
    // (!) large leak - the subscription from the shareReplay operator to the source is never unsubscribed, thus the component stays in the heap
    // this.sub.add(
    //   this.dummyService.behavior$
    //     .pipe(
    //       tap(() => (this.rand2 = 44)),
    //       shareReplay(1)
    //     )
    //     .subscribe(() => (this.rand2 = 33))
    // );
    // FIXED
    // this.dummyService.behavior$.pipe(tap(() => this.rand2 = 44), takeUntil(this.destroy$), shareReplay(1), takeUntil(this.destroy$)).subscribe(() => this.rand2 = 33);
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.sub.unsubscribe();
  }

}
