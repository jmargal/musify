import { Component, OnInit } from '@angular/core';
import { Artist } from '../../models/artist';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
})
export class ArtistListComponent implements OnInit {
  public title: string = 'Artist List';
  public artistList: Artist[];
  public identity: any;
  public token: string;
  public url: string = environment.apiUrl;
  public actualPage: number;
  public block: boolean = false;

  constructor(
    private userSvc: UserService,
    private artistSvc: ArtistService,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.identity = this.userSvc.getIdentity();
    this.token = this.userSvc.getToken();
    this.actualPage=this.route.snapshot.params['page'];
    this.getArtistList();
  }

  changePage(direction: 'next' | 'prev') {
    if (direction === 'next') {
      this.actualPage++;
    } else if (direction === 'prev' && this.actualPage > 1) {
      this.actualPage--;
    }
    if (this.artistList.length < 4) {
      this.block = true;
    } else {
      this.block = false;
    }
    this.router.navigate([`list/${this.actualPage}`]);
    this.getArtistList();
  }

  goAddArtist() {
    this.router.navigate(['add-artist']);
  }

  goEditArtist(id: string) {
    this.router.navigate(['edit-artist/' + id]);
  }

  seeArtist(id: string) {
    this.router.navigate(['see-artist/' + id,this.actualPage]);
  }

  deleteArtist(id: string, name: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are going to delete artist with id: ' + name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.artistSvc.deleteArtist(this.token, id).subscribe({
          next: () => {
            this.getArtistList();
          },
          error: (err) => {
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Ooops...',
              text: 'Something went wrong',
            });
          },
        });
      }
    });
  }

  getArtistList() {
    this.artistSvc.getArtists(this.token, this.actualPage).subscribe({
      next: (value) => {
        this.artistList = value.artists;
        if (this.artistList.length < 4) {
          this.block = true;
        } else {
          this.block = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
