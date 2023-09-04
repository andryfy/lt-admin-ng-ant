import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { fnGetRandomNum } from '@app/utils/tools';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NzTypographyModule, NzGridModule, NzAvatarModule, NzResultModule, NgFor, NgIf, NzIconModule, NzButtonModule, FormsModule, ReactiveFormsModule, NzInputModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @Output() readonly changeShows = new EventEmitter<boolean>();
  validateForm!: FormGroup;
  messageArray: Array<{ msg: string; dir: 'left' | 'right'; isReaded: boolean }> = [];
  isSending = false;
  show = false;
  randomReport: string[] = [
    "Sorry, I'm busy right now and I don't want to talk to you later.",
    'Hello, send a one dollar to automatically unlock the chat mode',
    "Hello, I'm not bored now. I hope you can find me again when you are bored.",
    'Your cutie is rushing to your chat interface in eight hundred miles',
    'The Fairy Castle woke up from a nap and replied to you',
    'Gulu Gulu Demon Fairy Castle hotline is connected for you',
    "Don't bother me, I'm making bubbles Ooooooo",
    "Dad's Antique Shop, please leave a message if you have any questions",
    "I didn't come back but went to pull carrots Ooo",
    "I don't like to reply messages, I feel like I was a do-not-disturb in my previous life",
    'Please press 1 for manual service',
    'Currently sold out, welcome to visit next time',
    "I'm going to the universe to catch stars, I'll be back soon",
    "Don't come to me, I'll give you money if you need anything",
    'Hello, I am an automatic reply, your chat partner is temporarily unavailable',
    'You can chat with me, but I only know this sentence',
    'What are you doing, I am your Grandpa Niu',
    'Congratulations on unlocking my little cutie',
    "I'm going to buy some oranges, you're right here, don't move around",
    "I'm going to be Xizhilang, come back and bring spacemen to you",
    'The other party is trying to connect with you, please wait a moment, the current progress is 1%',
    "Oh my god, my brain hurts, my brain hurts, I don't have money to pay Internet fees, my brain hurts",
    'Welcome to the Sand Sculpture Service Hotline, press 1 for manual chat, press 2 for voice chat, and press 3 for video chat',
    'Response skills are on cooldown',
    'Your message has been delivered, but the other party has received it, but has not responded',
    'Sorry, the user you contacted is too good',
    'It has been deleted by Tencent, please contact 10086 for more details',
    "Wait for me, I will use Fang Tian's painting halberd to peel an apple for you later",
    'Please enter I love you 520 times to summon me',
    "If you don't reply to the message, you are herding the sheep. If you don't reply all the time, the sheep is lost",
    'Because of leaking the ancestral secret recipe of Krab King, the Marine Supervision Bureau has captured her, and she will take the initiative to contact you when she is released',
    "Well, keep talking, I'm listening.",
    'You are the beauty limited to summer',
    'Will reply within the appreciation period',
    'On the way to make an appointment with you',
    "Hey, this is the Krab King restaurant in Bikini Beach, I'm frying the meatloaf in the super crab burger,",
    'If you need anything, please find Brother Octopus, beep beep beep beep',
    'xx and I went to be astronauts and we will catch aliens for you when we come back',
    'Drowned in the ocean of learning',
    "The old demon from Montenegro and I went to the back mountain to discuss eating Tang Monk. We'll talk about it when we come back.",
    'What?',
    "Speak up! I can't hear you!",
    "If you don't go back, you'll be in the canyon",
    "If you don't come back, you will be buried in the canyon",
    "If you don't return, you are eating chicken.",
    "If you don't come back, you will be eaten by chickens",
    'I went to the universe',
    'Come back and pick stars for you',
    'Hello',
    'Our boss is saving the galaxy',
    'Come back after defeating the monsters',
    "Wait a while and you'll see him",
    'The owner said that if you want to know her whereabouts you need a packet of tomato-flavored potato chips',
    'Fish, the pond master went out to cast the net and came back to favor you.',
    "If you have any questions, let's talk about it tonight, the kindergarten is not out yet",
    'Guest officer, please wait a moment, the master is on his way',
    "If you don't reply, you are begging for food",
    'Please shout three times for beauty, and I will appear immediately. If there is no response, it means you are not sincere. Please shout three more times, and so on.',
    'Thanks',
    'Your friend is offline, please contact after transferring money',
    "I'm sorry, the other party is too cute,",
    'There are things waiting in line to make an appointment',
    "I'm basking in the sun don't disturb me",
    'There is a ghost inside, it is not convenient to reply now',
    'taking a bath',
    'The other party has been poisoned, send me I love you to detoxify',
    "The other party's network is unstable, please try again later",
    "I'll come down to earth later to meet you ordinary people.",
    'Cultivating in seclusion'
  ];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    console.log('Customer service function is destroyed');
  }

  close(): void {
    this.changeShows.emit(false);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    });
  }

  clearMsgInput(): void {
    setTimeout(() => {
      this.validateForm.get('question')?.reset();
    });
  }

  sendMessage(msg: string, event: Event): void {
    if (!msg.trim()) {
      event.preventDefault();
      event.stopPropagation();
      this.clearMsgInput();
      return;
    }
    this.messageArray.push({ msg, dir: 'right', isReaded: false });
    this.clearMsgInput();

    setTimeout(() => {
      this.isSending = true;
      this.messageArray.forEach(item => {
        if (item.dir === 'right') {
          item.isReaded = true;
        }
      });
      this.cdr.markForCheck();
    }, 1000);

    setTimeout(() => {
      const index = fnGetRandomNum(0, this.randomReport.length);
      this.messageArray.push({ msg: this.randomReport[index], dir: 'left', isReaded: false });

      this.isSending = false;
      this.scrollToBottom();
      this.cdr.detectChanges();
    }, 3000);
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      question: [null]
    });
    this.scrollToBottom();
  }
}
