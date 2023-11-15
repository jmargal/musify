import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { environment } from 'src/environments/environment';
import { Album } from '../../models/album';
import { AlbumsService } from '../../services/albums.service';

@Component({
  selector: 'app-see-artist',
  templateUrl: './see-artist.component.html',
  styleUrls: ['./see-artist.component.css'],
})
export class SeeArtistComponent implements OnInit {

  public token: string;
  public id: string = this.route.snapshot.params['id'];
  public page:number;
  public artist: any;
  public identity:any;
  public url:string=environment.apiUrl;
  public albums:Album[] = [];


  constructor(
    private route: ActivatedRoute,
    private svc: ArtistService,
    private userSvc: UserService,
    private albumSvc: AlbumsService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.identity = this.userSvc.getIdentity();
    this.route.params.subscribe(params => {this.page=params.page});
    this.token = this.userSvc.getToken();
    this.getArtist();
  }

  getArtist(){
    this.svc.getArtist(this.token, this.id).subscribe({
      next: (resp) => {
        this.artist = resp;
        this.albumSvc.albumsOfArtist(this.token,this.artist.artist._id).subscribe({
          next:(value:any) =>{
            this.albums=value.albums
          },
          error(err) {
            console.log(err);
          },
        })
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addAlbum(){
    this.router.navigate([`/add-album/${this.id}`]);
  }
  
  goAlbum(id:string){
    this.router.navigate(['see-album',id])
  }
}
