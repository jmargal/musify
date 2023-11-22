import { Component, OnInit } from '@angular/core';
import { Artist } from '../../models/artist';
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.css']
})
export class AddArtistComponent implements OnInit {

  public title: string='Add an artist';
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
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Artist created successfully',
        })
        this.router.navigate(['list/1']);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
