import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Song } from 'src/app/models/song';
import { AlbumsService } from 'src/app/services/albums.service';
import { SongService } from 'src/app/services/song.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css'],
})
export class AddSongComponent implements OnInit {
  public token: string;
  public idAlbum: string = this.route.snapshot.params['album'];
  public album: any;
  public song: any;
  public numberOfAlbums: number[];
  public audio: File | undefined;
  public filesToUpload: Array<File>;
  private myForm: FormGroup;
  public charged: boolean=false;


  constructor(
    private route: ActivatedRoute,
    private formbuilder: FormBuilder,
    private userSvc: UserService,
    private albumSvc: AlbumsService,
    private router: Router,
    private songSvc: SongService
  ) {}

  ngOnInit(): void {
    this.token = this.userSvc.getToken();
    this.getAlbum();
    this.getNumbersOfSongs();
    this.myForm = this.formbuilder.group({
      name: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern(/^\d+:\d+$/)]],
      number: ['', [Validators.required, Validators.min(1), Validators.max(99)]]
    });
  }

  getAlbum() {
    this.albumSvc.getAlbum(this.token, this.idAlbum).subscribe({
      next: (album) => {
        this.album = album;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getNumbersOfSongs() {
    this.songSvc.getSongsOfAlbum(this.token, this.idAlbum).subscribe({
      next: (resp:any) => {
        this.numberOfAlbums = resp.songs.map((song) => song.number);
        this.charged=true;
      },
      error: (error) => {
        console.log(error);
      },
    });

   
  }

  isValidDuration() {
    return (
      this.myForm?.controls['duration'].touched &&
      this.myForm?.controls['duration'].errors
    );
  }

  isValidName() {
    return (
      this.myForm?.controls['name'].touched && this.myForm?.controls['name'].errors
    );
  }

  isValidNumber() {
    const numberControl = this.myForm.get('number').value;
    let numberExists:boolean=false;
    if (this.numberOfAlbums.includes(numberControl)) {
      numberExists=true;
      this.myForm?.setErrors({'error':true})
    }
    return (
      this.myForm?.controls['number'].touched &&  (this.myForm?.controls['number'].errors || numberExists)
    );
  }

  isAudioFile(): boolean {
    const allowedExtensions = ['mp3', 'ogg'];
    const fileExtension =this.filesToUpload[0]?.name.split('.').pop()?.toLowerCase();
    return (
      fileExtension !== undefined && allowedExtensions.includes(fileExtension)
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

  onSubmit() {
    const name = this.myForm?.controls['name'].value;
    const number = this.myForm?.controls['number'].value;
    const duration = this.myForm?.controls['duration'].value;
    const song = new Song(number, name, duration, null, this.idAlbum);
    let show=false;
    this.songSvc.addSong(this.token, song).subscribe({
      next: (resp: any) => {
        if (this.filesToUpload!=undefined && this.isAudioFile()) {
          show=true;
          this.makeFileRequest(
            environment.apiUrl + '/song/file/' + resp.song._id,
            [],
            this.filesToUpload
          )
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Ooops...',
            text: 'Extension not valid or empty audio, the song has beed added without file',
          });
          this.router.navigate(['see-album', this.idAlbum]);
        }
        if(show){
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Song added successfully',
          });
          this.router.navigate(['see-album', this.idAlbum]);
        }
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

  goBack(){
    this.router.navigate(['see-album', this.idAlbum])
  }
}
