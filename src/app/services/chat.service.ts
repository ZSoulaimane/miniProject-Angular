import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';
import { Observable } from 'rxjs'; 
import {AngularFireDatabase,FirebaseListObservable} from 'angularfire2/database';


@Injectable()
export class ChatService {
  user: firebase.User;
  chatMessages!: FirebaseListObservable<ChatMessage[]>;
  chatMessage: ChatMessage = new ChatMessage;
  userName: Observable<string> | undefined;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
    ) {
        this.afAuth.authState.subscribe((auth: null | undefined) => {
          if (auth !== undefined && auth !== null) {
            this.user = auth;
          }
        });
    }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = this.user.email;
    this.chatMessages = this.getMessages();
    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      userName: this.userName,
      email: email });
  }

  getMessages(): FirebaseListObservable<ChatMessage[]> {
    return this.db.list('messages', {
      query: {
        limitToLast: 25,
        orderByKey: true
      }
    });
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return (date + ' ' + time);
  }

}
