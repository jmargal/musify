import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserEditComponent } from './user-edit/user-edit.component';
import { AppRoutingModule } from './app.routing';
import { ArtistListComponent } from './artist/artist-list/artist-list.component';
import { HomeComponent } from './home/home.component';
import { AddArtistComponent } from './artist/add-artist/add-artist.component';
import { EditArtistComponent } from './artist/edit-artist/edit-artist.component';
import { SeeArtistComponent } from './artist/see-artist/see-artist.component';
import { AddAlbumComponent } from './album/add-album/add-album.component';
import { EditAlbumComponent } from './album/edit-album/edit-album.component';
import { SeeAlbumComponent } from './album/see-album/see-album.component';
import { AlbumListComponent } from './album/album-list/album-list.component';
import { AddSongComponent } from './song/add-song/add-song.component';
import { EditSongComponent } from './song/edit-song/edit-song.component';
import { SongListComponent } from './song/song-list/song-list.component';
import { PlayerComponent } from './player/player.component';

@NgModule({
  declarations: [AppComponent, UserEditComponent, ArtistListComponent, HomeComponent, AddArtistComponent, EditArtistComponent, SeeArtistComponent, AddAlbumComponent, EditAlbumComponent, SeeAlbumComponent, AlbumListComponent, AddSongComponent, EditSongComponent, SongListComponent, PlayerComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule,ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
