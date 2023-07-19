import { Component, OnInit } from '@angular/core';
import { Favourite } from 'src/app/models/favourite.interface';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { PokemonService } from 'src/app/service/pokemon.service';
import { Pokemon } from 'src/app/models/pokemon.interface';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
    user: Auth | null = null;
    pokemon: Pokemon[] = [];
    userId!: number;
    preferiti: Favourite[] = [];

    constructor(
        private pokemonService: PokemonService,
        private authSrv: AuthService
    ) {
        //recupera i favoriti dell'utente attraverso il suo user id e lo manda in stampa
        this.authSrv.user$.subscribe((userData) => {
            this.user = userData;
            if (this.user) {
                this.userId = this.user.user.id;
                this.recuperaFavoritiStampa();
            }
        });
    }

    get pokemons(): any[] {
        return this.pokemonService.pokemons;
    }

    ngOnInit(): void {}

    //recupero i favoriti di uno specifico utente per poi stamparli
    recuperaFavoritiStampa() {
        this.pokemonService
            .recuperaFavoriti(this.userId)
            .subscribe((likes: Favourite[]) => {
                this.preferiti = likes;
                this.stampaPreferiti();
            });
    }

    //stampa i pokemon preferiti attraverso l'id
    stampaPreferiti() {
        this.preferiti.forEach((pok) => {
            if (pok.pokemonId) {
                this.pokemonService
                    .dettaglioPreferito(pok.pokemonId)
                    .subscribe((stampa) => {
                        this.pokemon.push(stampa);
                    });
            }
        });
    }
}
