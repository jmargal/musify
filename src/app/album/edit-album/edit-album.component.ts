import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumsService } from '../../services/albums.service';
import { UserService } from '../../services/user.service';
import { environment } from 'src/environments/environment';
import { Album } from '../../models/album';
import { ArtistService } from '../../services/artist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.css'],
})
export class EditAlbumComponent implements OnInit {
  public title: string = 'Edit "';
  public album: any;
  public token: string;
  public id: string = this.route.snapshot.params['id'];
  public image: File | undefined;
  public filesToUpload: Array<File>;
  public actualYear: number = new Date().getFullYear();
  public annos: number[] = [];
  public artistNames: string[] = [];
  public nameArtist: any;
  public actualArtist: any;
  public artistId:string;
  public url: string = environment.apiUrl;
  private myForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private svc: AlbumsService,
    private artistSvc: ArtistService,
    private userSvc: UserService,
    private formbuilder: FormBuilder,
    private router: Router
  ) {}



  ngOnInit(): void {
    this.getData();    
  }

  getData() {
    this.token = this.userSvc.getToken();
    this.svc.getAlbum(this.token, this.id).subscribe({
      next: (album) => {
        this.album = album;
        this.title += this.album.title + '"';
        this.artistSvc.getArtist(this.token, this.album.artist._id).subscribe({
          next: (artist) => {
            this.actualArtist = artist;
            this.nameArtist = this.actualArtist.artist.name;
          },
          error(err) {
            console.log(err);
          },
        });
      },
      error(err) {
        console.log(err);
      },
    });
    this.artistSvc.getArtists(this.token, 1, 99).subscribe({
      next: (value) => {
        const artistNames = value.artists.map((artist) => artist.name);
        this.artistNames = artistNames;
      },
      error(err) {
        console.log(err);
      },
    });
    for (let anno = 1900; anno <= this.actualYear; anno++) {
      this.annos.push(anno);
    }
    this.myForm = this.formbuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      year: ['', Validators.required],
      artist: [this.nameArtist, [Validators.required]],
      image: [null],
    });

  }

  entradaYear(event) {
    const selectedYear = event.target.value;
    this.myForm.get('year').setValue(selectedYear);
  }

  isArtistValid():boolean {
    const artistControl = this.myForm.get('artist').value;
    let artistExists:boolean=false;
    if (this.artistNames.includes(artistControl)) {
      artistExists=true;
    }else{
      this.myForm?.setErrors({'error':true})
    }
    return this.myForm?.controls['artist'].touched && !artistExists;
  }

  isValidName(){
    return this.myForm?.controls['title'].touched && this.myForm?.controls['title'].errors;
  }


  validDescription() {
    return this.myForm?.controls['description'].touched && this.myForm?.controls['description'].errors
  }

  isImageFile(file: File | undefined): boolean {
    const allowedExtensions = ['jpg', 'jpeg', 'png','webp'];
    const fileExtension = file?.name.split('.').pop()?.toLowerCase();
    return (
      (fileExtension !== undefined && allowedExtensions.includes(fileExtension))
    );
  }

  fileChangeEvent(file: any) {
    this.filesToUpload = <Array<File>>file.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', this.token);
      xhr.send(formData);
    });
  }

  getFields() {
    let title = this.myForm?.controls['title'].value;
    let description = this.myForm?.controls['description'].value;
    let year = this.myForm?.controls['year'].value;
    let artist = this.myForm?.controls['artist'].value;
    this.artistSvc.getArtistByName(this.token,artist).subscribe({
      next:(value) =>{
      this.artistId=value.artist._id
      },
      error:(err) =>{
        console.log(err)
      }
    })
    let img = this.image;
    if (img && !this.isImageFile(img)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image',
        text: 'Please select a valid image file.',
      });
    }
    const album = new Album(title, description, year, img,this.artistId);
    return album;
    
  }

  onSubmit(){
    const album =this.getFields();
      this.svc.editdAlbum(this.token,this.id,album).subscribe({
        next: () =>{
          if(this.filesToUpload!=null){
            this.makeFileRequest(environment.apiUrl+'/album/image/'+this.album._id,[],this.filesToUpload).then(
              (result:any)=>{
                this.album.image=result.image;
              }
            )
          }
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Artist updated successfully',
          });
          this.router.navigate(['list/1']);
        },
        error:(err) =>{
          console.log(err);
          Swal.fire({
              icon: 'error',
              title: 'Ooops...',
              text: 'It seems there was an error',
            });
          }
        
      });
  }

  goBack(){
    this.router.navigate([`see-album/${this.id}`]);
  }
}
