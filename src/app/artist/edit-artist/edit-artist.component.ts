import { Component, OnInit } from '@angular/core';
import { Artist } from '../../models/artist';
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-artist',
  templateUrl: './edit-artist.component.html',
  styleUrls: ['./edit-artist.component.css'],
})
export class EditArtistComponent implements OnInit {
  public title: string;
  public artist: any;
  public token: string;
  public id: string = this.route.snapshot.params['id'];
  public image: File | undefined;
  public filesToUpload:Array<File>;
  public url:string=environment.apiUrl;




  constructor(
    private route: ActivatedRoute,
    private svc: ArtistService,
    private userSvc: UserService,
    private formbuilder: FormBuilder,
    private router: Router,
  ) {}

  myForm: FormGroup = this.formbuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.min(5)]],
    image: [null]
  });

  ngOnInit(): void {
    this.token = this.userSvc.getToken();
    this.svc.getArtist(this.token, this.id).subscribe({
      next: (resp) => {
        this.artist = resp;
        this.title="Edit "+this.artist.artist.name;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isImageFile(file: File | undefined): boolean {
    const allowedExtensions = ['jpg', 'jpeg', 'png','webp'];
    const fileExtension = file?.name.split('.').pop()?.toLowerCase();
    return (fileExtension !== undefined && allowedExtensions.includes(fileExtension));
  }
  
  fileChangeEvent(file:any){
    this.filesToUpload=<Array<File>>file.target.files;
  }

  isValidName(){
    return this.myForm?.controls['name'].touched && this.myForm?.controls['name'].errors ;
  }

  isValidDescription() {
    const descriptionControl = this.myForm?.controls['description'];  
    return descriptionControl?.touched && (
      descriptionControl.errors ||
      (descriptionControl.value && descriptionControl.value.trim() === '' && descriptionControl.value.includes('\n'))
    );
  }
  
  
  

  makeFileRequest(url: string, files: Array<File>) {
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

  onSubmit(){
    let name = this.myForm?.controls['name'].value;
    let description = this.myForm?.controls['description'].value;
    let img = this.filesToUpload[0];
    if (img!=null && !this.isImageFile(img)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image',
        text: 'Please select a valid image file.',
      });
    }else{
      const editArtist=new Artist(name,description,'')
      this.svc.editArtist(this.token,this.id,editArtist).subscribe({
        next: (resp) => {
          if(this.filesToUpload!=null){
            this.makeFileRequest(environment.apiUrl+'/artist/image/'+this.artist.artist._id,this.filesToUpload).then(
              (result:any)=>{
                this.artist.artist.image=result.image;
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
          },
      })
    }
  }

  goBack(){
    this.router.navigate([`list`,1]);
  }
}
