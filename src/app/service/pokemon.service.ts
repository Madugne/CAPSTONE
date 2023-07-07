import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    private url: string = environment.apiUrl + 'pokemon/';
    private _pokemons: any[] = [];
    private _next: string = '';

    private _favorites: any[] = [];

    constructor(private http: HttpClient) {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            this._favorites = JSON.parse(storedFavorites);
        }
    }

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

    addToFavorites(pokemon: any): void {
        this._favorites.push(pokemon);
    }

    get favorites(): any[] {
        return this._favorites;
    }

    removeFromFavorites(pokemon: any): void {
        const index = this._favorites.findIndex((p) => p.id === pokemon.id);
        if (index !== -1) {
            this._favorites.splice(index, 1);
            this.saveFavorites();
        }
    }

    private saveFavorites(): void {
        localStorage.setItem('favorites', JSON.stringify(this._favorites));
    }
}
