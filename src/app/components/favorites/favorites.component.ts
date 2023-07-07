import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie.interface';
import { Favourite } from 'src/app/models/favourite.interface';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { PokemonService } from 'src/app/service/pokemon.service';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
    constructor(private pokemonService: PokemonService) {}

    get favorites(): any[] {
        return this.pokemonService.favorites;
    }

    ngOnInit(): void {}
}
