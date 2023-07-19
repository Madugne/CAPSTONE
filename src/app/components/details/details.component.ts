import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    utente!: Auth | null;
    constructor(private authSrv: AuthService) {}

    //recupero dati dell'utente loggato
    ngOnInit(): void {
        this.authSrv.user$.subscribe((_utente) => {
            this.utente = _utente;
        });
    }
}
