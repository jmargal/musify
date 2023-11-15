import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {



  public title:string='Update my data';
  public user:any;
  public identity:any;
  public token:string;
  public filesToUpload:Array<File>;
  public url:string=environment.apiUrl;

  constructor(private userSvc:UserService) { 
  }

  ngOnInit(): void {
    this.identity=this.userSvc.getIdentity();
    this.token = this.userSvc.getToken();
    this.user=this.identity;
  }

  update(){
    this.userSvc.update(this.user).subscribe({
      next:(resp)=>{
        this.user=resp;
        if(this.filesToUpload!=null){
          this.makeFileRequest(environment.apiUrl+'/user/image/'+this.user.user._id,[],this.filesToUpload).then(
            (result:any)=>{
              this.user.image=result.image;
              document.getElementById('image_user').setAttribute('src',environment.apiUrl+'/user/image/'+this.user.image);
            }
          )
        }
        localStorage.setItem('identity',JSON.stringify(this.user.user));
        document.getElementById('name_user').innerHTML=this.user.user.name;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User updated successfully',
        })
        this.ngOnInit();
      },
      error(err) {
        console.log(err);
      },
    })
  }

  fileChangeEvent(file:any){
    this.filesToUpload=<Array<File>>file.target.files;
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


}
