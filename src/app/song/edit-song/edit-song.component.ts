import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/models/album';
import { Song } from 'src/app/models/song';
import { AlbumsService } from 'src/app/services/albums.service';
import { SongService } from 'src/app/services/song.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.css'],
})
export class EditSongComponent implements OnInit {
  public token: string;
  public id: string = this.route.snapshot.params['id'];
  public albumId: string;
  public song: Song;
  public album: Album;
  public url: string = environment.apiUrl;
  public audio: File | undefined;
  public filesToUpload: Array<File>;
  public numberOfAlbums: number[];
  public charged:boolean=false;
  private myForm: FormGroup;



  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private userSvc: UserService,
    private router: Router,
    private albumSvc: AlbumsService,
    private songSvc: SongService
  ) {}


  ngOnInit(): void {
    this.getData();
    this.myForm = this.formbuilder.group({
      name: ['', Validators.required],
    });
    this.charged=true;
  }

  getData() {
    this.token = this.userSvc.getToken();
    this.songSvc.getSong(this.token, this.id).subscribe({
      next: (resp: any) => {
        this.song = resp.song;
        this.albumId = this.song.album;
        this.albumSvc.getAlbum(this.token, this.albumId).subscribe({
          next: (resp: any) => {
            this.album = resp;
          },
          error(err) {
            console.log(err);
          },
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Ooops...',
          text: 'It seems there was an error',
        });
        this.router.navigate(['']);
      },
    });
  }

  isAudioFile(file: File | undefined): boolean {
    const allowedExtensions = ['mp3', 'ogg'];
    const fileExtension = file?.name.split('.').pop()?.toLowerCase();
    return (
      fileExtension !== undefined && allowedExtensions.includes(fileExtension)
    );
  }

  isValidName() {
    return (
      this.myForm?.controls['name'].touched && this.myForm?.controls['name'].errors
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
        formData.append('file', files[i], files[i].name);
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

  getFields(){
    const name = this.myForm?.controls['name'].value;
    let audioToSend;
    if(!this.audio){
      audioToSend=this.song.file;
    }else{
      if(!this.isAudioFile(this.audio)){
        Swal.fire({
          icon: 'error',
          title: 'Invalid file',
          text: 'Please select a valid audio file.',
        });
      }
    }   
    const song = new Song(this.song.number, name, this.song.duration, audioToSend, this.albumId);
    return song;
    }

  onSubmit() {
    const song=this.getFields();
    this.songSvc.editSong(this.token,song,this.id).subscribe({
      next:(resp:any)=>{
        if(this.filesToUpload!=null){
          this.makeFileRequest(
            environment.apiUrl + '/song/file/' + resp.song._id,
            [],
            this.filesToUpload
          )
        }
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Song added successfully',
        });
        this.router.navigate(['see-album', this.albumId]);
      },
      error(err) {
        Swal.fire({
          icon: 'error',
          title: 'Ooops...',
          text: 'It seems there was an error',
        });
      },
    });
  }
}
