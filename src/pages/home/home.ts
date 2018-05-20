import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  letterObj = {
    from: '',
    to: '',
    text: ''
  }

  title = "documento1"

  pdfObj = null;

  constructor(
    public navCtrl: NavController,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener
  ) {

  }

  createPdf(){
    var docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header'},
        { text: new Date().toTimeString(), alignment: 'right'},

        { text: 'From', style: 'subheader'},
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader'},
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0,20,0,20]},

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }

    this.pdfObj = pdfMake.createPdf(docDefinition);

  }

  downloadPdf(){
    if(this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var utf8 = new Uint8Array(buffer);
        var binaryArray = utf8.buffer;
        var blob = new Blob([binaryArray],{ type: 'application/pdf'});

        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace:true}). then(fileEntry => {

          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })

      });

    } else{
      this.pdfObj.download();
    }

  }

}
