import { Component, OnInit } from '@angular/core';
import { Artist } from '../../models/artist';
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.css']
})
export class AddArtistComponent implements OnInit {

  public title: string='Add artist';
  public artist:Artist;


  constructor(private svc:ArtistService,private userSvc:UserService,private router:Router) { 
    this.artist =new Artist('','','');
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const token=this.userSvc.getToken();
    this.svc.addArtist(token,this.artist).subscribe({
      next:(resp)=>{
        this.router.navigate(['list/1']);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
