import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Musify';
  public user:User;
  public userRegister:User;
  public identity:any;
  public token:string;
  public errorLogin=null;
  public errorRegister=null;
  public registerSuccess:Boolean=false;
  public url:string=environment.apiUrl;

  
  constructor(private userSvc:UserService,private router: Router) {
    this.user = new User('','','','','','','');
    this.userRegister=new User('','','','','','','');
    
  }
  ngOnInit(): void {
    this.identity=this.userSvc.getIdentity();
    this.token = this.userSvc.getToken();
  }

  onSubmit(){
    this.userSvc.login(this.user).subscribe({
      next:(res:any)=> {
        this.identity=res.user;
        localStorage.setItem('identity',JSON.stringify(this.identity));
        this.userSvc.login(this.user,'true').subscribe({
          next:(res:any)=>{
            this.token=res.token;
            if(this.token.length<=0){
              alert('Error generating token')
            }else{
              localStorage.setItem('token',this.token);
            }
          },
          error:(err:any)=>{
            console.log(err);
          }
        })
      },
      error:(err)=> {
        this.errorLogin=err;
        console.log("error",this.errorLogin);
      },
    })
  }

  logOut(){
    localStorage.clear();
    this.user = new User('','','','','','','');
    this.identity=null;
    this.token=null;
    this.router.navigate(['']);

  }

  register(){
    this.userSvc.register(this.userRegister).subscribe({
      next:(resp)=>{
        this.registerSuccess=true;
        this.userRegister=new User('','','','','','','');
      },
      error:(err)=> {
        this.errorRegister=err;
        console.log("error",this.errorRegister);
      }
    })
  }
}
