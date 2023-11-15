import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from 'src/app/services/albums.service';
import { SongService } from 'src/app/services/song.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  public token: string;
  public idAlbum: string = this.route.snapshot.params['album'];
  public album: any;
  public songList: any[];

  constructor(
    private svc: SongService,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private albumSvc: AlbumsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.token = this.userSvc.getToken();
    this.svc.getSongsOfAlbum(this.token, this.idAlbum).subscribe({
      next: (resp: any) => {
        this.songList = resp.songs;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.albumSvc.getAlbum(this.token, this.idAlbum).subscribe({
      next: (resp: any) => {
        this.album=resp;
      }
    });
  }


  
  


}
