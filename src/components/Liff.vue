<template>
  <div class="container" ref="container">
    <h4>【手書きメッセージカード】</h4>
    <h4>
      <div id="displayName">こんにちは！{{ displayName }}さん</div>
    </h4>
    <div id="canvas-wrapper" ref="canvasWrapper">
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>
    <div id="btns">
      <button type="button" class="btn btn-primary" @click="share">
        Share
      </button>
      <button id="btnSend" type="button" class="btn btn-info" @click="send">
        Send
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import liff from "@line/liff";
import axios from "axios";
import Vue from "vue";
import SignaturePad from "signature_pad";

// https://qiita.com/shunjikonishi/items/3774486d37af80d1ae47
export type DataType = {
  displayName: string;
  canvasWidth: any;
  canvasHeight: any;
  signaturePad: any;
  canvas: any;
};

// https://stackoverflow.com/questions/56457935/typescript-error-property-x-does-not-exist-on-type-window
// https://www.xspdf.com/resolution/50721364.html
declare global {
  interface Window {
    liff : any;
    Cypress : any;
  }
}

// https://engineering.linecorp.com/ja/blog/vue-js-typescript-otoshidama/
export default Vue.extend({
  name: "Liff",
  data(): DataType {
    return {
      displayName: "",
      canvasWidth: 100,
      canvasHeight: 100,
      signaturePad: "",
      canvas: ""
    };
  },
  async mounted() {
    await this.initializeSignaturePad();
    const myLiffId = await this.getLiffId();
    await this.initializeLiff(myLiffId);
  },
  methods: {
    async initializeSignaturePad() {
      this.canvas = this.$refs.canvas;
      // https://forum.vuejs.org/t/vue-extend-define-type-on-refs-with-typescript/29049
      this.canvasWidth = (this.$refs.canvasWrapper as HTMLElement).clientWidth;
      this.canvasHeight = (this.$refs.canvasWrapper as HTMLElement).clientHeight;
      await this.$nextTick();
      this.signaturePad = new SignaturePad(this.canvas, {
        backgroundColor: "rgb(238,238,238)"
      });
      this.signaturePad.clear();
    },
    async getLiffId() {
      const useNodeJS = true; // if you are not using a node server, set this value to false
      const defaultLiffId = ""; // change the default LIFF value if you are not using a node server
      // if node is used, fetch the environment variable and pass it to the LIFF method
      // otherwise, pass defaultLiffId
      if (useNodeJS) {
        try {
          const response = await fetch("/info");
          const data = await response.json();
          return data.id;
        } catch (error) {
          alert(error);
          throw error;
        }
      } else {
        return defaultLiffId;
      }
    },
    /**
      * Initialize LIFF
      * @param {string} myLiffId The LIFF ID of the selected element
      */
    async initializeLiff(myLiffId: string) {
      const isInCypress = window.Cypress ? true : false;
      // if app is running by Cypress, then uses the liff mock object
      if (isInCypress) {
        window.liff = window.Cypress.liffMock;
      }
      try {
        await liff.init({
            liffId: myLiffId
          });
          if (!liff.isLoggedIn()) {
            liff.login();
          } else {
            try {
              const profile = await liff.getProfile();
              this.displayName = profile.displayName;
            } catch (error) {
              window.alert("Error getting profile: " + error);
              throw error;
            }
          }
      } catch (err) {
        alert(err);
        throw err;
      }
    },
    async share() {
      const imageUrl = await this.saveImage();
      if (liff.isApiAvailable("shareTargetPicker")) {
        try {
          const res = await this.shareMessages(imageUrl, this.displayName);
          if (res) {
            // succeeded in sending a message through TargetPicker
            console.log("Message sent!");
          } else {
            const [majorVer, minorVer] = (liff.getLineVersion() || "").split(".");
            if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
              // LINE 10.3.0 - 10.10.0
              // Old LINE will access here regardless of user"s action
              console.log(
                "TargetPicker was opened at least. Whether succeeded to send message is unclear"
              );
            } else {
              // LINE 10.11.0 -
              // sending message canceled
              console.log("TargetPicker was closed!");
            }
          }
        } catch (error) {
          // something went wrong before sending a message
          console.log("something wrong happen");
        }
      } else {
        window.alert("Failed to launch ShareTargetPicker");
        // throw error;
      }
    },
    async send() {
      const isInCypress = window.Cypress ? true : false;
      // if app is running by Cypress, then uses the liff mock object
      if (isInCypress) {
        window.liff = window.Cypress.liffMock;
      }
      if (!liff.isInClient()) {
        this.sendAlertIfNotInClient();
        return;
      }
      const imageUrl = await this.saveImage();
      
      try {
        await this.sendMessages(imageUrl, this.displayName);
      } catch (err) {
        window.alert("Error sending message: " + err.message);
      }
    },
    async shareMessages(imageUrl: string, displayName: string) {
      return await liff.shareTargetPicker([
        {
          type: "image",
          originalContentUrl: imageUrl,
          previewImageUrl: imageUrl
        },
        {
          type: "text",
          text: "From:" + displayName
        }
      ]);
    },
    async sendMessages(imageUrl: string, displayName: string) {
      await liff.sendMessages([
        {
          type: "image",
          originalContentUrl: imageUrl,
          previewImageUrl: imageUrl
        },
        {
          type: "text",
          text: "From:" + displayName
        }
      ]);
      liff.closeWindow();
    },
    async saveImage() {
      try {
        const response = await axios.post("/save", {
          image: this.signaturePad.toDataURL("image/jpeg")
        });
        return response.data;
      } catch (error) {
        if (error.response) {
          console.log("Status code:" + error.response.status);
        }
        window.alert("Error" + error.message);
        throw error;
      }
    },
    /**
      * Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
      */
    sendAlertIfNotInClient() {
      alert("This button is unavailable as LIFF is currently being opened in an external browser.");
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
