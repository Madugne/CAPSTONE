import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Favourite } from '../models/favourite.interface';
import { AuthService } from '../auth/auth.service';
import { Pokemon } from '../models/pokemon.interface';

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    private url: string = environment.apiUrl + 'pokemon/';
    private _pokemons: any[] = [];
    private _next: string = '';

    apiUrl = environment.apiUrl;
    baseUrl = environment.baseURL;

    private _favorites: any[] = [];

    constructor(private http: HttpClient, private authSrv: AuthService) {}

    get pokemons(): any[] {
        return this._pokemons;
    }

    get next(): string {
        return this._next;
    }

    set next(next: string) {
        this._next = next;
    }

    getType(pokemon: any): string {
        return pokemon && pokemon.types.length > 0
            ? pokemon.types[0].type.name
            : '';
    }

    get(name: string): Observable<any> {
        const url = `${this.url}${name}`;
        return this.http.get<any>(url);
    }

    getNext(): Observable<any> {
        const url = this.next === '' ? `${this.url}?limit=100` : this.next;
        return this.http.get<any>(url);
    }

    getEvolution(id: number): Observable<any> {
        const url = `${environment.apiUrl}evolution-chain/${id}`;
        return this.http.get<any>(url);
    }

    getSpecies(name: string): Observable<any> {
        const url = `${environment.apiUrl}pokemon-species/${name}`;
        return this.http.get<any>(url);
    }

    recuperaFavoriti(userId: number) {
        return this.http.get<Favourite[]>(
            `${this.baseUrl}favorites?userId=${userId}`
        );
    }

    recuperaPokemon() {
        return this.http.get<Pokemon[]>(`${this.apiUrl}`);
    }

    aggiungiFavorito(favorito: Favourite) {
        return this.http.post(`${this.baseUrl}favorites`, favorito);
    }

    rimuoviFavorito(favoritoId: number) {
        return this.http.delete(`${this.baseUrl}favorites/${favoritoId}`);
    }

    recuperaPreferiti() {
        const utente = JSON.parse(localStorage.getItem('user')!);
        const id = utente.user.id;
        return this.http.get<Favourite[]>(
            `${this.baseUrl}favorites?userId=${id}`
        );
    }

    dettaglioPreferito(id: number) {
        return this.http.get<Pokemon>(`${this.apiUrl}pokemon/${id}`);
    }
}
