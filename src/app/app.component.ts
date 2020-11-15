import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {POST_REQUEST, POST_RESPONSE, FETCH_POST_KEYS, FETCH_RESPONSE_KEYS, FETCH_POST, FETCH_POST_RESPONSE} from '../../messages/message-types'
import {IpcRenderer} from 'electron'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'electron-angular-demo';
  posts = []

  private ipc: IpcRenderer 

  constructor(private changeDetection: ChangeDetectorRef){
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }

  ngOnInit(){

    this.ipc.on(POST_RESPONSE, (event, data) => {
      console.log('response: ' + data)
    })

    this.ipc.on(FETCH_RESPONSE_KEYS, (event, data) => {


      this.posts = data

      //wierd behaviour without this the dom isnt updating on the change in the posts array
      this.changeDetection.detectChanges()

      console.log(this.posts)
    })

  }

  sendFetch(){

    this.ipc.send(FETCH_POST_KEYS)
  }

  sendPost(input: HTMLInputElement){
    this.posts.push(input.value)

    const requestData = {
      'key': input.value,
    }

    this.ipc.send(POST_REQUEST, requestData)
  }
}
