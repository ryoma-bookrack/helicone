import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { Toaster } from "@/components/ui/sonner";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* HTTP LAN (e.g. http://192.168.x.x) is not a secure context; browsers omit crypto.randomUUID. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var c=globalThis.crypto;if(!c||typeof c.randomUUID==="function")return;var gen=function(){var b=new Uint8Array(16);c.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;var h=Array.from(b,function(x){return x.toString(16).padStart(2,"0")}).join("");return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20)};try{Object.defineProperty(c,"randomUUID",{value:gen,configurable:true,writable:true})}catch(e1){try{Object.defineProperty(Crypto.prototype,"randomUUID",{value:gen,configurable:true,writable:true})}catch(e2){c.randomUUID=gen}}}catch(e){}})();`,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="/__ENV.js" />
        </Head>
        <body>
          <Main />
          <Toaster />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
