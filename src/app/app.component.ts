import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';

import { switchMap, takeUntil, tap } from 'rxjs/operators'
import { DummyService } from './dummy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit , OnDestroy{
  title = 'demo-time';

  hide = false;

  start$ = new Subject();
  stop$ = new Subject();

  private destroy$: Subject<void> = new Subject<void>();

  constructor() {
    // setInterval(() => (this.hide = !this.hide), 1000);
  }

  ngOnInit(){
    this.start$.pipe(
      takeUntil(this.destroy$),
      switchMap(val=>{
        return interval(500).pipe(tap(_=>{
          this.hide = !this.hide
        }) , takeUntil(this.stop$));
      })
    ).subscribe();
  }


  startInterval(){
    this.start$.next();
  }

  stopInterval(){
    this.stop$.next();
  }

  ngOnDestroy(){
    this.destroy$.next();
  }
}
