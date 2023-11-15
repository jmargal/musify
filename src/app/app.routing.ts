import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { ArtistListComponent } from './artist/artist-list/artist-list.component';
import { HomeComponent } from './home/home.component';
import { AddArtistComponent } from './artist/add-artist/add-artist.component';
import { EditArtistComponent } from './artist/edit-artist/edit-artist.component';
import { RoleGuard } from './guards/role.guard';
import { SeeArtistComponent } from './artist/see-artist/see-artist.component';
import { AddAlbumComponent } from './album/add-album/add-album.component';
import { EditAlbumComponent } from './album/edit-album/edit-album.component';
import { SeeAlbumComponent } from './album/see-album/see-album.component';
import { AlbumListComponent } from './album/album-list/album-list.component';
import { AddSongComponent } from './song/add-song/add-song.component';
import { EditSongComponent } from './song/edit-song/edit-song.component';
import { SongListComponent } from './song/song-list/song-list.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'see-artist/:id/:page?',component: SeeArtistComponent },
  { path: 'see-artist/:id', redirectTo: 'see-artist/:id/1', pathMatch: 'full' },
  { path: 'add-artist', canActivate:[RoleGuard],component: AddArtistComponent },
  { path: 'edit-artist/:id',canActivate:[RoleGuard], component: EditArtistComponent },

  { path: 'see-album/:id', component:SeeAlbumComponent},
  { path: 'add-album/:artist', canActivate:[RoleGuard],component: AddAlbumComponent},
  { path: 'edit-album/:id',canActivate:[RoleGuard], component: EditAlbumComponent },

  { path: 'add-song/:album',canActivate:[RoleGuard],component:AddSongComponent},
  { path: 'edit-song/:id',canActivate:[RoleGuard],component:EditSongComponent},
  { path: 'see-songs/:album', component:SongListComponent},

  { path: 'edit', component: UserEditComponent },

  { path: 'list/:page', component: ArtistListComponent },
  { path: 'album-list', component: AlbumListComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
