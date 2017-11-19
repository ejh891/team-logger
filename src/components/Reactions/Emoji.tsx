import * as React from 'react';
import * as emojione from 'emojione';

import './reactions.css';

interface EmojiProps {
  emojiShortName: string;
  style?: {};
}

class ReactionButton extends React.Component<EmojiProps> {
  render() {
    return (
      <img
        style={this.props.style}
        className="reaction-emoji-image" 
        src={this.getImageSrcFromShortname(this.props.emojiShortName)}
        alt={this.props.emojiShortName}
      />
    );
  }

  getImageSrcFromShortname(shortname: string) {
    const img = emojione.shortnameToImage(shortname);
    
    const srcRegex = new RegExp(/src="(.*)"/);
    const match = srcRegex.exec(img);

    if (match !== null && match.length >= 2) {
      return match[1];
    } else {
      return '';
    }
  }
}

export default ReactionButton;
