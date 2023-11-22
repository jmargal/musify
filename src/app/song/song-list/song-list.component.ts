import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from 'src/app/services/albums.service';
import { SongService } from 'src/app/services/song.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  public token: string;
  public idAlbum: string = this.route.snapshot.params['album'];
  public album: any;
  public songList: any[]=[];

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
        this.album = resp;
      },
    });
  }

  playSong(song) {
    const stringSong = JSON.stringify(song);
    const filePath = environment.apiUrl + '/song/file/' + song.file;
    const albumName=this.album.title

    localStorage.setItem('song', stringSong);

    document.getElementById('player').setAttribute('src', filePath);
    document.getElementById('song-name').innerHTML="Playing "+song.name+" of "+albumName;
    (document.getElementById('player') as any).load();
    (document.getElementById('player') as any).play();
  }

  goEdit(id) {
    this.router.navigate(['edit-song', id]);
  }

  goBack() {
    this.router.navigate(['see-album', this.idAlbum]);
  }

  addSong(){
    this.router.navigate(['add-song',this.idAlbum]);
  }

  deleteSong(id, name) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to delete: ' + name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.svc.deleteSong(id).subscribe({
          next: () => {
            this.getData();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Ooops...',
              text: 'There was an error deleting the song',
            });
            console.log(error);
          },
        });
      }
    });
  }
}
