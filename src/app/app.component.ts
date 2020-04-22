import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('sidenav') sidenav: MatSidenav;
  title = '楓林晚';
  menuTree = [
    { name: '首頁', link:'index', showInToolbar: false },
    { name: '電影', link:'movies' },
    { name: '台劇', link:'taiwan' },
    { name: '美劇', link:'usa' },
    { name: '陸劇', link:'china' },
    { name: '日劇', link:'japan' },
    { name: '韓劇', link:'korea' },
  ];
  toolbarMenu = this.menuTree.filter(i=>i.showInToolbar!==false);
  isLoading = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    // for Github Page's routing hack with 404.html
    let routePath = sessionStorage.getItem('routePath');
    if( routePath ) {
      sessionStorage.removeItem('routePath');
      this.router.navigate([routePath]);
    }

    // gdpr cookie policy
    if( document.cookie.search(/accept-cookie/i) === -1 ) {
      let snackBarRef = this.snackBar.open('本網站使用cookies以提昇您的使用體驗及統計。繼續使用本網站表示您同意我們使用cookies。',
      '同意', { horizontalPosition: 'right'});
      snackBarRef.afterDismissed().subscribe(() => {
        document.cookie = 'accept-cookie=true;';
      });
    }
  }
  mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  closeSidenav(): void {
    this.sidenav.close();
  }

  exportExcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('main-data-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Exported Data');

    /* save to file */
    XLSX.writeFile(wb, `${this.title}-${new Date().toISOString().split('T')[0]}.xlsx` );
  }
}
