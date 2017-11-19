import * as emojione from 'emojione';

class EmojiUtil {
  static defaultImageSrc = 'https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/2753.png';

  static convertUnicodeOrShortNameToShortName(unicodeOrShortName: string) {
    // per the emojione api: this will convert unicode to a shortName
    // if the input is already a shortName, it will leave it alone
    return emojione.toShort(unicodeOrShortName);
  }

  static isValidUnicodeOrShortName(unicodeOrShortName: string) {
    const shortName = EmojiUtil.convertUnicodeOrShortNameToShortName(unicodeOrShortName);

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

  static _parseSrcFromImageHTMLString(imageHTMLString: string) {
    const srcRegex = new RegExp(/src="(.*)"/);
    const match = srcRegex.exec(imageHTMLString);

    if (match !== null && match.length >= 2) {
      return match[1];
    } else {
      return EmojiUtil.defaultImageSrc;
    }
  }
  
  static getImageSrcByUnicodeOrShortName(unicodeOrShortName: string) {
      if (EmojiUtil.isValidUnicodeOrShortName(unicodeOrShortName)) {
        const shortName = EmojiUtil.convertUnicodeOrShortNameToShortName(unicodeOrShortName);
        const imageHTMLString = emojione.shortnameToImage(shortName);
        return EmojiUtil._parseSrcFromImageHTMLString(imageHTMLString);
      }

      // if the shortName is invalid (hopefully we didn't let it get this far) return the '?' emoji
      return EmojiUtil.defaultImageSrc;
  }
}

export default EmojiUtil;
