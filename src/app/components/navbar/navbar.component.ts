import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    utente!: Auth | null;

    constructor(private authSrv: AuthService) {}

    //recupero dati dell'utente loggato
    ngOnInit(): void {
        this.authSrv.user$.subscribe((_utente) => {
            this.utente = _utente;
        });
    }

    //fa il logout dell'utente loggato
    logout() {
        this.authSrv.logout();
    }

    //torna in cima alla pagina al click della freccia nella navbar
    scrollTo() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
