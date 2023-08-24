import { Component, Input, OnInit } from '@angular/core';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

import { Article } from 'src/app/interfaces';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  implements OnInit {

  @Input() article!: Article;
  @Input() index!: number;

  constructor(
    private inAppBrowser: InAppBrowser,
    private platForm: Platform,
    private actioSheetControler: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService

    ) { }

  ngOnInit() {}

  async onOpenMenu(){

    const articleInfavorite = this.storageService.articleInFavorte( this.article );

    const normalBtns: ActionSheetButton[] = [
      {
        text: articleInfavorite ? 'Remover favorito' : 'Favoritos',
        icon: articleInfavorite ? 'heart' : 'heart-outline',
        handler: ()=> this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ]
    const share: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: ()=> this.onShareArticle()
    };

    if (  this.platForm.is( 'capacitor' )){
      normalBtns.unshift(share)
    }

    const actioSheet = await this.actioSheetControler.create({
      header:'Opciones',
      buttons: normalBtns
    });


    await actioSheet.present();
  }

  openArticle(){

    if ( this.platForm.is('ios') || this.platForm.is('ios')){
      const browser = this.inAppBrowser.create( this.article.url );
      browser.show();
      return
    }

    window.open( this.article.url, '_blank' );
  }

  onShareArticle(){
    const { title, url, source:{ name }} = this.article
    this.socialSharing.share(
      title,
      name,
      undefined,
      url
    )
  }

  onToggleFavorite(){
    this.storageService.saveRemoveArticle(this.article);
  }

}
