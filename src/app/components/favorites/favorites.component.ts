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
        this.authSrv.user$.subscribe((userData) => {
            this.user = userData;
            //this.recuperaFavoriti();
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

    recuperaFavoritiStampa() {
        this.pokemonService
            .recuperaFavoriti(this.userId)
            .subscribe((likes: Favourite[]) => {
                this.preferiti = likes;
                this.stampaPreferiti();
            });
    }

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

    getType(pokemon: any): string {
        return this.pokemonService.getType(pokemon);
    }

    //////////////////

    // recuperaFavoriti(): void {
    //     if (this.user) {
    //         //errore possibile array favoriti vuoto
    //         this.pokemonService
    //             .recuperaFavoriti(this.user.user.id)
    //             .subscribe((favoriti: Favourite[]) => {
    //                 console.log(`favoritiii:`, this.favoriti);
    //                 const pokemonIds = favoriti.map(
    //                     (f: Favourite) => f.pokemonId
    //                 );

    //                 //todo check
    //                 this.pokemonService
    //                     .recuperaPokemon()
    //                     .subscribe((pokemons: Pokemon[]) => {
    //                         console.log(`hey`, pokemons);
    //                         this.favoriti = Object.values(pokemons).filter(
    //                             (p: Pokemon) => pokemonIds.includes(p.id)
    //                         );
    //                         console.log(`favoriti:`, this.favoriti);
    //                     });
    //             });
    //     }
    // }
}
