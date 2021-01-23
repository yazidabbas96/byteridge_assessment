import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router,ActivatedRoute} from '@angular/router';
import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: User;
    users = [];
    myparams:any;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private router:Router,
        private route:ActivatedRoute
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
        this.route.queryParams.subscribe((data)=>{
            this.myparams=data;
            if(!this.myparams.clickedBy)
            {
                if(this.currentUser.role=="Auditor"){
                    this.router.navigate(['audit'])
                }
            }
        })
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}