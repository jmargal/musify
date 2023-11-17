import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SongService } from '../services/song.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {

  public token: string;
  public url: string=environment.apiUrl;
  public song: any;
  public album:any;
  public audio;

  constructor(private songSvc:SongService,private userSvc:UserService) {}

  ngOnInit(): void {
    this.getData();

  }

  getData(){
    this.token=this.userSvc.getToken();
  }

}
