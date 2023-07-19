import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from 'src/app/service/pokemon.service';
import { Router } from '@angular/router';
import { Auth } from 'src/app/auth/auth.interface';
import { Favourite } from 'src/app/models/favourite.interface';
import { Pokemon } from 'src/app/models/pokemon.interface';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
    loading: boolean = false;

    subscriptions: Subscription[] = [];

    utente!: any;
    favoriti: Favourite[] = [];

    // SEARCHBAR

    term = '';

    // SEARCHBAR

    constructor(
        private pokemonService: PokemonService,
        private router: Router
    ) {
        this.utente = localStorage.getItem('user');
        this.utente = JSON.parse(this.utente);
    }

    //chiamata all'api che mi prende tutti i pokemon
    get pokemons(): any[] {
        return this.pokemonService.pokemons;
    }

    //aggiunge una nuova sottoscrizione all'array subscriptions
    set subscription(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    //do la possibilita' di caricare piu pokemon nella pagina tramite la funzione loadMore
    //dopo il login mi recupero eventuali preferiti
    ngOnInit(): void {
        if (!this.pokemons.length) {
            this.loadMore();
        }
        this.pokemonService
            .recuperaPreferiti()
            .subscribe((pokemon) => (this.favoriti = pokemon));
    }

    //distruggo eventuali subscription attive prima che il componente venga distrutto
    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription ? subscription.unsubscribe() : 0
        );
    }

    //funzioni per caricare altri pokemon dall'api
    loadMore(): void {
        this.loading = true;
        this.subscription = this.pokemonService.getNext().subscribe(
            (response) => {
                this.pokemonService.next = response.next;
                const details = response.results.map((i: any) =>
                    this.pokemonService.get(i.name)
                );
                this.subscription = concat(...details).subscribe(
                    (response: any) => {
                        this.pokemonService.pokemons.push(response);
                    }
                );
            },
            (error) => console.log('Error Occurred:', error),
            () => (this.loading = false)
        );
    }

    //prende il tipo del pokemon tramite api
    getType(pokemon: any): string {
        return this.pokemonService.getType(pokemon);
    }

    //aggiunge il pokemon ai favoriti al click del bottone
    aggiungiFavorito(idPokemon: number): void {
        const favorito: Favourite = {
            userId: this.utente!.user.id,
            pokemonId: idPokemon,
        };

        this.pokemonService.aggiungiFavorito(favorito).subscribe(() => {
            this.pokemonService
                .recuperaFavoriti(this.utente!.user.id)
                .subscribe((response) => {
                    this.favoriti = response;
                });
        });
    }

    //elimina il pokemon dai favoriti al click del bottone
    eliminaFavorito(pokemon: number): void {
        const userId = JSON.parse(localStorage.getItem('user')!).user.id;
        const trovato = this.favoriti.find(
            (favorito) =>
                favorito.pokemonId === pokemon && favorito.userId === userId
        )?.id;
        this.pokemonService.rimuoviFavorito(trovato!).subscribe(() => {
            this.pokemonService
                .recuperaFavoriti(this.utente!.user.id)
                .subscribe((response) => {
                    this.favoriti = response;
                });
        });
    }

    //controlla che il pokemon sia gia' nei favoriti
    isFavorito(pokemon: Pokemon): Favourite | undefined {
        return this.favoriti.find((f) => f.pokemonId === pokemon.id);
    }

    //prende l'id del pokemon favorito
    getIdFavorito(pokemon: Pokemon): number | undefined {
        const favorito = this.favoriti.find((f) => f.pokemonId === pokemon.id);
        return favorito?.id;
    }
}
