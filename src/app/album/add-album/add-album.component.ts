import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Album } from '../../models/album';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { AlbumsService } from '../../services/albums.service';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.css'],
})
export class AddAlbumComponent implements OnInit {
  public artistId: string = this.route.snapshot.params['artist'];
  public url: string = environment.apiUrl;
  public actualYear: number = new Date().getFullYear();
  public annos: number[] = [];
  public token: string;
  public filesToUpload: Array<File>;
  public image: File | undefined;

  constructor(
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private userSvc: UserService,
    private router: Router,
    private albumSvc: AlbumsService
  ) {}

  myForm: FormGroup = this.formbuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    year: ['', Validators.required],
    image: [null],
  });

  ngOnInit(): void {
    this.token = this.userSvc.getToken();
    for (let anno = 1900; anno <= this.actualYear; anno++) {
      this.annos.push(anno);
    }
  }

  entradaYear(event) {
    const selectedYear = event.target.value;
    this.myForm.get('year').setValue(selectedYear);
  }

  onSubmit() {
    let title = this.myForm.controls['title'].value;
    let description = this.myForm.controls['description'].value;
    let year = this.myForm.controls['year'].value;
    const album = new Album(title, description, year, '', this.artistId);
    this.albumSvc.addAlbum(this.token, album).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Album created successfully',
        });
        this.router.navigate(['list/1']);
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Ooops...',
          text: 'It seems there was an error',
        });
      },
    });
  }
}
