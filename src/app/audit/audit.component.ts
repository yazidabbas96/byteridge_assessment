import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {
    selected;
    audits = [];
    currentUser;
    displayedColumns: string[] = ['user', '_id', 'formattedloginTime', 'formattedlogoutTime', 'ip'];
    dataSource: MatTableDataSource<Audit>;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit() {
        this.loadAllAudits();
        this.currentUser = this.authenticationService.currentUserValue;
        this.selected = 'small';
    }

    private loadAllAudits() {
        this.auditService.getAll()
            .pipe(first())
            .subscribe(audits => {
                this.audits = audits;
                this.audits.map((audit) => {
                    let ex1 = new Date(Number(audit.loginTime));
                    let ex2 = new Date(Number(audit.loginTime));
                    audit.formattedloginTime = this.datePipe.transform(ex1, 'dd/MM/yyyy hh:mm:ss a');
                    audit.formattedlogoutTime = this.datePipe.transform(ex2, 'dd/MM/yyyy hh:mm:ss a');
                    return audit;
                })
                this.dataSource = new MatTableDataSource(audits);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            });

    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    changeDateFormat(format) {
        this.audits = this.audits.map((audit) => {
            let ex1 = new Date(Number(audit.loginTime));
            let ex2 = new Date(Number(audit.loginTime));
            if (format.value == "small") {
                audit.formattedloginTime = this.datePipe.transform(ex1, 'dd/MM/yyyy hh:mm:ss a');
                audit.formattedlogoutTime = this.datePipe.transform(ex2, 'dd/MM/yyyy hh:mm:ss a');
            }
            else {
                audit.formattedloginTime = this.datePipe.transform(ex1, 'dd/MM/yyyy HH:mm:ss');
                audit.formattedlogoutTime = this.datePipe.transform(ex2, 'dd/MM/yyyy HH:mm:ss');
            }
            return audit;
        })
        this.dataSource = new MatTableDataSource(this.audits);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
}