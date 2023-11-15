import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Album } from 'src/app/models/album';
import { AlbumsService } from 'src/app/services/albums.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css'],
})
export class AlbumListComponent implements OnInit {
  public albums: Album[] = [];
  private token: string;
  public identity: any;
  public url: string = environment.apiUrl;


  constructor(private userSvc: UserService, private albumSvc: AlbumsService,private router:Router) {}

  ngOnInit(): void {
    this.token=this.userSvc.getToken();
    this.getAlbums();
  }

  getAlbums(){
    this.albumSvc.getAlbums(this.token).subscribe({
      next:(resp:any) => {
        this.albums=resp.albums;
      }
    })
  }

  goAlbum(id:string){
    this.router.navigate(['see-album',id])
  }
}
