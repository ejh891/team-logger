import * as emojione from 'emojione';

class EmojiUtil {
    static isValidShortName(shortName: string) {
      // must start with a colon
      if (shortName[0] !== ':') { return false; }

      // must end with a colon
      const indexOfLastChar = shortName.length - 1;
      if (shortName[indexOfLastChar] !== ':') { return false; }

      // must have exactly 2 colons
      if (shortName.slice(1, indexOfLastChar).includes(':')) { return false; }

      // try to fetch the image from emojione
      const emojioneImageResult = emojione.shortnameToImage(shortName);

      // per the emojione api: if the search didn't work, result will just contain the string that we searched for
      if (emojioneImageResult === shortName) { return false; }

      return true;
    }

    static _parseSrcFromImageTag(imageHTMLString: string) {
      const srcRegex = new RegExp(/src="(.*)"/);
      const match = srcRegex.exec(imageHTMLString);
  
      if (match !== null && match.length >= 2) {
        return match[1];
      } else {
        return '';
      }
    }
    
    static getImageSrcByShortName(shortName: string) {
        if (EmojiUtil.isValidShortName(shortName)) {
          const imageHTMLString = emojione.shortnameToImage(shortName);
          return EmojiUtil._parseSrcFromImageTag(imageHTMLString);
        }

        // if the shortName is invalid (hopefully we didn't let it get this far) return the '?' emoji
        return 'https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/2753.png';
    }
}

export default EmojiUtil;
