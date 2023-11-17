import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlbumsService } from '../../services/albums.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-see-album',
  templateUrl: './see-album.component.html',
  styleUrls: ['./see-album.component.css']
})
export class SeeAlbumComponent implements OnInit {

  public token: string;
  public id: string = this.route.snapshot.params['id'];
  public album:any;
  public url:string=environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private userSvc: UserService,
    private albumSvc: AlbumsService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.token = this.userSvc.getToken();
    this.getAlbum();
  }

  getAlbum(): void {
   this.albumSvc.getAlbum(this.token,this.id).subscribe({
    next:(resp:any)=>{
      this.album=resp;
    },
    error:(err)=>{
      console.log(err)
    }
   }) 
  }

  editAlbum(id:string){
    this.router.navigate(['edit-album',id]);
  }

  goBack(){
    this.router.navigate(['see-artist',this.album.artist._id]);
  }

  addSong(){
    this.router.navigate(['add-song',this.album._id]);
  }

  
  goSongs() {
    this.router.navigate(['see-songs',this.album._id]);
  }


}
